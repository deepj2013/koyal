import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { ConfirmButtonTextMap, Stages } from "../utils/constants";
import { FaArrowRight } from "react-icons/fa";
import { LyricEditState } from "../redux/features/lyricEditSlice";
import { useSelector } from "react-redux";
import { useEditStoryElementMutation } from "../redux/services/chooseCharacterService/chooseCharacterApi";
import { UploadAudioState } from "../redux/features/uploadSlice";
import { useLazyGetStoryElementQuery } from "../redux/services/lyricEditService/lyricEditApi";
import { uploadJsonAsFileToS3 } from "../utils/helper";
import { AutoImageSlider } from "../components/AutoImageSlider";
import avatar1 from "../assets/images/avatar1.png";
import avatar2 from "../assets/images/avatar2.png";
import avatar3 from "../assets/images/avatar3.png";
import storyElementData from "../assets/sample/story_elements.json";

const THEME_TEXT = storyElementData.narrative;
const THEME_TEXT_NEW = storyElementData.newNarrative;
const AVATAR_TEXT = "indian girl, age 21, sharp features, ponytail";

const ChooseCharacterPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { storyEleementFileUrl } = useSelector(LyricEditState);
  const { sceneDataFileUrl } = useSelector(UploadAudioState);

  const [newThemeInput, setNewThemeInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stage, setStage] = useState("default");
  const [identifier, setIdentifier] = useState("");
  const [gender, setGender] = useState("");
  const [currentAction, setCurrentAction] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [completedActions, setCompletedActions] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isChooseCharModalOpen, setIsChooseCharModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [useChosenCharacter, setUseChosenCharacter] = useState(null);
  const [storyElement, setStoryElement] = useState(storyElementData);
  const [isCustomAvatarModalOpen, setIsCustomAvatarModalOpen] = useState(false);
  const [avatarDescription, setAvatarDescription] = useState(AVATAR_TEXT);

  const animatedImages = [avatar1, avatar2, avatar3];
  const actions = [
    "TURN YOUR HEAD RIGHT",
    "SQUINT YOUR EYES",
    "TILT YOUR HEAD DOWN",
    "OPEN YOUR MOUTH",
    "TILT YOUR HEAD UP",
    "STANDUP (ENSURE HEAD IN THE FRAME)",
  ];

  const handleAICharClick = () => {
    setUseChosenCharacter(false);
    setIsCustomAvatarModalOpen(true);
  };

  const onConfirmAvatarModal = () => {
    setIsCustomAvatarModalOpen(false)
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));
      setUseChosenCharacter(true);
    }
  };

  const handleSaveTheme = () => {
    setStoryElement((prev: any) => ({
      ...prev,
      narrative: newThemeInput || THEME_TEXT_NEW,
    }));
    // editStory({
    //   mode: "edit-story",
    //   scenes_path: sceneDataFileUrl,
    //   Story_elements: storyEleementFileUrl,
    //   story_instructions: newThemeInput,
    // });
    setIsModalOpen(false);
  };

  const handleNarrativeChange = (event) => {
    setStoryElement((prev: any) => ({
      ...prev,
      narrative: THEME_TEXT_NEW,
    }));
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    // editStory({
    //   mode: "edit-character",
    //   scenes_path: sceneDataFileUrl,
    //   Story_elements: storyEleementFileUrl,
    //   new_story: storyElement.narrative,
    // });
  };

  const onConfirm = () => {
    if (stage === Stages.VERIFICATION) {
      setStage(Stages.IDENTIFICATION);
    } else if (stage === Stages.IDENTIFICATION) {
      setStage(Stages.CALIBRATION);
    } else if (stage === Stages.CALIBRATION) {
      setStage(Stages.ACTION_RECORD);
    } else if (stage === Stages.ACTION_RECORD) {
      setIsChooseCharModalOpen(false);
    }
  };

  const getConfirmText = () => {
    return ConfirmButtonTextMap[stage] || "Confirm";
  };

  const isConfirmDisabled = () => {
    if (stage === Stages.ACTION_RECORD && !isComplete) {
      return true;
    } else if (stage === Stages.IDENTIFICATION && (!gender || !identifier)) {
      return true;
    }
    return false;
  };

  const handleNextClick = () => {
    navigate("/characterSelection");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChooseChar = () => {
    setStage(Stages.VERIFICATION);
    setIsChooseCharModalOpen(true);
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
      setTimeLeft(7); // Reset timer
      setCurrentAction(0); // Reset actions to start from the first action
      setCompletedActions([]); // Clear completed actions
      setIsComplete(false); // Reset completion state
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "actionRecord") return; // Prevents countdown from running on other stages

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
      captureImage();
      setCompletedActions((prev) => [...prev, currentAction]);
      setIsComplete(true); // User must manually click "Continue to Narrative"
    }
  }, [timeLeft, currentAction, isComplete, stage]);

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="flex flex-col items-center mt-4 w-full bg-[#F3F3F3] rounded-xl p-2">
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
              <button
                className="px-6 py-1 h-[40px] mt-2 bg-black text-white rounded-md hover:bg-gray-800"
                onClick={handleSaveChanges}
              >
                Save
              </button>

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
                {/* Yes/No Selection */}
                <div className="flex space-x-4">
                  {isComplete ? (
                    <label
                      className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                        ${
                          useChosenCharacter
                            ? "bg-white text-blue border-blue-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      onClick={() => setUseChosenCharacter(true)}
                    >
                      <span className="border-1">
                        {capturedImage && (
                          <img
                            src={capturedImage}
                            alt="Captured"
                            className={`w-[2.5rem] h-[2.5rem] rounded-full border-[2px] ${
                              useChosenCharacter === true
                                ? "border-blue-500"
                                : "border-gray-300"
                            }`}
                          />
                        )}
                      </span>

                      <span
                        className={` ml-2 ${
                          useChosenCharacter === true &&
                          "text-blue-500 font-semibold"
                        }`}
                      >
                        Chosen character
                      </span>
                    </label>
                  ) : (
                    <label
                      className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                              bg-white text-gray-700 border-gray-300`}
                      onClick={handleChooseChar}
                    >
                      Use your likeness
                    </label>
                  )}

                  <label
                    className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                          ${
                            useChosenCharacter === false
                              ? "bg-white text-blue border-blue-500"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                    onClick={handleAICharClick}
                  >
                    <span
                      className={`${
                        useChosenCharacter === false &&
                        "text-blue-500 font-semibold"
                      }`}
                    >
                      Create AI Character
                    </span>
                  </label>
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

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative z-50 border border-white/20">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
                  >
                    ✖
                  </button>
                  <h2 className="text-[18px] text-white text-center mb-4">
                    Describe how you want the new theme to be
                  </h2>
                  <textarea
                    className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-gray-200"
                    rows={4}
                    placeholder="Make the video more vibrant and colorful."
                    value={newThemeInput}
                    onChange={(e) => setNewThemeInput(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleSaveTheme}
                    className="w-full bg-white/20 text-white mt-4 py-3 rounded-lg hover:bg-white/30 transition duration-200 border border-white/30"
                  >
                    Create New Theme
                  </button>
                </div>
              </div>
            )}
            <Modal
              isOpen={isChooseCharModalOpen}
              onClose={() => setIsChooseCharModalOpen(false)}
              onCancel={() => setIsChooseCharModalOpen(false)}
              onConfirm={onConfirm}
              title="Create New Character"
              confirmText={getConfirmText()}
              isConfirmDisabled={isConfirmDisabled()}
            >
              <div className="flex w-full h-full px-10 py-6 flex-start rounded-lg">
                <div className="w-[50%] p-6  overflow-hidden flex align-center">
                  <video
                    ref={videoRef}
                    className="w-full h-auto rounded-xl object-cover"
                    autoPlay
                    playsInline
                  ></video>
                </div>

                {/* Right Side: Dynamic Content */}
                <div className="w-[50%]  p-6 flex flex-col text-center align-center flex-start">
                  {stage === "verification" && (
                    <div className="flex flex-col  pl-5">
                      {/* Centering h1 and h2 */}
                      <h1 className="text-3xl font-bold text-gray-900">
                        C.H.A.R.C.H.A.
                      </h1>
                      <div className="flex w-full justify-center">
                        <h2 className="text-md w-[65%] text-gray-700 mb-4 leading-[16px]">
                          Computer Human Assessment for Recreating Characters
                          with Human Actions
                        </h2>
                      </div>

                      {/* Right-aligning h3 and ordered list */}
                      <div className="w-full flex flex-col items-start text-md text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          This takes only about a minute!
                        </h3>
                        <p className="text-md text-gray-700">
                          Before starting:
                        </p>
                        <ol className="list-decimal list-inside mb-4 text-gray-700 pl-1">
                          <li>
                            Find a well-lit space with room to{" "}
                            <span className="font-bold">move & stand up</span>
                          </li>
                          <li>Remove face coverings (glasses optional)</li>
                          <li>Follow the on-screen actions when prompted</li>
                        </ol>
                      </div>

                      {/* Centering p and button */}
                      <p className="text-gray-700 mb-6 text-left">
                        Photos will only be collected for training your
                        character.
                      </p>
                    </div>
                  )}
                  {stage === "identification" && (
                    <>
                      <h2 className="text-lg mb-4 font-[500]">
                        Please enter your information
                      </h2>
                      <div className="items-start text-md text-left ">
                        <p className="mb-4">
                          Use a unique identifier that isn't part of regular
                          English vocabulary.
                        </p>
                        <p className="text-gray-700 mb-4">
                          For example, your full name without spaces or a
                          nickname. Do not use any numbers or special
                          characters.
                        </p>
                      </div>

                      {/* Input for Unique Identifier */}
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="border border-gray-900 rounded-lg p-3 w-full mb-4"
                        placeholder="Enter unique identifier"
                      />

                      {/* Dropdown for Gender Selection */}
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="border border-gray-900 rounded-lg p-3 w-full mb-4 text-gray-600"
                      >
                        <option value="">Select Gender Identity</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not">Prefer not to say</option>
                      </select>

                      {/* Continue Button */}
                      {/* <button
                        className="border border-gray-500 rounded-lg p-3 w-full text-gray-900 font-bold hover:bg-gray-900 hover:text-white"
                        onClick={() => setStage("calibration")}
                      >
                        Continue
                      </button> */}
                    </>
                  )}
                  {stage === "calibration" && (
                    <div className="flex flex-col">
                      {/* Title */}
                      <h2 className="text-lg  font-[500]">CALIBRATION</h2>

                      {/* Instructions (Centered, Proper Spacing) */}
                      <div className=" p-4 text-left mb-4">
                        <p className="text-gray-700 mb-3">
                          Please keep your head in a neutral position and look
                          straight at the camera.
                        </p>
                        <p className="text-gray-700 mb-3">
                          Try to maintain similar positioning for the test.
                        </p>
                        <p className="text-gray-700">Click start to begin.</p>
                      </div>

                      {/* Progress Indicator */}
                      <p className="text-black font-medium text-left pl-4">
                        Calibration progress:{" "}
                        <span className="font-bold">30 frames remaining</span>
                      </p>

                      {/* Start Button (Bordered with Red & Hover Effect) */}
                      {/* <button
                        className="border border-black-900 rounded-lg px-6 py-3 ml-4 mt-6 text-black font-bold hover:bg-black-900 hover:text-white-200 transition-shadow shadow-sm hover:shadow-md"
                        onClick={() => setStage("actionRecord")}
                      >
                        Start Calibration
                      </button> */}
                    </div>
                  )}
                  {stage === "actionRecord" && (
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-3xl font-bold text-gray-900">
                        C.H.A.R.C.H.A.
                      </h1>
                      <h2 className="text-lg text-gray-700 mb-4">
                        Perform the following action for 7 seconds.
                      </h2>
                      <p className="text-xl font-bold text-black">
                        Time left: {timeLeft} seconds
                      </p>

                      {/* Action List */}
                      <ul className="list-none grid grid-rows-6 gap-4 mt-4 text-left relative">
                        {actions
                          .map((action, index) => ({ action, index })) // Convert to object for better readability
                          .filter(
                            ({ index }) =>
                              completedActions.includes(index) ||
                              index === currentAction
                          ) // Show only completed or current action
                          .map(({ action, index }) => (
                            <li
                              key={index}
                              className={`relative flex items-center justify-center p-3 rounded-lg w-96 border-2
        ${
          completedActions.includes(index)
            ? "border-green-500 text-black bg-white"
            : "bg-black text-white"
        }`}
                            >
                              {/* Number Circle Positioned Outside on the Left */}
                              <span
                                className={`absolute -left-10 w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold 
        ${
          completedActions.includes(index)
            ? "border-green-500 text-black"
            : "border-gray-500"
        }`}
                              >
                                {index + 1}
                              </span>

                              {/* Action Text */}
                              <span className="flex-1 text-center font-semibold pl-4">
                                {action}
                              </span>

                              {/* Check Icon Positioned Outside on the Right */}
                              {completedActions.includes(index) && (
                                <span className="absolute -right-8 text-green-500 text-lg">
                                  <FaCheck />
                                </span>
                              )}
                            </li>
                          ))}
                      </ul>

                      {/* Start Button (Only Visible at the Beginning) */}
                      {/* {currentAction === 0 && timeLeft === 7 && (
                        <button
                          className="bg-black text-white px-6 py-3 rounded-lg mt-6"
                          onClick={() => setTimeLeft(6)} // Start countdown when clicked
                        >
                          Start Actions
                        </button>
                      )} */}

                      {/* Final Button Appears After Completion, Waits for User Click */}
                      {/* {isComplete && (
                        <button
                          className="bg-black text-white px-6 py-3 rounded-lg mt-6 border border-red-500 shadow-lg"
                          onClick={() => navigate("/characterSelection")}
                        >
                          Continue to Narrative
                        </button>
                      )} */}
                    </div>
                  )}
                </div>
              </div>
            </Modal>
            <Modal
              isOpen={isCustomAvatarModalOpen}
              onClose={() => setIsCustomAvatarModalOpen(false)}
              onCancel={() => setIsCustomAvatarModalOpen(false)}
              onConfirm={onConfirmAvatarModal}
              title="Create New Character"
              confirmText="Finalize the character"
              isConfirmDisabled={false}
            >
              <div className="flex w-full h-full px-10 py-6 flex-start rounded-lg w-[70vw]">
                <div className="w-[40%] p-6  overflow-hidden flex align-center">
                  <AutoImageSlider
                    images={animatedImages}
                    autoPlay={false}
                    currentButtonColor="black"
                  />
                </div>
                <div className="w-[60%]  p-6 flex flex-col text-center align-center flex-start">
                  <div className="flex flex-col  pl-5">
                    {/* Centering h1 and h2 */}
                    <h1 className="text-3xl font-bold text-gray-900">
                      A.V.A.T.A.R.
                    </h1>
                    <div className="flex w-full justify-center">
                      <h2 className="text-md w-[65%] text-gray-700 mb-4 leading-[16px]">
                        Adaptive virtual avatar with text assisted render
                      </h2>
                    </div>

                    {/* Right-aligning h3 and ordered list */}
                    <div className="w-full flex flex-col items-start text-md text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Create your own main character for the video being as
                        descriptive as possible.
                      </h3>
                      
                      <div className="flex items-center mt-4 w-full bg-[#F3F3F3] rounded-xl p-2">
                        <textarea className="w-full px-4 py-3 bg-transparent text-gray-600 placeholder-gray-500 outline-none" 
                        value={avatarDescription}
                        onChange={(e) => setAvatarDescription(e.target.value)}
                        ></textarea>
                        <button className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center whitespace-nowrap transition-all">
                          Change Look{" "}
                          <span className="ml-2">
                            <FaArrowRight />
                          </span>
                        </button>
                      </div>

                      <div>
                        <p className="text-lg text-gray-700 my-4">
                          Use a unique identifier for your character that isn't
                          part of regular English vocabulary.{" "}
                        </p>

                        <p className="text-lg text-gray-700">
                          For example, full name without spaces or nickname.{" "}
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                          Do not use any numbers or special characters.
                        </p>
                      </div>
                      <div className="w-full">
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="border border-gray-900 rounded-lg p-3 w-full mb-4"
                          placeholder="Enter a name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseCharacterPage;
