import React, { useState, useRef, useEffect, act } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  AvatarProcessModes,
  ConfirmButtonTextMap,
  EditStoryModes,
  ReplacementWords,
  Stages,
} from "../utils/constants";
import { FaArrowRight } from "react-icons/fa";
import {
  LyricEditState,
  setStoryEleementFileUrl,
} from "../redux/features/lyricEditSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useEditStoryElementMutation,
  useLazyGetProcessedAvatarQuery,
  useProcessAvatarMutation,
} from "../redux/services/chooseCharacterService/chooseCharacterApi";
import { UploadAudioState } from "../redux/features/uploadSlice";
import {
  useLazyGetStoryElementQuery,
  useSceneLLMEndpointMutation,
} from "../redux/services/lyricEditService/lyricEditApi";
import {
  dataURLtoFile,
  getRandomActions,
  startApiPolling,
  uploadJsonAsFileToS3,
} from "../utils/helper";
import { createFolderInS3, uploadFileToS3 } from "../aws/s3-service";
import {
  setCharacterFolderPath,
  setCharacterName,
  setIsCharchaChosen,
  setReplacementWord,
} from "../redux/features/appSlice";
import ImagePreview from "../components/ImagePreview";
import ShimmerWrapper from "../components/Shimmer";
import AvatarModal from "../components/layouts/chooseCharacter/AvatarModal";
import CharchaModal from "../components/layouts/chooseCharacter/CharchaModal";
import NewThemeModal from "../components/layouts/chooseCharacter/NewThemeModal";

const ChooseCharacterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { storyEleementFileUrl } = useSelector(LyricEditState);
  const { sceneDataFileUrl } = useSelector(UploadAudioState);

  const [
    editStory,
    { data: { data: editStoryData } = {}, isLoading: isEditStoryLoading },
  ] = useEditStoryElementMutation();

  const [
    procesStory,
    {
      data: { data: sceneLLMResponse } = {},
      isLoading: isProcessStoryLoading,
      reset: resetSceneLLMResponse,
    },
  ] = useSceneLLMEndpointMutation();
  const [
    getStoryElement,
    { isLoading: isGetStoryLoading, reset: resetStoryElemetData },
  ] = useLazyGetStoryElementQuery();

  const [
    processAvatar,
    {
      data: { data: processedAvatarResponse } = {},
      isLoading: isAvatarLoading,
    },
  ] = useProcessAvatarMutation();
  const [getAvatar] = useLazyGetProcessedAvatarQuery();

  const [newThemeInput, setNewThemeInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stage, setStage] = useState("default");
  const [charchaIdentifier, setCharchaIdentifier] = useState("");
  const [avatarIdentifier, setAvatarIdentifier] = useState("");
  const [gender, setGender] = useState("");
  const [currentAction, setCurrentAction] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [completedActions, setCompletedActions] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isChooseCharModalOpen, setIsChooseCharModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [useCharcha, setUseCharcha] = useState(null);
  const [storyElement, setStoryElement] = useState(null);
  const [isCustomAvatarModalOpen, setIsCustomAvatarModalOpen] = useState(false);
  const [animatedImages, setAnimatedImages] = useState([]);
  const [isCharchaFinalized, setIsCharchaFinalized] = useState(false);
  const [isAvatarFinalized, setIsAvatarFinalized] = useState(false);
  const [actions, setActions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAvatarDataLoading, setIsAvatarDataLoading] = useState(false);

  const isLoading =
    isProcessStoryLoading ||
    isGetStoryLoading ||
    isEditStoryLoading ||
    isProcessing;

  const handleAICharClick = async () => {
    setIsCustomAvatarModalOpen(true);
    const { message, uriPath } = await createFolderInS3(
      `${localStorage.getItem("currentUser")}/AVATAR`
    );

    // if (!message?.includes("already exists.")) {
    processAvatar({
      images_path: uriPath,
      character_details: storyElement.character_details,
    });
    // }
  };

  const handleChangeLook = async () => {
    const { uriPath } = await createFolderInS3(
      `${localStorage.getItem("currentUser")}/AVATAR`
    );
    processAvatar({
      mode: AvatarProcessModes.CREATE,
      images_path: uriPath,
      character_details: storyElement?.character_details,
    });
  };

  const onConfirmAvatarModal = async () => {
    setIsCustomAvatarModalOpen(false);
    setIsAvatarFinalized(true);
    setUseCharcha(false);
    const { uriPath } = await createFolderInS3(
      `${localStorage.getItem("currentUser")}/AVATAR`
    );
    dispatch(setCharacterFolderPath(uriPath));
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Determine the square crop size (smallest dimension)
      const squareSize = Math.min(videoWidth, videoHeight);

      // Calculate cropping start points (center-cropping)
      const startX = (videoWidth - squareSize) / 2;
      const startY = (videoHeight - squareSize) / 2;

      // Set canvas size to the square size
      canvas.width = squareSize;
      canvas.height = squareSize;

      // Draw the  square portion from the video onto the canvas
      context.drawImage(
        video,
        startX,
        startY,
        squareSize,
        squareSize,
        0,
        0,
        squareSize,
        squareSize
      );

      return canvas.toDataURL("image/png");
    }
  };

  const storeReplacementWord = () => {
    if (!useCharcha) {
      dispatch(setReplacementWord(ReplacementWords.PERSON));
      return;
    }
    if (gender === "male") {
      dispatch(setReplacementWord(ReplacementWords.MAN));
    } else if (gender === "female") {
      dispatch(setReplacementWord(ReplacementWords.WOMAN));
    } else {
      dispatch(setReplacementWord(ReplacementWords.PERSON));
    }
  };

  const handleSaveTheme = () => {
    setStoryElement(null);
    editStory({
      mode: EditStoryModes.EDIT_STORY,
      scenes_path: sceneDataFileUrl,
      Story_elements: storyEleementFileUrl,
      story_instructions: newThemeInput,
    });
    setIsModalOpen(false);
  };

  const handleNarrativeChange = (event) => {
    setStoryElement((prev: any) => ({
      ...prev,
      narrative: event.target.value,
    }));
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    setStoryElement(null);
    editStory({
      mode: EditStoryModes.EDIT_CHARACTER,
      scenes_path: sceneDataFileUrl,
      Story_elements: storyEleementFileUrl,
      new_story: storyElement.narrative,
    });
  };

  const closeCharchaModal = () => {
    if (!isCharchaFinalized) {
      setCapturedImages([]);
    }
    setIsChooseCharModalOpen(false);
    setCharchaIdentifier("");
    setGender("");
  };

  const onConfirm = async () => {
    if (stage === Stages.VERIFICATION) {
      setStage(Stages.IDENTIFICATION);
    } else if (stage === Stages.IDENTIFICATION) {
      setStage(Stages.CALIBRATION);
    } else if (stage === Stages.CALIBRATION) {
      const imageCaptured = captureImage();
      setCapturedImages((p) => [...p, imageCaptured]);
      setStage(Stages.ACTION_RECORD);
    } else if (stage === Stages.ACTION_RECORD) {
      setIsChooseCharModalOpen(false);
      setIsCharchaFinalized(true);
      setUseCharcha(true);
      const { uriPath } = await createFolderInS3(
        `${localStorage.getItem("currentUser")}/charchaImages`
      );
      dispatch(setCharacterFolderPath(uriPath));
      await Promise.all(
        capturedImages.map(async (currentImage, index) => {
          const file = dataURLtoFile(currentImage, `image-${index + 1}`);
          return uploadFileToS3(
            file,
            `${localStorage.getItem("currentUser")}/charchaImages`
          );
        })
      );
    }
  };

  const onRecreate = () => {
    setIsCharchaFinalized(false);
    setStage(Stages.VERIFICATION);
    setCharchaIdentifier("");
    setCapturedImages([]);
  };

  const getConfirmText = () => {
    return ConfirmButtonTextMap[stage] || "Confirm";
  };

  const isConfirmDisabled = () => {
    if (stage === Stages.ACTION_RECORD && !isComplete) {
      return true;
    } else if (stage === Stages.IDENTIFICATION && !gender) {
      return true;
    }
    return false;
  };

  const handleNextClick = async () => {
    if (useCharcha === null) {
      return;
    }

    dispatch(setIsCharchaChosen(useCharcha));
    storeReplacementWord();
    navigate("/characterSelection", {
      state: {
        characterName: useCharcha ? charchaIdentifier : avatarIdentifier,
      },
    });
    dispatch(
      setCharacterName(useCharcha ? charchaIdentifier : avatarIdentifier)
    );
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChooseChar = () => {
    if (isCharchaFinalized) {
      setCurrentAction(5);
      setStage(Stages.ACTION_RECORD);
    } else {
      setStage(Stages.VERIFICATION);
    }
    setIsChooseCharModalOpen(true);
  };

  const handleTextChange = (e) => {
    setNewThemeInput(e.target.value);
  };

  const onGetStorySuccess = ({ data }) => {
    setStoryElement(data?.story_elements);
    resetStoryElemetData();
    uploadJsonAsFileToS3(
      { story_elements: data?.story_elements },
      "story_element.json"
    ).then((url) => {
      dispatch(setStoryEleementFileUrl(url));
      setIsProcessing(false);
      console.log("story_element.json upload successful");
    });
  };

  useEffect(() => {
    // Stop the camera when modal is closed
    if (!isChooseCharModalOpen && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Start the camera when modal is open and stage is valid
    if (isChooseCharModalOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        })
        .catch((error) => console.error("Error accessing webcam:", error));
    }

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isChooseCharModalOpen]);

  useEffect(() => {
    if (stage === "actionRecord") {
      setTimeLeft(isCharchaFinalized ? 0 : 7); // Reset timer
      setCurrentAction(isCharchaFinalized ? 5 : 0); // Reset actions to start from the first action
      setCompletedActions(isCharchaFinalized ? [1, 2, 3, 4, 5] : []); // Clear completed actions
      setIsComplete(isCharchaFinalized ? true : false); // Reset completion state
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "actionRecord") return; // Prevents countdown from running on other stages

    if (timeLeft === 3 && !isComplete) {
      const imageCaptured = captureImage();
      setCapturedImages((p) => [...p, imageCaptured]);
    }

    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentAction < actions.length - 1 && !isComplete) {
      setCompletedActions((prev) => [...prev, currentAction]);
      setCurrentAction(currentAction + 1);
      setTimeLeft(7);
    } else if (currentAction === actions.length - 1 && !isComplete) {
      // const imageCaptured = captureImage();
      // setCapturedImages((p) => [...p, imageCaptured]);
      setCompletedActions((prev) => [...prev, currentAction]);
      setIsComplete(true); // User must manually click "Continue to Narrative"
    }
  }, [timeLeft, currentAction, isComplete, stage]);

  useEffect(() => {
    procesStory({
      mode: "create-story",
      scenes_path: sceneDataFileUrl,
    });
    setActions(getRandomActions());
  }, []);

  useEffect(() => {
    if (sceneLLMResponse?.call_id) {
      setIsProcessing(true);
      startApiPolling(
        sceneLLMResponse?.call_id,
        getStoryElement,
        onGetStorySuccess,
        10000
      );
      resetSceneLLMResponse();
    }
  }, [sceneLLMResponse]);

  useEffect(() => {
    if (editStoryData?.call_id) {
      setIsProcessing(true);
      startApiPolling(
        editStoryData?.call_id,
        getStoryElement,
        onGetStorySuccess,
        8000
      );
    }
  }, [editStoryData]);

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setAnimatedImages(Object?.values(data));
      setIsAvatarDataLoading(false);
    };

    if (processedAvatarResponse?.call_id) {
      setIsAvatarDataLoading(true)
      startApiPolling(
        processedAvatarResponse?.call_id,
        getAvatar,
        onSuccess,
        7000
      );
    }
  }, [processedAvatarResponse]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CharchaModal
        isChooseCharModalOpen={isChooseCharModalOpen}
        closeCharchaModal={closeCharchaModal}
        onConfirm={onConfirm}
        getConfirmText={getConfirmText}
        isConfirmDisabled={isConfirmDisabled}
        isCharchaFinalized={isCharchaFinalized}
        onRecreate={onRecreate}
        stage={stage}
        videoRef={videoRef}
        charchaIdentifier={charchaIdentifier}
        setCharchaIdentifier={setCharchaIdentifier}
        gender={gender}
        setGender={setGender}
        timeLeft={timeLeft}
        actions={actions}
        completedActions={completedActions}
        currentAction={currentAction}
      />
      <AvatarModal
        isCustomAvatarModalOpen={isCustomAvatarModalOpen}
        setIsCustomAvatarModalOpen={setIsCustomAvatarModalOpen}
        onConfirmAvatarModal={onConfirmAvatarModal}
        avatarIdentifier={avatarIdentifier}
        setAvatarIdentifier={setAvatarIdentifier}
        animatedImages={animatedImages}
        storyElement={storyElement}
        handleNarrativeChange={handleNarrativeChange}
        handleChangeLook={handleChangeLook}
        isLoading={isAvatarLoading || isAvatarDataLoading}
      />
      <Navbar />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="flex justify-center">
        <div className="px-20 max-w-[1200px]">
          <div className="w-full mt-10">
            <div className="flex justify-start w-[60%] mb-6">
              <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                Generate your video
              </h1>
            </div>
          </div>
          <div>
            <ProgressBar currentStep={3} />

            <div className="w-full bg-transparent border-none shadow-none">
              <p className="text-[#101828] mb-3">
                Describe the theme for the video that Koyal will create{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-[#475467] text-[16px] font-inter font-normal leading-[24px] tracking-normal mb-3">
                Click to edit text or press button to completely change the
                theme
              </p>
              <ShimmerWrapper isLoading={isLoading}>
                <div className="flex flex-col items-center mt-4 w-full bg-[#F3F3F3] rounded-xl p-2 ">
                  <div className="w-full">
                    <textarea
                      className="w-full px-4 py-3 bg-transparent text-gray-600 placeholder-gray-500 outline-none"
                      rows={2}
                      value={storyElement?.narrative} // Bound to state
                      onChange={(e) => handleNarrativeChange(e)}
                    />
                  </div>
                  <div className="w-full flex justify-end mt-2">
                    <button
                      className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-end whitespace-nowrap transition-all"
                      onClick={handleOpenModal}
                    >
                      Describe new theme
                      <span className="ml-2">
                        {" "}
                        <FaArrowRight />
                      </span>
                    </button>
                  </div>
                </div>
              </ShimmerWrapper>
              <div className="mt-2 w-[40%]">
                <ShimmerWrapper isLoading={isLoading}>
                  <button
                    className="px-6 py-1 h-[40px] bg-black text-white rounded-md hover:bg-gray-800"
                    onClick={handleSaveChanges}
                  >
                    Save
                  </button>
                </ShimmerWrapper>
              </div>

              <p className="text-[#101828] mt-6">
                {/* Do you want your likeness in the video? */}
                Inject yourself in the video
                <span className="text-red-500">*</span>
              </p>
              <p className="text-[#475467]  text-[16px] font-inter font-normal leading-[24px] tracking-normal mb-3">
                {" "}
                You can train your face using our secure personalization
                protocol or describe a custom main character for the final video
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  {isCharchaFinalized ? (
                    <>
                      <label
                        htmlFor=""
                        className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                        ${
                          useCharcha
                            ? "bg-white text-blue border-blue-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={handleChooseChar}
                      >
                        <span
                          className="border-1"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {capturedImages && (
                            <ImagePreview
                              imageURL={capturedImages[0]}
                              expandIconOnHover={true}
                              customImageUI={
                                <img
                                  src={capturedImages[0]}
                                  alt="Captured"
                                  className={`w-[3rem] h-[3rem] rounded-full border-[2px] ${
                                    useCharcha === true
                                      ? "border-blue-500"
                                      : "border-gray-300"
                                  }`}
                                />
                              }
                            />
                          )}
                        </span>

                        <span
                          className={` ml-2 ${
                            useCharcha === true && "text-blue-500 font-semibold"
                          }`}
                        >
                          {charchaIdentifier}
                        </span>
                      </label>
                    </>
                  ) : (
                    <ShimmerWrapper isLoading={isLoading} width={"30%"}>
                      <label
                        className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                              bg-white text-gray-700 border-gray-300`}
                        onClick={handleChooseChar}
                      >
                        Use your likeness
                      </label>
                    </ShimmerWrapper>
                  )}

                  {isAvatarFinalized ? (
                    <>
                      <label
                        htmlFor=""
                        className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                      ${
                        useCharcha === false
                          ? "bg-white text-blue border-blue-500"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                        onClick={handleAICharClick}
                      >
                        <span
                          className="border-1"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {animatedImages && (
                            <ImagePreview
                              imageURL={animatedImages[1]}
                              expandIconOnHover={true}
                              customImageUI={
                                <img
                                  src={animatedImages[1]}
                                  alt="Captured"
                                  className={`w-[3rem] h-[3rem] rounded-full border-[2px] ${
                                    useCharcha === false
                                      ? "border-blue-500"
                                      : "border-gray-300"
                                  }`}
                                />
                              }
                            />
                          )}
                        </span>

                        <span
                          className={`ml-2 ${
                            useCharcha === false &&
                            "text-blue-500 font-semibold"
                          }`}
                        >
                          {avatarIdentifier}
                        </span>
                      </label>
                    </>
                  ) : (
                    <ShimmerWrapper isLoading={isLoading} width={"30%"}>
                      <label
                        className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                          ${
                            useCharcha === false
                              ? "bg-white text-blue border-blue-500"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        onClick={handleAICharClick}
                      >
                        <span
                          className={`${
                            useCharcha === false &&
                            "text-blue-500 font-semibold"
                          }`}
                        >
                          Create AI Avatar
                        </span>
                      </label>
                    </ShimmerWrapper>
                  )}
                </div>
              </div>

              <p className="text-gray-400 mt-6 inline-flex items-center">
                If you’ve already trained your own character,
                <a className="text-green-600 font-bold ml-1" href="#">
                  Use an existing character
                </a>
              </p>
            </div>

            <div className="flex justify-end w-full mt-12 mb-12">
              <button className="px-6 py-1 h-[40px] mr-2 border border-gray-300 rounded-md text-gray-500">
                Previous
              </button>
              <button
                className="px-6 py-1 h-[40px] bg-black text-white rounded-md hover:bg-gray-800"
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
            <NewThemeModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              text={newThemeInput}
              handleTextChange={handleTextChange}
              onConfirm={handleSaveTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseCharacterPage;
