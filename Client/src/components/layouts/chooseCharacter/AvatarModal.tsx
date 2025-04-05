import React from "react";
import { Modal } from "../../Modal";
import { AutoImageSlider } from "../../AutoImageSlider";
import { FaArrowRight } from "react-icons/fa";
import ShimmerWrapper from "../../Shimmer";

const AvatarModal = ({
  isCustomAvatarModalOpen,
  setIsCustomAvatarModalOpen,
  onConfirmAvatarModal,
  avatarIdentifier,
  setAvatarIdentifier,
  animatedImages,
  storyElement,
  handleNarrativeChange,
  handleChangeLook,
  isLoading,
}) => {
  return (
    <div>
      <Modal
        isOpen={isCustomAvatarModalOpen}
        onClose={() => setIsCustomAvatarModalOpen(false)}
        onCancel={() => setIsCustomAvatarModalOpen(false)}
        onConfirm={onConfirmAvatarModal}
        title="Create New Character"
        confirmText="Finalize the character"
        isConfirmDisabled={!avatarIdentifier}
      >
        <div className="flex w-full h-full px-10 py-6 flex-start rounded-lg w-[70vw]">
          <div className="w-[40%] p-6  overflow-hidden flex align-center">
            <ShimmerWrapper isLoading={isLoading}>
              <AutoImageSlider
                images={animatedImages}
                autoPlay={false}
                currentButtonColor="black"
                defaultIndex={1}
              />
            </ShimmerWrapper>
          </div>
          <div className="w-[60%]  p-6 flex flex-col text-center align-center flex-start">
            <div className="flex flex-col  pl-5">
              {/* Centering h1 and h2 */}
              <h1 className="text-3xl font-bold text-gray-900">A.V.A.T.A.R.</h1>
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
                  <textarea
                    className="w-full px-4 py-3 bg-transparent text-gray-600 placeholder-gray-500 outline-none"
                    value={storyElement?.narrative} // Bound to state
                    onChange={(e) => handleNarrativeChange(e)}
                  ></textarea>
                  <button
                    className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center whitespace-nowrap transition-all"
                    onClick={handleChangeLook}
                  >
                    Change Look
                    <span className="ml-2">
                      <FaArrowRight />
                    </span>
                  </button>
                </div>

                <div>
                  <p className="text-lg text-gray-700 my-4">
                    Use a unique identifier for your character that isn't part
                    of regular English vocabulary.{" "}
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
                    value={avatarIdentifier}
                    onChange={(e) => setAvatarIdentifier(e.target.value)}
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
  );
};

export default AvatarModal;
