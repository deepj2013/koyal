import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSceneDataFileUrl } from "../redux/features/uploadSlice";
import { uploadFileToS3 } from "../aws/s3-service";
import { convertJsonToFile, startApiPolling } from "../utils/helper";

import { AppState, setLyricsJsonUrl } from "../redux/features/appSlice";
import {
  useEmotionEndpointMutation,
  useLazyGetEmotionResultQuery,
  useLazyGetSceneResultQuery,
  useLazyGetTranscriberResultQuery,
  useSceneEndpointMutation,
  useTranscriberEndpointMutation,
} from "../redux/services/uploadAudioService/uploadAudioApi";
import ShimmerWrapper from "../components/Shimmer";

const TranscriptPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isEnglish, audioFileUrl } = useSelector(AppState);

  const [
    processEmotion,
    {
      data: { data: emotionResponse } = {},
      isLoading: isProcessEmotionLoading,
    },
  ] = useEmotionEndpointMutation();

  const [fetchEmotionResult, { isLoading: isEmotionResLoading }] =
    useLazyGetEmotionResultQuery();

  const [
    processTranscriber,
    {
      data: { data: transcriberResponse } = {},
      isLoading: isProcessTranscriberLoading,
    },
  ] = useTranscriberEndpointMutation();

  const [fetchTranscriberResult, { isLoading: isTranscriberResLoading }] =
    useLazyGetTranscriberResultQuery();

  const [
    procesScene,
    { data: { data: sceneResponse } = {}, isLoading: isProcessSceneLoading },
  ] = useSceneEndpointMutation();

  const [fetchSceneResult, { isLoading: isSceneResultLoading }] =
    useLazyGetSceneResultQuery();

  const isLoading =
    isEmotionResLoading ||
    isTranscriberResLoading ||
    isSceneResultLoading ||
    isProcessEmotionLoading ||
    isProcessSceneLoading ||
    isProcessTranscriberLoading;

  const [transcriptData, setTranscriptData] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [emotionsFileURL, setEmotionsFileURL] = useState(null);
  const [wordTimeStampFileURL, setWordTimeStampFileURL] = useState(null);
  const [isEmotionSuccess, setIsEmotionSuccess] = useState(false);
  const [isTranscriberSuccess, setIsTranscriberSuccess] = useState(false);

  const regexNoVocals = /no vocals/i;
  const emotionColors = {
    euphoric: { bg: "bg-yellow-200", border: "border-yellow-500" },
    serene: { bg: "bg-blue-200", border: "border-blue-500" },
    melancholy: { bg: "bg-purple-200", border: "border-purple-500" },
    tense: { bg: "bg-red-200", border: "border-red-500" },
    default: { bg: "bg-gray-200", border: "border-gray-500" },
  };

  const handleParagraphClick = (index) => {
    const entry = transcriptData[index];

    if (!entry) return; // Prevent crashes

    const { start, end, text, emotion } = entry;
    setSelectedParagraph({
      start, // Extract start time
      end, // Extract end time
      text, // Extract text
      emotion, // Extract emotion
      index: index, // Store index for update
    });
  };

  const handleAddSection = (index) => {
    const currentData = [...transcriptData];

    const { start, end, emotion } = currentData[index];

    const newSection = {
      start, // Use previous end time as start
      end, // Empty end time
      text: "", // Default text
      emotion, // Inherit emotion
    };

    currentData.splice(index, 1, newSection);
    setTranscriptData(currentData);

    setSelectedParagraph({
      start,
      end,
      text: newSection.text || "",
      emotion,
      index: index,
    });
  };

  const handleSave = async () => {
    if (selectedParagraph && selectedParagraph.index !== undefined) {
      const updatedData = [...transcriptData];

      const editedObj = {
        start: selectedParagraph.start,
        end: selectedParagraph.end,
        text: selectedParagraph.text || null,
        emotion: selectedParagraph.emotion,
      };
      let res = [editedObj];

      if (transcriptData[selectedParagraph.index]?.start < editedObj?.start) {
        const prefixObj = {
          start: transcriptData[selectedParagraph.index]?.start,
          end: editedObj.start,
          text: null,
          emotion: selectedParagraph.emotion,
        };
        res = [prefixObj, ...res];
      }

      if (transcriptData[selectedParagraph.index]?.end > editedObj?.end) {
        const postfixObj = {
          start: editedObj?.end,
          end: transcriptData[selectedParagraph.index].end,
          text: null,
          emotion: selectedParagraph.emotion,
        };
        res = [...res, postfixObj];
      }

      updatedData.splice(selectedParagraph.index, 1, ...res);

      setTranscriptData(updatedData); // Update state
      const file = convertJsonToFile(updatedData, "scene.json");
      const fileUrl = await uploadFileToS3(
        file,
        localStorage.getItem("currentUser")
      );
      dispatch(setLyricsJsonUrl(fileUrl));
      setSelectedParagraph(null); // Close modal
    }
  };

  const handleJsonFileUpload = async (
    data,
    fileName,
    setFileURL,
    nextAPICall
  ) => {
    try {
      const file = convertJsonToFile(data, fileName);
      const url = await uploadFileToS3(
        file,
        localStorage.getItem("currentUser")
      );
      console.log(fileName, url);

      if (setFileURL) {
        setFileURL(url);
      }

      if (nextAPICall) {
        nextAPICall();
      }

      return url;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  const handleNextClick = () => {
    navigate("/choosecharacter");
  };

  const callEmotionsAPI = (fileURL: string) => {
    processEmotion({ data: fileURL });
  };

  const callTranscriberAPI = (fileURL: string) => {
    processTranscriber({ data: fileURL, english_priority: isEnglish });
  };

  const callSceneAPI = () => {
    procesScene({
      word_timestamps: wordTimeStampFileURL,
      emotion_data: emotionsFileURL,
      audio_file: audioFileUrl,
    });
  };

  useEffect(() => {
    if (isEmotionSuccess && isTranscriberSuccess) {
      callSceneAPI();
      setIsEmotionSuccess(false);
      setIsTranscriberSuccess(false);
    }
  }, [isEmotionSuccess, isTranscriberSuccess]);

  const fetchJsonData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch JSON file");
      }
      const jsonData = await response.json();
      setTranscriptData(jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  };

  useEffect(() => {
    if (audioFileUrl) {
      callEmotionsAPI(audioFileUrl);
      callTranscriberAPI(audioFileUrl);
    }
  }, []);

  useEffect(() => {
    const onSuccess = (result) => {
      handleJsonFileUpload(
        result?.data,
        "emotion_data.json",
        setEmotionsFileURL,
        () => {
          setIsEmotionSuccess(true);
        }
      );
    };

    if (emotionResponse?.call_id) {
      startApiPolling(
        emotionResponse?.call_id,
        fetchEmotionResult,
        onSuccess
      );
    }
  }, [emotionResponse]);

  useEffect(() => {
    const onSuccess = (result) => {
      handleJsonFileUpload(
        result?.data,
        "word_timestamp.json",
        setWordTimeStampFileURL,
        () => {
          setIsTranscriberSuccess(true);
        }
      );
    };

    if (transcriberResponse?.call_id) {
      startApiPolling(
        transcriberResponse?.call_id,
        fetchTranscriberResult,
        onSuccess,
      );
    }
  }, [transcriberResponse]);

  useEffect(() => {
    const onSuccess = (response) => {
      handleJsonFileUpload(response.data, "scene.json", null, null).then(
        (url) => {
          console.log("scene json url:", url);
          dispatch(setSceneDataFileUrl(url));
          dispatch(setLyricsJsonUrl(url));
          fetchJsonData(url);
        }
      );
    };
    if (sceneResponse?.call_id) {
      startApiPolling(
        sceneResponse?.call_id,
        fetchSceneResult,
        onSuccess,
      );
      fetchSceneResult(sceneResponse?.call_id);
    }
  }, [sceneResponse]);

  return (
    <div className="h-screen flex flex-col bg-white">
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
          <ProgressBar currentStep={currentStep} />

          <div className="w-full mt-12">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-900">
                  Audio transcript
                </h2>
                <div className="flex items-center space-x-2">
                  {Object.entries(emotionColors).map(
                    ([key, color]) =>
                      key !== "default" && (
                        <div className="flex items-center space-x-2" key={key}>
                          <span
                            className={`w-4 h-4 rounded-full ${color.bg} border border-gray-300`}
                          ></span>
                          <span className="text-[15px] font-bold leading-[20px] text-gray-700 capitalize">
                            {key}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
              <p className="text-[16px] font-normal leading-[24px] tracking-[0%] text-gray-500 mb-4">
                Click portions to edit dialogue or emotions
              </p>
            </div>
          </div>

          <div className="flex w-full h-[40vh] relative p-3 pr-0 rounded-[12px]">
            {/* First Column (70%) */}
            <div className="w-full overflow-y-scroll pl-2">
              <div className="w-[63%]">
                {transcriptData?.length < 1 && (
                  <ShimmerLyricsComponent
                    isLoading={transcriptData?.length < 1}
                  />
                )}

                {transcriptData.map((entry, index) => {
                  const { text, emotion } = entry; // Extract values safely

                  return (
                    <div key={index} className="relative mb-2">
                      {regexNoVocals.test(text) || !text ? (
                        <div className="flex items-start">
                          {/* Add Section Buttons */}
                          <div className="flex items-center">
                            <div
                              className={`bg-yellow-100 p-1 rounded-md cursor-pointer ${
                                selectedParagraph?.index === index
                                  ? "border-[3px] border-black"
                                  : "border border-black"
                              }`}
                              onClick={() => handleAddSection(index)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "32px",
                                minHeight: "32px",
                                lineHeight: "1",
                              }}
                            >
                              <div className="text-md text-gray-800">🎵</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative mb-2">
                          <p
                            className={`cursor-pointer mt-2 rounded-md ${
                              emotionColors[emotion]?.bg ||
                              emotionColors.default.bg
                            }  ${
                              selectedParagraph?.index === index
                                ? `${
                                    emotionColors[emotion]?.border ||
                                    "border-black"
                                  } border-[4px]`
                                : ""
                            }`}
                            onClick={() => handleParagraphClick(index)}
                            style={{
                              borderRadius: "6px",
                              padding: "1px 4px",
                              boxDecorationBreak: "clone",
                              WebkitBoxDecorationBreak: "clone",
                              display: "inline",
                              fontSize: "1.125rem",
                            }}
                          >
                            {text}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Second Column (30%) */}
            {selectedParagraph && (
              <div
                className="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black absolute bg-gray-100 shadow-lg p-6 rounded-md"
                style={{
                  right: "-1px",
                  bottom: 0,
                  width: "37%",
                  maxHeight: "auto",
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EMOTION:
                  </label>
                  <EmotionDropdown
                    selectedEmotion={selectedParagraph.emotion}
                    setSelectedEmotion={(emotion) =>
                      setSelectedParagraph((prev) => ({ ...prev, emotion }))
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TIME:
                  </label>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={selectedParagraph.start}
                      onChange={(e) =>
                        setSelectedParagraph((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="border border-gray-300 p-2 rounded-md w-[45%]"
                    />
                    <span className="mx-2 text-gray-500">-</span>
                    <input
                      type="text"
                      value={selectedParagraph.end}
                      onChange={(e) =>
                        setSelectedParagraph((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="border border-gray-300 p-2 rounded-md w-[45%]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TEXT:
                  </label>
                  <textarea
                    value={selectedParagraph.text}
                    onChange={(e) =>
                      setSelectedParagraph((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 p-2 rounded-md"
                    rows={6}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NOTE: changing timestamps will create a new scene that may
                    not be beat aligned.
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
                    onClick={() => setSelectedParagraph(null)}
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
            )}
          </div>

          <div className="flex justify-end w-full mt-12 mb-12">
            <button
              className="px-6 py-1 h-[40px] mr-2 border border-gray-300 rounded-md text-gray-500"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <button
              className="px-6 py-1 h-[40px] bg-black text-white rounded-md hover:bg-gray-800"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmotionDropdown = ({ selectedEmotion, setSelectedEmotion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const emotionColors = {
    euphoric: "bg-yellow-200",
    serene: "bg-blue-200",
    melancholy: "bg-purple-200",
    tense: "bg-red-200",
  };

  const handleSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setIsOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Emotion Display */}
      <button
        className="w-full flex items-center justify-between border border-gray-300 p-2 rounded-md bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <span
            className={`w-4 h-4 rounded-full ${emotionColors[selectedEmotion]} mr-2`}
          ></span>
          {selectedEmotion}
        </span>
        <span>▼</span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute w-full border border-gray-300 bg-white shadow-lg rounded-md mt-1 z-10">
          {Object.keys(emotionColors).map((emotion) => (
            <div
              key={emotion}
              className="flex items-center border px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(emotion)}
            >
              <span
                className={`w-4 h-4 rounded-full ${emotionColors[emotion]} mr-2`}
              ></span>
              {emotion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptPage;

const ShimmerLyricsComponent = React.memo(
  ({ isLoading }: { isLoading: boolean }) => {
    return (
      <>
        {Array.from({ length: 30 }).map((_, index) => {
          const randomWidth = `${Math.floor(Math.random() * 51) + 50}%`;
          return (
            <div
              key={index}
              className="w-full flex items-center rounded-[12px] overflow-hidden mb-2 h-[1.25rem]"
              style={{ width: randomWidth }}
            >
              <ShimmerWrapper isLoading={isLoading}>
                <p className="m-2"></p>
              </ShimmerWrapper>
            </div>
          );
        })}
      </>
    );
  }
);
