import React from "react";
import { Modal } from "../../Modal";
import { Stages } from "../../../utils/constants";
import { FaCheck } from "react-icons/fa";

const CharchaModal = ({
  isChooseCharModalOpen,
  closeCharchaModal,
  onConfirm,
  getConfirmText,
  isConfirmDisabled,
  isCharchaFinalized,
  onRecreate,
  stage,
  videoRef,
  charchaIdentifier,
  setCharchaIdentifier,
  gender,
  setGender,
  timeLeft,
  actions,
  completedActions,
  currentAction,
}) => {
  return (
    <>
      <Modal
        isOpen={isChooseCharModalOpen}
        onClose={closeCharchaModal}
        onCancel={closeCharchaModal}
        onConfirm={onConfirm}
        title="Create New Character"
        confirmText={getConfirmText()}
        isConfirmDisabled={isConfirmDisabled()}
        onRestart={
          stage === Stages.ACTION_RECORD && isCharchaFinalized && onRecreate
        }
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
                    For example, your full name without spaces or a nickname. Do
                    not use any numbers or special characters.
                  </p>
                </div>

                {/* Input for Unique Identifier */}
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
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CharchaModal;
