import { useEffect, useState } from "react";
import {
  FaUpload,
  FaFileAlt,
  FaUser,
  FaPalette,
  FaFilm,
  FaCheck,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import Realstic from "../assets/images/realistic_preview.png";
import Animated from "../assets/images/animated_preview.png";
import Sketch from "../assets/images/sketch_preview.png";
import { FaArrowRight } from "react-icons/fa";
import { IoTabletPortraitOutline } from "react-icons/io5";
import { IoTabletLandscapeOutline } from "react-icons/io5";
import { IoSquareOutline } from "react-icons/io5";
import storyElement from "../assets/sample/story_elements.json";

import {
  CharacterStyles,
  EditStoryModes,
  VideoOrientationStyles,
} from "../utils/constants";
import {
  useEditStoryElementMutation,
  useLazyGetStyleQuery,
  useSubmitStyleMutation,
} from "../redux/services/chooseCharacterService/chooseCharacterApi";
import { UploadAudioState } from "../redux/features/uploadSlice";
import { LyricEditState } from "../redux/features/lyricEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetStoryElementQuery } from "../redux/services/lyricEditService/lyricEditApi";
import { convertJsonToFile, uploadJsonAsFileToS3 } from "../utils/helper";
import { uploadFileToS3 } from "../aws/s3-service";
import { AppState, setProtoPromptsUrl, setStyleImagesUrl } from "../redux/features/appSlice";

const CHARACTER_DETAILS = storyElement.character_details;
const styles = [
  { name: CharacterStyles.REALISTIC, image: Realstic },
  { name: CharacterStyles.ANIMATED, image: Animated },
  { name: CharacterStyles.SKETCH, image: Sketch },
];

const CharacterSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loraPath, styleImagesUrl } = useSelector(AppState);

  const [editStory, { data: sceneLLMResponse }] = useEditStoryElementMutation();
  const [getStoryElement, { data: storyElementData }] =
    useLazyGetStoryElementQuery();
  const [submitStyle, { data: submitStyleData }] = useSubmitStyleMutation();
  const [getStyle, { data: getStyleData }] = useLazyGetStyleQuery();

  const { storyEleementFileUrl } = useSelector(LyricEditState);
  const { sceneDataFileUrl, audioType } = useSelector(UploadAudioState);

  const [selectedStyle, setSelectedStyle] = useState("Animated");
  const [selected, setSelected] = useState<string | null>(null);
  const [orientationStyle, setOrientationStyle] = useState<string | null>(null);
  const [storyElement, setStoryElement] = useState(null);
  const [styleImages, setStyleImages] = useState<any>(styles);

  const handleChangeLook = async () => {
    const file = convertJsonToFile({ storyElement }, "story_element.json");
    const fileUrl = await uploadFileToS3(
      file,
      localStorage.getItem("currentUser")
    );
    submitStyle({
      lora_path: loraPath,
      character_name: location.state?.characterName,
      character_outfit: storyElement.character_outfit,
    });
  };

  const handleNarrativeChange = (event) => {
    setStoryElement((prev: any) => ({
      ...prev,
      narrative: event.target.value,
    }));
  };

  const handleNext = () => {
    navigate("/editscene", {
      state: {
        selectedStyle,
        orientationStyle,
        lipsync:
          selected === "yes" && selectedStyle !== CharacterStyles.ANIMATED,
      },
    });
  };

  useEffect(() => {
    const fetchStoryElement = async () => {
      try {
        const response = await fetch(storyEleementFileUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        const jsonData = await response.json();
        setStoryElement(jsonData.story_elements);
      } catch (error) {
        console.error("Error fetching JSON:", error);
      }
    };

    fetchStoryElement();
  }, []);

  useEffect(() => {
    if (styleImagesUrl) {
      setStyleImages((prevStyles) =>
        prevStyles.map((style) => ({
          ...style,
          image: styleImagesUrl[style.name.toLowerCase()] || style.image,
        }))
      );
    }

    editStory({
      mode: EditStoryModes.CREATE_PROMPT,
      scenes_path: sceneDataFileUrl,
      story_elements: storyEleementFileUrl,
      character_name: location.state?.characterName,
      media_type: audioType?.toLowerCase(),
    });
  }, []);

  useEffect(() => {
    if (sceneLLMResponse?.call_id) {
      getStoryElement(sceneLLMResponse?.call_id);
    }
  }, [sceneLLMResponse]);

  useEffect(() => {
    if (storyElementData) {
      uploadJsonAsFileToS3(storyElementData, "proto_prompts.json").then(
        (url) => {
          dispatch(setProtoPromptsUrl(url));
          console.log("upload proto_prompts.json successful", url);
        }
      );
    }
  }, [storyElementData]);

  useEffect(() => {
    if (submitStyleData?.call_id) {
      getStyle(submitStyleData?.call_id);
    }
  }, [submitStyleData]);

  useEffect(() => {
    if (getStyleData) {
      dispatch(setStyleImagesUrl(getStyleData));
    }
  }, [getStyleData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center">
        <div className="px-20 max-w-[1200px]">
          <div className="w-full mt-10">
            <div className="w-full mt-10">
              <div className="flex justify-start w-[60%] mb-6">
                <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                  Generate your video
                </h1>
              </div>
            </div>
          </div>
          <div>
            <ProgressBar currentStep={4} />

            <div className="w-full min-h-screen bg-white flex flex-col py-6">
              {/* Title */}
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Choose your main character’s look & art style for the video
                </h1>
                <p className="text-gray-500 text-sm mt-1 w-full leading-[24px]">
                  You can use the prompt bar to describe the look of the main
                  character & then choose an art style for the final video
                </p>

                {/* Input & Change Look Button */}
                <div className="flex items-center mt-4 w-full bg-[#F3F3F3] rounded-xl p-2">
                  <textarea
                    className="w-full px-4 py-3 bg-transparent text-gray-600 placeholder-gray-500 outline-none"
                    value={storyElement?.narrative} // Bound to state
                    onChange={(e) => handleNarrativeChange(e)}
                  >
                    {CHARACTER_DETAILS}
                  </textarea>
                  <button
                    className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center whitespace-nowrap transition-all"
                    onClick={handleChangeLook}
                  >
                    Change Look{" "}
                    <span className="ml-2">
                      <FaArrowRight />
                    </span>
                  </button>
                </div>
              </div>

              {/* Character Styles */}
              <div className="flex flex-col mt-6 space-y-6">
                <div className="flex space-x-6 px-8">
                  {styleImages.map((style) => (
                    <div
                      key={style.name}
                      className="relative rounded-lg transition-all cursor-pointer overflow-hidden border border-gray-300"
                      onClick={() => setSelectedStyle(style.name)}
                    >
                      <img
                        src={style.image}
                        alt={style.name}
                        className="w-80 h-68 rounded-lg transition-transform duration-300"
                      />
                      {/* Overlay for Selected Item */}
                      <div
                        className={`absolute bottom-0 w-full py-2 text-left pl-4 font-semibold border-t  border-gray-300
                          ${
                            selectedStyle === style.name
                              ? "bg-black text-white"
                              : "bg-white text-black bg-opacity-[0.5] backdrop-blur-md"
                          }`}
                      >
                        {style.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show Lipsync Section below the images if style.name is Realistic */}
                <div className="mt-4 p-4 border rounded-lg">
                  {/* Choose video orientation for Realistic or Sketch */}
                  <div className="mb-4">
                    <p className="font-semibold mb-2">
                      Choose Video Orientation
                    </p>
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
                        {/* Portrait Icon */}
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

                      {/* Landscape */}
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

                      {/* Square */}
                      <label
                        className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
                            ${
                              orientationStyle === VideoOrientationStyles.SQUARE
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
                  {selectedStyle !== CharacterStyles.ANIMATED && (
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

              {/* Navigation Buttons */}
              <div className="flex justify-end w-full mt-6">
                <button className="px-6 py-2 mr-2 border border-gray-400 text-gray-700 rounded-md bg-white hover:bg-gray-200">
                  Previous
                </button>
                <button
                  className="px-6 py-2 bg-black text-white rounded-md shadow-md hover:bg-gray-900"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelectionPage;
