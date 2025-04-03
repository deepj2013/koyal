import React from "react";
import {
  CharacterStyles,
  VideoOrientationStyles,
} from "../../../utils/constants";
import {
  IoSquareOutline,
  IoTabletLandscapeOutline,
  IoTabletPortraitOutline,
} from "react-icons/io5";

const VisualStyleComponent = ({
  styleImages,
  setSelectedStyle,
  selectedStyle,
  orientationStyle,
  setOrientationStyle,
  selected,
  setSelected,
  isCollectionPage,
}) => {
  return (
    <div>
      <div
        className={`flex flex-col ${
          isCollectionPage ? "mt-2" : "mt-6"
        } space-y-6`}
      >
        <div className={`flex space-x-6 ${!isCollectionPage && "px-8"}`}>
          {styleImages.map((style) => (
            <div
              key={style.name}
              className="relative rounded-lg transition-all cursor-pointer overflow-hidden border border-gray-300"
              onClick={() => setSelectedStyle(style)}
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-80 h-68 rounded-lg transition-transform duration-300"
              />
              <div
                className={`absolute bottom-0 w-full py-2 text-left pl-4 font-semibold border-t  border-gray-300
                              ${
                                selectedStyle?.name === style.name
                                  ? "bg-black text-white"
                                  : "bg-white text-black bg-opacity-[0.5] backdrop-blur-md"
                              }`}
              >
                {style.name}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-4 ${!isCollectionPage && "p-4 border"} rounded-lg`}>
          <div className="mb-4">
            <p className="font-semibold mb-2">Choose Video Orientation</p>
            <div className="flex space-x-4">
              {/* Portrait */}
              <label
                className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                                ${
                                  orientationStyle ===
                                  VideoOrientationStyles.PORTRAIT
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                onClick={() =>
                  setOrientationStyle(VideoOrientationStyles.PORTRAIT)
                }
              >
                <IoTabletPortraitOutline
                  className={`w-6 h-6 mr-2 transition-colors duration-200 
                                  ${
                                    orientationStyle ===
                                    VideoOrientationStyles.PORTRAIT
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                />
                Portrait
              </label>

              <label
                className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                                ${
                                  orientationStyle ===
                                  VideoOrientationStyles.LANDSCAPE
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                onClick={() =>
                  setOrientationStyle(VideoOrientationStyles.LANDSCAPE)
                }
              >
                <IoTabletLandscapeOutline
                  className={`w-7 h-6 mr-2 transition-colors duration-200 
                                  ${
                                    orientationStyle ===
                                    VideoOrientationStyles.LANDSCAPE
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                />
                Landscape
              </label>

              <label
                className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                                ${
                                  orientationStyle ===
                                  VideoOrientationStyles.SQUARE
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                onClick={() =>
                  setOrientationStyle(VideoOrientationStyles.SQUARE)
                }
              >
                <IoSquareOutline
                  className={`w-6 h-6 mr-2 transition-colors duration-200 
                                  ${
                                    orientationStyle ===
                                    VideoOrientationStyles.SQUARE
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                />
                Square
              </label>
            </div>
          </div>
          {selectedStyle?.name !== CharacterStyles.ANIMATED && (
            <div>
              <p className="font-semibold mb-2">
                Do you want to add lipsync to your video?
              </p>
              <div className="flex space-x-4">
                <label
                  className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                                ${
                                  selected === "yes"
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                  onClick={() => setSelected("yes")}
                >
                  <input
                    type="radio"
                    name="likeness"
                    value="yes"
                    className="hidden"
                  />
                  {/* Custom Radio Button Circle */}
                  <span
                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-2 
                                  ${
                                    selected === "yes"
                                      ? "border-black bg-white"
                                      : "border-gray-500 bg-white"
                                  }`}
                  >
                    {selected === "yes" && (
                      <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
                    )}
                  </span>
                  Yes
                </label>

                <label
                  className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                                ${
                                  selected === "no"
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                  onClick={() => setSelected("no")}
                >
                  <input
                    type="radio"
                    name="likeness"
                    value="no"
                    className="hidden"
                  />
                  {/* Custom Radio Button Circle */}
                  <span
                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-2 
                                  ${
                                    selected === "no"
                                      ? "border-black bg-white"
                                      : "border-gray-500 bg-white"
                                  }`}
                  >
                    {selected === "no" && (
                      <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
                    )}
                  </span>
                  No
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualStyleComponent;
