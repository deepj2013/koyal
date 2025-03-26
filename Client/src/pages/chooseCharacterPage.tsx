import React, { useState, useRef, useEffect, act } from "react";
import Navbar from "../components/Navbar";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { ConfirmButtonTextMap, Stages } from "../utils/constants";

import { dataURLtoFile, getRandomActions } from "../utils/helper";
import { createFolderInS3, uploadFileToS3 } from "../aws/s3-service";

const ChooseCharacterPage = () => {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [stage, setStage] = useState(Stages.VERIFICATION);
  const [charchaIdentifier, setCharchaIdentifier] = useState("");
  const [gender, setGender] = useState("");
  const [currentAction, setCurrentAction] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [completedActions, setCompletedActions] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isChooseCharModalOpen, setIsChooseCharModalOpen] = useState(true);
  const [capturedImages, setCapturedImages] = useState([]);

  const [isCharchaFinalized, setIsCharchaFinalized] = useState(false);
  const [actions, setActions] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [email, setEmail] = useState("");

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

  const closeCharchaModal = () => {
    if (!isCharchaFinalized) {
      setCapturedImages([]);
    }
    setIsChooseCharModalOpen(false);
    setCharchaIdentifier("");
    setGender("");
  };

  const createFolders = async (email: string, characterName: string) => {
    const { uriPath, message } = await createFolderInS3(
      `${email}/${characterName}`
    );
    if (message.includes("Folder already exists")) {
      alert(
        "Character with this identifier already exists for this email. Try choosing a different name."
      );
      return false;
    } else {
      return true;
    }
  };

  const onConfirm = async () => {
    if (stage === Stages.VERIFICATION) {
      setStage(Stages.IDENTIFICATION);
    } else if (stage === Stages.IDENTIFICATION) {
      const isSuccess = await createFolders(email, charchaIdentifier);
      if (isSuccess) {
        setStage(Stages.CALIBRATION);
      }
    } else if (stage === Stages.CALIBRATION) {
      const imageCaptured = captureImage();
      setCapturedImages((p) => [...p, imageCaptured]);
      setStage(Stages.ACTION_RECORD);
    } else if (stage === Stages.ACTION_RECORD) {
      setIsChooseCharModalOpen(false);
      setIsCharchaFinalized(true);
      handleNextClick();
    }
  };

  const onRecreate = () => {
    setIsCharchaFinalized(false);
    setStage(Stages.VERIFICATION);
    setCharchaIdentifier("");
    setCapturedImages([]);
  };

  const onConfirmSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/");
    window.location.reload();
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
    const { uriPath } = await createFolderInS3(
      `${email}/${charchaIdentifier}/charchaImages`
    );
    await Promise.all(
      capturedImages.map(async (currentImage, index) => {
        const file = dataURLtoFile(currentImage, `image-${index + 1}`);
        return uploadFileToS3(
          file,
          `${email}/${charchaIdentifier}/charchaImages`
        );
      })
    );

    setShowSuccessModal(true);
  };

  const handleChooseChar = () => {
    if (isCharchaFinalized) {
      setCurrentAction(5);
      setStage(Stages.ACTION_RECORD);
    } else {
      setStage(Stages.VERIFICATION);
    }
    setIsChooseCharModalOpen(true);
  };

  useEffect(() => {
    setActions(getRandomActions());
    handleChooseChar();
  }, []);

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
                      Computer Human Assessment for Recreating Characters with
                      Human Actions
                    </h2>
                  </div>

                  {/* Right-aligning h3 and ordered list */}
                  <div className="w-full flex flex-col items-start text-md text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      This takes only about a minute!
                    </h3>
                    <p className="text-md text-gray-700">Before starting:</p>
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
                    Photos will only be collected for training your character.
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
                      Use a unique identifier that isn't part of regular English
                      vocabulary.
                    </p>
                    <p className="text-gray-700 mb-4">
                      For example, your full name without spaces or a nickname.
                      Do not use any numbers or special characters.
                    </p>
                  </div>

                  {/* Input for Unique Identifier */}
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-900 rounded-lg p-3 w-full mb-4"
                    placeholder="Enter email"
                  />
                  <input
                    type="text"
                    value={charchaIdentifier}
                    onChange={(e) => setCharchaIdentifier(e.target.value)}
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
                <div className="flex flex-col items-center text-center max-h-[40vh]">
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
                </div>
              )}
            </div>
          </div>

          <div>
            <Modal
              isOpen={showSuccessModal}
              onClose={() => {}}
              onCancel={() => {}}
              onConfirm={onConfirmSuccessModal}
              title=""
              confirmText="Confirm"
              isConfirmDisabled={false}
            >
              <div className="flex flex-col items-center justify-center px-8 py-6 text-center space-y-4 w-[60vw] max-w-lg">
                {/* Success Icon */}
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
                  ✅ {/* Replace with an actual icon if needed */}
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-semibold text-gray-900">
                  You're done with the process, thanks!
                </h1>

                {/* Subtitle (Optional) */}
                <p className="text-gray-600 text-sm">
                  You may now proceed with the next steps or close this window.
                </p>
              </div>
            </Modal>
            <div className="flex justify-between gap-3 mt-4">
              {closeCharchaModal && (
                <button
                  onClick={closeCharchaModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}

              <div>
                {onRecreate &&
                  stage !== Stages.VERIFICATION &&
                  stage !== Stages.IDENTIFICATION && (
                    <button
                      onClick={onRecreate}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-4"
                    >
                      Re-create new character
                    </button>
                  )}
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg transition 
               bg-blue-600 text-white hover:bg-blue-700 
               disabled:opacity-50 disabled:bg-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                    disabled={isConfirmDisabled()}
                  >
                    {getConfirmText()}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseCharacterPage;
