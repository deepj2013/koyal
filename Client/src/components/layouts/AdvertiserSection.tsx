import React from "react";
import { VideoPlayer } from "../VideoPlayer";

import Realstic from "../../assets/vedio/clean_mehul_no_face_lipsync.mp4";
import Cartoon from "../../assets/vedio/cartoon_video_soumya.mp4";
import Sketch from "../../assets/vedio/sketch_video_prakhar.mp4";

const AdvertiserSection = ({ activeOption, setActiveOption }) => {
  return (
    <div className="flex flex-wrap w-full m-[5rem]  relative z-10">
      {/* Left Column: Expandable Options */}
      <div className="w-full md:w-1/2 lg:w-[40%] md:pr-12 ">
        {/* Option 1 */}
        <div className="border-b border-gray-300 pb-6 sm:pb-8 mb-8 sm:mb-12">
          <button
            className="w-full flex justify-between items-center text-[28px] sm:text-[36px] md:text-[43px] font-bold leading-[32px] sm:leading-[40px] md:leading-[46px] tracking-[-1.5px] sm:tracking-[-2px] md:tracking-[-2.309px] font-inter focus:outline-none"
            onClick={() => setActiveOption("advertisers")}
          >
            Advertisers
            <span>
              {activeOption === "advertisers" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5 5 5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 13l5 5 5-5"
                  />
                </svg>
              )}
            </span>
          </button>
          {activeOption === "advertisers" && (
            <p className="text-[16px] sm:text-[18px] md:text-[22px] font-normal leading-[22px] sm:leading-[24px] md:leading-[27px] tracking-[-1px] sm:tracking-[-1.2px] md:tracking-[-1.38px] font-inter text-gray-600 mt-3 sm:mt-4">
              Produce on-brand video content as well as client testimonials.
            </p>
          )}
        </div>

        {/* Option 2 */}
        <div className="border-b border-gray-300 pb-6 sm:pb-8 mb-8 sm:mb-12">
          <button
            className="w-full flex justify-between items-center text-[28px] sm:text-[36px] md:text-[43px] font-bold leading-[32px] sm:leading-[40px] md:leading-[46px] tracking-[-1.5px] sm:tracking-[-2px] md:tracking-[-2.309px] font-inter focus:outline-none"
            onClick={() => setActiveOption("podcasters")}
          >
            Podcasters
            <span>
              {activeOption === "podcasters" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5 5 5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 13l5 5 5-5"
                  />
                </svg>
              )}
            </span>
          </button>
          {activeOption === "podcasters" && (
            <p className="text-[16px] sm:text-[18px] md:text-[22px] font-normal leading-[22px] sm:leading-[24px] md:leading-[27px] tracking-[-1px] sm:tracking-[-1.2px] md:tracking-[-1.38px] font-inter text-gray-600 mt-3 sm:mt-4">
              Enhance your podcast visuals with stunning AI-driven animations.
            </p>
          )}
        </div>

        {/* Option 3 */}
        <div className="border-b border-gray-300 pb-6 sm:pb-8 mb-8 sm:mb-10">
          <button
            className="w-full flex justify-between items-center text-[28px] sm:text-[36px] md:text-[43px] font-bold leading-[32px] sm:leading-[40px] md:leading-[46px] tracking-[-1.5px] sm:tracking-[-2px] md:tracking-[-2.309px] font-inter focus:outline-none"
            onClick={() => setActiveOption("musicians")}
          >
            Musicians
            <span>
              {activeOption === "musicians" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5 5 5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 13l5 5 5-5"
                  />
                </svg>
              )}
            </span>
          </button>
          {activeOption === "musicians" && (
            <p className="text-[16px] sm:text-[18px] md:text-[22px] font-normal leading-[22px] sm:leading-[24px] md:leading-[27px] tracking-[-1px] sm:tracking-[-1.2px] md:tracking-[-1.38px] font-inter text-gray-600 mt-3 sm:mt-4">
              Create visual stories for your songs that captivate audiences.
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Dynamic Image Display */}
      <div className="w-full md:w-1/2 lg:w-[60%] flex justify-center">
        {activeOption === "advertisers" && <VideoPlayer videoSrc={Cartoon} />}
        {activeOption === "podcasters" && <VideoPlayer videoSrc={Sketch} />}
        {activeOption === "musicians" && <VideoPlayer videoSrc={Realstic} />}
      </div>
    </div>
  );
};

export default AdvertiserSection;
