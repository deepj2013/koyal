import { X } from "lucide-react";
import Dropdown from "../../common/Dropdown/Dropdown";
import { useState } from "react";
import {
  CharacterStyles,
  StyleColors,
  styles,
  VideoOrientationStyles,
} from "../../../utils/constants";
import {
  IoSquareOutline,
  IoTabletLandscapeOutline,
  IoTabletPortraitOutline,
} from "react-icons/io5";

const EditSongModal = ({
  isEdit,
  isOpen,
  onClose,
  onConfirm,
  options,
  selectedScene,
  setSelectedScene,
  isConfirmDisabled,
}) => {
  if (!isOpen) return null;

  const handleChange = (key, newValue) => {
    setSelectedScene((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">
            {" "}
            {isEdit ? "Edit" : "Add"} Song Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className=" mt-1 w-[50%] ">
              <Dropdown
                label={selectedScene.title}
                options={options}
                onChange={(selectedOption) =>
                  handleChange("audioId", selectedOption)
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md text-sm"
              rows={2}
              placeholder="Enter theme details"
              value={selectedScene?.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Character
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md text-sm"
              placeholder="Enter character name"
              value={selectedScene?.character}
              onChange={(e) => handleChange("character", e.target.value)}
            />
          </div>
        </div>

        {/* Style Selection */}
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-700">Style</span>
          <div className="flex space-x-4 mt-4">
            {styles.map((style) => (
              <>
                <button
                  key={style.id}
                  className={`flex items-center space-x-2 px-3 py-1 ${
                    selectedScene?.style === style.label &&
                    "border rounded-md bg-gray-100"
                  }`}
                  onClick={(e) => handleChange("style", style.label)}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${StyleColors[style.id]}`}
                  ></span>
                  <span className="text-sm">{style.label}</span>
                </button>
              </>
            ))}
          </div>
        </div>

        {/* Video Orientation */}
        <div className="flex space-x-4">{/* Portrait */}</div>
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-700">
            Choose Video Orientation
          </span>
          <div className="flex space-x-4 mt-2 h-[37px]">
            <label
              className={`inline-flex items-center px-4 py-2 border-2 rounded-md cursor-pointer transition-all text-sm
              ${
                selectedScene.orientation === VideoOrientationStyles.PORTRAIT
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() =>
                handleChange("orientation", VideoOrientationStyles.PORTRAIT)
              }
            >
              <IoTabletPortraitOutline
                className={`w-4 h-4 mr-2 transition-colors duration-200 
                ${
                  selectedScene.orientation === VideoOrientationStyles.PORTRAIT
                    ? "text-white"
                    : "text-gray-700"
                }`}
              />
              Portrait
            </label>
            <label
              className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
              ${
                selectedScene.orientation === VideoOrientationStyles.LANDSCAPE
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() =>
                handleChange("orientation", VideoOrientationStyles.LANDSCAPE)
              }
            >
              <IoTabletLandscapeOutline
                className={`w-7 h-6 mr-2 transition-colors duration-200 
                ${
                  selectedScene.orientation === VideoOrientationStyles.LANDSCAPE
                    ? "text-white"
                    : "text-gray-700"
                }`}
              />
              Landscape
            </label>

            <label
              className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all text-sm
              ${
                selectedScene.orientation === VideoOrientationStyles.SQUARE
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() =>
                handleChange("orientation", VideoOrientationStyles.SQUARE)
              }
            >
              <IoSquareOutline
                className={`w-6 h-6 mr-2 transition-colors duration-200 
                                          ${
                                            selectedScene.orientation ===
                                            VideoOrientationStyles.SQUARE
                                              ? "text-white"
                                              : "text-gray-700"
                                          }`}
              />
              Square
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={` px-4 py-2 bg-black text-white text-sm h-[40px] rounded-md relative group ${
              isConfirmDisabled
                ? "bg-gray-300 text-gray-800"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            disabled={isConfirmDisabled}
          >
            Save {isEdit ? "changes" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSongModal;
