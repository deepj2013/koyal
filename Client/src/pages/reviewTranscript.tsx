import React, { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import sampleDoc from "../assets/sample/lyrics.json";

const TranscriptPage = ({ jsonSource }) => {
  const [transcriptData, setTranscriptData] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const regexNoVocals = /no vocals/i;
  const emotionColors = {
    euphoric: "bg-yellow-200",
    serene: "bg-blue-200",
    melancholy: "bg-purple-200",
    tense: "bg-red-200",
    default: "bg-gray-200",
  };

  useEffect(() => {
    if (jsonSource) {
      fetch(jsonSource)
        .then((response) => response.json())
        .then((data) => setTranscriptData(data))
        .catch((error) => console.error("Error loading transcript data:", error));
    } else {
      setTranscriptData(sampleDoc);
    }
  }, [jsonSource]);

  const handleParagraphClick = (index) => {
    setSelectedParagraph({
      ...transcriptData[index],
      index,
    });
  };

  const handleAddSection = (index) => {
    const currentData = [...transcriptData];
    const newSection = {
      start: currentData[index].end,
      end: "",
      text: "New section",
      emotion: "default",
    };
    currentData.splice(index + 1, 0, newSection);
    setTranscriptData(currentData);
  };

  const handleSave = () => {
    const updatedData = [...transcriptData];
    updatedData[selectedParagraph.index] = [
      selectedParagraph[0],
      selectedParagraph[1],
      selectedParagraph.text,
      selectedParagraph.emotion,
    ];
    setTranscriptData(updatedData);
    setSelectedParagraph(null);
  };

  const handleEmotionChange = (e) => {
    setSelectedParagraph((prev) => ({
      ...prev,
      emotion: e.target.value,
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex flex-col items-center w-full px-8 mt-10">
        <div className="flex flex-col text-center w-[60%] mb-6">
          <h1 className="text-[32px] font-medium leading-[30px]  tracking-[0%] text-gray-900">
            Transcript
          </h1>
        </div>
      </div>
      <ProgressBar currentStep={currentStep} />

      <div className="w-full max-w-3xl mt-12 mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-900">
              Audio transcript
            </h2>
            <div className="flex items-center space-x-2">
              {Object.entries(emotionColors).map(([key, color]) => (
                key !== "default" && (
                  <div className="flex items-center space-x-2" key={key}>
                    <span className={`w-4 h-4 rounded-full ${color} border border-gray-300`}></span>
                    <span className="text-[14px] font-normal leading-[20px] text-gray-700 capitalize">
                      {key}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
          <p className="text-[16px] font-normal leading-[24px] tracking-[0%] text-gray-500 mb-4">
            Click portions to edit dialogue or emotions
          </p>
        </div>
      </div>

      <div className="flex w-full h-screen">
        {/* First Column (70%) */}
        <div className="w-[70%] px-10 mx-[10rem] overflow-y-scroll">
          {transcriptData.map(([start, end, text, emotion], index) => (
            <div key={index} className="relative mb-4">
              {regexNoVocals.test(text) ? (
                <div className="flex flex-col items-center">
                  {/* Music Sign for No Vocals */}
                  <div className="text-6xl text-gray-500">🎵</div>
                  {/* Add Section Buttons */}
                  <div className="flex justify-between mt-2 w-full">
                    <button
                      className="text-blue-500 text-sm hover:underline"
                      onClick={() => handleAddSection(index, "up")}
                    >
                      + 
                    </button>
                    <button
                      className="text-blue-500 text-sm hover:underline"
                      onClick={() => handleAddSection(index, "down")}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => handleParagraphClick(index)}
                >
                  <span
                    className={`${emotionColors[emotion] || emotionColors.default}`}
                    style={{
                      display: "inline",
                      padding: "1px 2px",
                      borderRadius: "5px",
                      border: "1px solid black",
                    }}
                  >
                    {text}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Second Column (30%) */}
        {selectedParagraph && (
          <div
            className="absolute bg-gray-100 shadow-lg border border-black p-6 rounded-md"
            style={{

              left: "72%", // Start next to the first column
              width: "28%", // Adjust width
              maxHeight: "auto", // Height adjusts to content
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EMOTION:
              </label>
              <select
                value={selectedParagraph.emotion}
                onChange={handleEmotionChange}
                className="w-full border border-gray-300 p-2 rounded-md"
              >
                {Object.keys(emotionColors).map((emotionKey) => (
                  <option key={emotionKey} value={emotionKey}>
                    {emotionKey}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TIME:
              </label>
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={selectedParagraph[0]}
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
                  value={selectedParagraph[1]}
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

      <div className="flex justify-between w-full max-w-3xl mt-12 mx-auto">
        <button
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-500"
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <button
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TranscriptPage;