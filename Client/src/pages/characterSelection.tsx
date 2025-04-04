import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { FaArrowRight } from "react-icons/fa";
import storyElement from "../assets/sample/story_elements.json";

import {
  AvatarProcessModes,
  CharacterStyles,
  EditStoryModes,
} from "../utils/constants";
import {
  useEditStoryElementMutation,
  useLazyGetProcessedAvatarQuery,
  useLazyGetProcessedCharacterQuery,
  useLazyGetStyleQuery,
  useLazyGetTrainedCharacterQuery,
  usePreprocessCharacterMutation,
  useProcessAvatarMutation,
  useSubmitStyleMutation,
  useTrainCharacterMutation,
} from "../redux/services/chooseCharacterService/chooseCharacterApi";
import { UploadAudioState } from "../redux/features/uploadSlice";
import { LyricEditState } from "../redux/features/lyricEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetStoryElementQuery } from "../redux/services/lyricEditService/lyricEditApi";
import { convertJsonToFile, uploadJsonAsFileToS3 } from "../utils/helper";
import { uploadFileToS3 } from "../aws/s3-service";
import {
  AppState,
  setLoraPath,
  setProtoPromptsUrl,
  setStyleImagesUrl,
} from "../redux/features/appSlice";
import { Modal } from "../components/Modal";
import AdvertiserSection from "../components/layouts/AdvertiserSection";
import CountdownTimer from "../components/CountdownTimer";
import VisualStyleComponent from "../components/layouts/characterSelection/VisualStyle";
import { animatedStyle, realisticStyle, sketchStyle } from "../assets";

const CHARACTER_DETAILS = storyElement.character_details;
const styles = [
  { name: CharacterStyles.REALISTIC, image: null },
  { name: CharacterStyles.ANIMATED, image: null },
  { name: CharacterStyles.SKETCH, image: null },
];

const CharacterSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { characterName, loraPath, isCharchaChosen, characterFolderPath } =
    useSelector(AppState);

  const [preprocessCharacter, { data: processedCharResponse }] =
    usePreprocessCharacterMutation();
  const [getCharResult, { data: charResult, reset: resetCharResult }] =
    useLazyGetProcessedCharacterQuery();
  const [trainCharacter, { data: trainedCharResponse }] =
    useTrainCharacterMutation();

  const [
    processAvatar,
    { data: processedAvatarResponse, isLoading: isAvatarLoading },
  ] = useProcessAvatarMutation();
  const [getAvatar, { data: avatarData, isLoading: isAvatarDataLoading }] =
    useLazyGetProcessedAvatarQuery();

  const [getTrainedCharacter, { data: trainedCharacter, isLoading }] =
    useLazyGetTrainedCharacterQuery();

  const [editStory, { data: sceneLLMResponse }] = useEditStoryElementMutation();
  const [getStoryElement, { data: storyElementData }] =
    useLazyGetStoryElementQuery();
  const [submitStyle, { data: submitStyleData, reset: resetSubmitStyleData }] =
    useSubmitStyleMutation();
  const [getStyle, { data: getStyleData }] = useLazyGetStyleQuery();

  const { storyEleementFileUrl } = useSelector(LyricEditState);
  const { sceneDataFileUrl, audioType } = useSelector(UploadAudioState);

  const [selectedStyle, setSelectedStyle] = useState(styles[1]);
  const [selected, setSelected] = useState<string | null>(null);
  const [orientationStyle, setOrientationStyle] = useState<string | null>(null);
  const [storyElement, setStoryElement] = useState(null);
  const [styleImages, setStyleImages] = useState<any>(styles);
  const [activeOption, setActiveOption] = useState("advertisers");

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

  const callProcessCharacterAPI = (uriPath: string) => {
    preprocessCharacter({
      images_path: uriPath,
      character_name: characterName,
    });
  };

  const handleNext = () => {
    navigate("/editscene", {
      state: {
        selectedStyle,
        orientationStyle,
        lipsync:
          selected === "yes" &&
          selectedStyle?.name !== CharacterStyles.ANIMATED,
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
    editStory({
      mode: EditStoryModes.CREATE_PROMPT,
      scenes_path: sceneDataFileUrl,
      story_elements: storyEleementFileUrl,
      character_name: location?.state?.characterName,
      media_type: audioType?.toLowerCase(),
    });
  }, []);

  useEffect(() => {
    if (isCharchaChosen === true) {
      callProcessCharacterAPI(characterFolderPath);
    } else {
      processAvatar({
        mode: AvatarProcessModes.UPSCALE,
        images_path: characterFolderPath,
      });
    }
  }, []);

  useEffect(() => {
    if (processedCharResponse?.call_id) {
      getCharResult(processedCharResponse?.call_id);
    }
  }, [processedCharResponse]);

  useEffect(() => {
    if (charResult) {
      trainCharacter({
        processed_path: charResult?.processed_path,
        character_name: characterName,
      });
      resetCharResult();
    }
  }, [charResult]);

  useEffect(() => {
    if (trainedCharResponse?.call_id) {
      getTrainedCharacter(trainedCharResponse?.call_id);
    }
  }, [trainedCharResponse]);

  useEffect(() => {
    if (processedAvatarResponse?.call_id) {
      getAvatar(processedAvatarResponse?.call_id);
    }
  }, [processedAvatarResponse]);

  useEffect(() => {
    if (avatarData?.upscaled_path) {
      callProcessCharacterAPI(avatarData?.upscaled_path);
    }
  }, [avatarData]);

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
    if (trainedCharacter?.lora_path) {
      dispatch(setLoraPath(trainedCharacter.lora_path));
      submitStyle({
        lora_path: trainedCharacter.lora_path,
        character_name: location?.state?.characterName,
        character_outfit: storyElement?.character_outfit,
      });
    }
  }, [trainedCharacter]);

  useEffect(() => {
    if (submitStyleData?.call_id) {
      getStyle(submitStyleData?.call_id);
      resetSubmitStyleData();
    }
  }, [submitStyleData]);

  useEffect(() => {
    if (getStyleData) {
      setStyleImages((prev) =>
        prev.map((style) => {
          const key = style.name.toLowerCase();
          return {
            ...style,
            image: getStyleData[key] || style.image,
          };
        })
      );
      dispatch(setStyleImagesUrl(getStyleData));
    }
  }, [getStyleData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal
        isOpen={isLoading}
        onClose={() => {}}
        title={
          <h1 className="text-xl">
            While you wait for{" "}
            <span>
              <CountdownTimer seconds={100} />
            </span>
            , have a look at these samples...
          </h1>
        }
      >
        <AdvertiserSection
          activeOption={activeOption}
          setActiveOption={setActiveOption}
        />
      </Modal>
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

              <VisualStyleComponent
                styleImages={styleImages}
                setSelectedStyle={setSelectedStyle}
                selectedStyle={selectedStyle}
                orientationStyle={orientationStyle}
                setOrientationStyle={setOrientationStyle}
                selected={selected}
                setSelected={setSelected}
                isCollectionPage={false}
              />

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
