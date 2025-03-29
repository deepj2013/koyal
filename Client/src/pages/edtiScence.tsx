import React, { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { useLocation, useNavigate } from "react-router-dom";

import img0 from "../assets/images/newEditScene/landscape_realistic/image_0.png";
import img1 from "../assets/images/newEditScene/landscape_realistic/image_1.png";
import img2 from "../assets/images/newEditScene/landscape_realistic/image_2.png";
import img3 from "../assets/images/newEditScene/landscape_realistic/image_3.png";
import img4 from "../assets/images/newEditScene/landscape_realistic/image_4.png";
import img5 from "../assets/images/newEditScene/landscape_realistic/image_5.png";
import img6 from "../assets/images/newEditScene/landscape_realistic/image_6.png";
import img7 from "../assets/images/newEditScene/landscape_realistic/image_7.png";
import img8 from "../assets/images/newEditScene/landscape_realistic/image_8.png";
import img9 from "../assets/images/newEditScene/landscape_realistic/image_9.png";
import img10 from "../assets/images/newEditScene/landscape_realistic/image_10.png";
import img11 from "../assets/images/newEditScene/landscape_realistic/image_11.png";
import img12 from "../assets/images/newEditScene/landscape_realistic/image_12.png";
import img13 from "../assets/images/newEditScene/landscape_realistic/image_13.png";
import img14 from "../assets/images/newEditScene/landscape_realistic/image_14.png";
import img15 from "../assets/images/newEditScene/landscape_realistic/image_15.png";
import img16 from "../assets/images/newEditScene/landscape_realistic/image_16.png";
import img17 from "../assets/images/newEditScene/landscape_realistic/image_17.png";
import img18 from "../assets/images/newEditScene/landscape_realistic/image_18.png";
import img19 from "../assets/images/newEditScene/landscape_realistic/image_19.png";
import img20 from "../assets/images/newEditScene/landscape_realistic/image_20.png";
import img21 from "../assets/images/newEditScene/landscape_realistic/image_21.png";
import img22 from "../assets/images/newEditScene/landscape_realistic/image_22.png";
import img23 from "../assets/images/newEditScene/landscape_realistic/image_23.png";
import img24 from "../assets/images/newEditScene/landscape_realistic/image_24.png";
import img25 from "../assets/images/newEditScene/landscape_realistic/image_25.png";
import img26 from "../assets/images/newEditScene/landscape_realistic/image_26.png";
import img27 from "../assets/images/newEditScene/landscape_realistic/image_27.png";
import img28 from "../assets/images/newEditScene/landscape_realistic/image_28.png";
import img29 from "../assets/images/newEditScene/landscape_realistic/image_29.png";
import img30 from "../assets/images/newEditScene/landscape_realistic/image_30.png";
import img31 from "../assets/images/newEditScene/landscape_realistic/image_31.png";
import img32 from "../assets/images/newEditScene/landscape_realistic/image_32.png";
import img33 from "../assets/images/newEditScene/landscape_realistic/image_33.png";
import img34 from "../assets/images/newEditScene/landscape_realistic/image_34.png";
import img35 from "../assets/images/newEditScene/landscape_realistic/image_35.png";
import img36 from "../assets/images/newEditScene/landscape_realistic/image_36.png";
import img37 from "../assets/images/newEditScene/landscape_realistic/image_37.png";

import animatedImage0 from "../assets/images/newEditScene/portrait_animated/image_0.png";
import animatedImage1 from "../assets/images/newEditScene/portrait_animated/image_1.png";
import animatedImage2 from "../assets/images/newEditScene/portrait_animated/image_2.png";
import animatedImage3 from "../assets/images/newEditScene/portrait_animated/image_3.png";
import animatedImage4 from "../assets/images/newEditScene/portrait_animated/image_4.png";
import animatedImage5 from "../assets/images/newEditScene/portrait_animated/image_5.png";
import animatedImage6 from "../assets/images/newEditScene/portrait_animated/image_6.png";
import animatedImage7 from "../assets/images/newEditScene/portrait_animated/image_7.png";
import animatedImage8 from "../assets/images/newEditScene/portrait_animated/image_8.png";
import animatedImage9 from "../assets/images/newEditScene/portrait_animated/image_9.png";
import animatedImage10 from "../assets/images/newEditScene/portrait_animated/image_10.png";
import animatedImage11 from "../assets/images/newEditScene/portrait_animated/image_11.png";
import animatedImage12 from "../assets/images/newEditScene/portrait_animated/image_12.png";
import animatedImage13 from "../assets/images/newEditScene/portrait_animated/image_13.png";
import animatedImage14 from "../assets/images/newEditScene/portrait_animated/image_14.png";
import animatedImage15 from "../assets/images/newEditScene/portrait_animated/image_15.png";
import animatedImage16 from "../assets/images/newEditScene/portrait_animated/image_16.png";
import animatedImage17 from "../assets/images/newEditScene/portrait_animated/image_17.png";
import animatedImage18 from "../assets/images/newEditScene/portrait_animated/image_18.png";
import animatedImage19 from "../assets/images/newEditScene/portrait_animated/image_19.png";
import animatedImage20 from "../assets/images/newEditScene/portrait_animated/image_20.png";
import animatedImage21 from "../assets/images/newEditScene/portrait_animated/image_21.png";
import animatedImage22 from "../assets/images/newEditScene/portrait_animated/image_22.png";
import animatedImage23 from "../assets/images/newEditScene/portrait_animated/image_23.png";
import animatedImage24 from "../assets/images/newEditScene/portrait_animated/image_24.png";
import animatedImage25 from "../assets/images/newEditScene/portrait_animated/image_25.png";
import animatedImage26 from "../assets/images/newEditScene/portrait_animated/image_26.png";
import animatedImage27 from "../assets/images/newEditScene/portrait_animated/image_27.png";
import animatedImage28 from "../assets/images/newEditScene/portrait_animated/image_28.png";
import animatedImage29 from "../assets/images/newEditScene/portrait_animated/image_29.png";
import animatedImage30 from "../assets/images/newEditScene/portrait_animated/image_30.png";
import animatedImage31 from "../assets/images/newEditScene/portrait_animated/image_31.png";
import animatedImage32 from "../assets/images/newEditScene/portrait_animated/image_32.png";
import animatedImage33 from "../assets/images/newEditScene/portrait_animated/image_33.png";
import animatedImage34 from "../assets/images/newEditScene/portrait_animated/image_34.png";
import animatedImage35 from "../assets/images/newEditScene/portrait_animated/image_35.png";
import animatedImage36 from "../assets/images/newEditScene/portrait_animated/image_36.png";
import animatedImage37 from "../assets/images/newEditScene/portrait_animated/image_37.png";
import { FaUndo } from "react-icons/fa";

import { CharacterStyles, EditStoryModes } from "../utils/constants";
import ImagePreview from "../components/ImagePreview";
import { useDispatch, useSelector } from "react-redux";
import {
  AppState,
  setImageFolderUrl,
  setProtoPromptsUrl,
  setScenesJson,
} from "../redux/features/appSlice";
import { LyricEditState } from "../redux/features/lyricEditSlice";
import { processImage } from "../redux/services/editSceneService/editSceneService";
import { useEditStoryElementMutation } from "../redux/services/chooseCharacterService/chooseCharacterApi";
import { UploadAudioState } from "../redux/features/uploadSlice";
import { useLazyGetStoryElementQuery } from "../redux/services/lyricEditService/lyricEditApi";
import { uploadJsonAsFileToS3 } from "../utils/helper";
import ShimmerWrapper from "../components/Shimmer";

const images = {
  realistic: {
    0: img0,
    1: img1,
    2: img2,
    3: img3,
    4: img4,
    5: img5,
    6: img6,
    7: img7,
    8: img8,
    9: img9,
    10: img10,
    11: img11,
    12: img12,
    13: img13,
    14: img14,
    15: img15,
    16: img16,
    17: img17,
    18: img18,
    19: img19,
    20: img20,
    21: img21,
    22: img22,
    23: img23,
    24: img24,
    25: img25,
    26: img26,
    27: img27,
    28: img28,
    29: img29,
    30: img30,
    31: img31,
    32: img32,
    33: img33,
    34: img34,
    35: img35,
    36: img36,
    37: img37,
  },
  animated: {
    0: animatedImage0,
    1: animatedImage1,
    2: animatedImage2,
    3: animatedImage3,
    4: animatedImage4,
    5: animatedImage5,
    6: animatedImage6,
    7: animatedImage7,
    8: animatedImage8,
    9: animatedImage9,
    10: animatedImage10,
    11: animatedImage11,
    12: animatedImage12,
    13: animatedImage13,
    14: animatedImage14,
    15: animatedImage15,
    16: animatedImage16,
    17: animatedImage17,
    18: animatedImage18,
    19: animatedImage19,
    20: animatedImage20,
    21: animatedImage21,
    22: animatedImage22,
    23: animatedImage23,
    24: animatedImage24,
    25: animatedImage25,
    26: animatedImage26,
    27: animatedImage27,
    28: animatedImage28,
    29: animatedImage29,
    30: animatedImage30,
    31: animatedImage31,
    32: animatedImage32,
    33: animatedImage33,
    34: animatedImage34,
    35: animatedImage35,
    36: animatedImage36,
    37: animatedImage37,
  },
};

const emotions = {
  euphoric: "bg-yellow-300",
  serene: "bg-blue-300",
  melancholy: "bg-purple-300",
  tense: "bg-red-300",
  default: "bg-gray-200",
};

const GenerateVideoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [editStory, { data: sceneLLMResponse }] = useEditStoryElementMutation();
  const [getStoryElement, { data: storyElementData }] =
    useLazyGetStoryElementQuery();

  const { loraPath, protoPromptsUrl, characterName, lyricsJsonUrl } =
    useSelector(AppState);
  const { storyEleementFileUrl } = useSelector(LyricEditState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [scenes, setScenes] = useState<any[]>([]);
  const [tableBodyHeight, setTableBodyHeight] = useState("auto");
  const [storyElement, setStoryElement] = useState(null);
  const [promptsJson, setPromptsJson] = useState([]);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [lyrics, setLyrics] = useState<any[]>([]);

  // Open Modal and Load Scene Data
  const handleEditClick = (scene, index) => {
    setCurrentEditIndex(index);
    setNewDescription("");
    setIsModalOpen(true);
  };

  const callProcessImageApi = (index: number) => {
    processImage({
      prompt_indices: index,
      proto_prompts: protoPromptsUrl,
      character_lora_path: loraPath,
      character_name: characterName,
      character_outfit: storyElement?.character_details,
      style: location.state?.selectedStyle?.name?.toLowerCase(),
      orientation: location.state?.orientationStyle?.toLowerCase(),
      id_image: location.state?.selectedStyle?.image,
      getImage: getImage,
    });
  };

  const handleRedo = async (index) => {
    callProcessImageApi(index + 1);
  };

  // Save Changes and Update Table
  const handleSave = () => {
    editStory({
      mode: EditStoryModes.EDIT_PROMPT,
      prompts_path: protoPromptsUrl,
      prompt_index: currentEditIndex,
      edit_instruction: newDescription,
    });
    setIsModalOpen(false);
  };

  const generateVideo = () => {
    navigate("/finalvideo", {
      state: {
        selectedStyle: location.state?.selectedStyle,
        orientationStyle: location.state?.orientationStyle,
      },
    });
    dispatch(setScenesJson(scenes));
  };

  const replaceGeneratedImage = (imageUrl, index) => {
    setScenes((prev) => {
      const updatedJson = [...prev];

      const ind = Number(index);
      if (updatedJson[ind]) {
        updatedJson[ind] = {
          ...updatedJson[ind],
          image: imageUrl,
        };
      }
      return updatedJson;
    });
  };

  const setFolderPath = (fileUrl: string) => {
    const folderPath = fileUrl.substring(0, fileUrl.lastIndexOf("/") + 1);
    console.log("folderPath for images:", folderPath);
    dispatch(setImageFolderUrl(folderPath));
  };

  useEffect(() => {
    if (lyrics?.length > 0 && promptsJson.length > 0) {
      try {
        const mergedScenes = lyrics
          .map((muxItem) => {
            const promptMatch = promptsJson?.find(
              (prompt) =>
                prompt.start === muxItem.start && prompt.end === muxItem.end
            );

            if (promptMatch) {
              const { start, end } = promptMatch;
              return {
                image: null,
                description: promptMatch.narrative,
                dialogue: promptMatch.dialogue || muxItem[2],
                emotion: promptMatch.emotion || muxItem[3],
                start,
                end,
              };
            }
            return null;
          })
          .filter(Boolean);

        setScenes(mergedScenes);
      } catch (error) {
        console.error("Error loading scene data", error);
      }
    }
  }, [lyrics, promptsJson]);

  useEffect(() => {
    const updateTableHeight = () => {
      const createBtn = document.getElementById("create-btn");
      const header = document.getElementById("table-header");

      let totalFooterHeight = 0;
      if (createBtn) {
        const computedStyle = window.getComputedStyle(createBtn);
        const marginTop = parseFloat(computedStyle.marginTop); // Get (margin-top)
        const createBtnHeight = createBtn.offsetHeight; // Get element height
        totalFooterHeight = createBtnHeight + marginTop;
      }

      if (header) {
        const headerOffset = header.getBoundingClientRect().top;
        const headerHeight = header.offsetHeight;
        const tableBodyHeight =
          window.innerHeight -
          headerOffset -
          headerHeight -
          totalFooterHeight -
          24; // 24px is padding
        setTableBodyHeight(`${tableBodyHeight}px`);
      }
    };

    updateTableHeight();
    window.addEventListener("resize", updateTableHeight);

    return () => {
      window.removeEventListener("resize", updateTableHeight);
    };
  }, []);

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

  const getImage = (index, obj) => {
    const { image_path, prompt_index } = obj;
    setScenes((prevScenes) =>
      prevScenes.map((scene, i) =>
        i + 1 === index ? { ...scene, image: image_path } : scene
      )
    );

    setFolderPath(image_path);
    replaceGeneratedImage(image_path, prompt_index);
  };

  useEffect(() => {
    const fetchProtoPrompts = async () => {
      try {
        const response = await fetch(protoPromptsUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        const jsonData = await response.json();
        setPromptsJson(jsonData.prompts);
        return jsonData.prompts;
      } catch (error) {
        console.error("Error fetching JSON:", error);
        return []; // Return an empty array to avoid further issues
      }
    };

    const processPrompts = async () => {
      try {
        const prompts: any = await fetchProtoPrompts();

        for (const element of prompts) {
          callProcessImageApi(element.number);
        }
      } catch (error) {
        console.error("Error processing prompts:", error);
      }
    };

    processPrompts();
  }, []);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch(lyricsJsonUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        const jsonData = await response.json();
        setLyrics(jsonData);
      } catch (error) {
        console.error("Error fetching JSON:", error);
        return [];
      }
    };

    fetchLyrics();
  }, []);

  useEffect(() => {
    if (sceneLLMResponse?.call_id) {
      getStoryElement(sceneLLMResponse?.call_id);
    }
  }, [sceneLLMResponse]);

  useEffect(() => {
    if (storyElementData) {
      callProcessImageApi(currentEditIndex + 1);
      uploadJsonAsFileToS3(storyElementData, "proto_prompts.json")
        .then((url) => {
          dispatch(setProtoPromptsUrl(url));
          console.log("upload proto_prompts.json successful", url);
        })
        .catch((err) => {
          console.log("Error while replacing proto_prompts.json :", err);
        });
    }
  }, [storyElementData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center">
        <div className="px-20 max-w-[1200px]">
          <div className="w-full mt-6">
            <div className="flex justify-start w-[60%] mb-6">
              <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                Generate your video
              </h1>
            </div>
          </div>
          <div className="text-center">
            <ProgressBar currentStep={5} />
          </div>
          <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Title */}
            <h2 className="text-md font-semibold mb-4 text-gray-800">
              You can make edits to generated scenes individually
            </h2>

            {/* Table */}
            <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div
                id="table-header"
                className="grid grid-cols-[2fr_2fr_2fr_1fr_0.4fr_0.5fr] gap-4 p-3 bg-gray-100 border-b text-gray-600 text-sm font-semibold"
              >
                <span className="pl-3">Scene visual</span>
                <span>Scene description</span>
                <span>Dialogue</span>
                <span>Emotion</span>
                <span className="pr-3 text-center">Edit</span>
                <span className="pr-3 text-center">Redo</span>
              </div>

              {/* Table Rows */}
              <div
                className="divide-y overflow-y-auto"
                style={{ height: tableBodyHeight }}
              >
                {scenes.map((scene, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[2fr_2fr_2fr_1fr_0.4fr_0.5fr] gap-4 items-center p-4"
                  >
                    {/* Image */}
                    <ShimmerWrapper isLoading={true}>
                      {scene.image && <ImagePreview imageURL={scene.image} />}
                    </ShimmerWrapper>

                    {/* Description */}
                    <p className="text-sm text-gray-700">{scene.description}</p>

                    {/* Dialogue */}
                    <p className="text-sm text-gray-900">
                      {scene.dialogue || (
                        <span className="text-gray-500">
                          Background music, no dialogue
                        </span>
                      )}
                    </p>

                    {/* Emotion with Colored Circle */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-4 h-4 rounded-full border border-gray-500 ${
                          emotions[scene.emotion] || emotions.default
                        }`}
                      ></span>
                      <span className="text-sm font-medium text-gray-900">
                        {scene.emotion}
                      </span>
                    </div>

                    {/* Edit Button - Right-Aligned */}
                    <div className="text-center">
                      <button
                        className="p-2 bg-transparent hover:bg-gray-200 rounded-full"
                        onClick={() => handleEditClick(scene, index)}
                      >
                        <Pencil className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-center">
                      <button
                        className="p-2 bg-transparent hover:bg-gray-200 rounded-full"
                        onClick={() => handleRedo(index)}
                      >
                        <FaUndo className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                {/* Modal Container */}
                <div className="bg-black/30 backdrop-blur-xl rounded-t-3xl shadow-2xl p-6 w-full max-w-md relative border border-white/20 transform translate-y-0 animate-slide-up">
                  {/* Close Bar (iOS Style) */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-white/50 rounded-full"></div>

                  {/* Close Button */}
                  <button
                    className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Title */}
                  <h3 className="text-xl font-semibold text-white text-center mb-4">
                    What kind of scene do you want?
                  </h3>

                  {/* Description Input */}
                  <textarea
                    className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-gray-200 placeholder-opacity-50"
                    rows={4}
                    placeholder="Ex: make the character smile"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />

                  {/* Save Button */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-black text-white rounded-md"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6" id="create-btn">
              <button
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={generateVideo}
              >
                Create Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateVideoPage;
