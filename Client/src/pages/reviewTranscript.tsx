import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import sampleDoc from "../assets/sample/lyrics.json";
import { useNavigate } from "react-router-dom";

const TranscriptPage = ({ jsonSource }) => {
  const navigate = useNavigate();
  const [transcriptData, setTranscriptData] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState("");
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
    const entry = transcriptData[index];
    
    if (!entry) return; // Prevent crashes
  
    setSelectedParagraph({
      start: entry[0], // Extract start time
      end: entry[1], // Extract end time
      text: entry[2], // Extract text
      emotion: entry[3], // Extract emotion
      index: index, // Store index for update
    });
  
    setSelectedEmotion(entry[3]); // Ensure emotion updates
  };
  const handleAddSection = (index) => {
    const currentData = [...transcriptData];
  
    const newSection = [
      currentData[index]?.[1] || "0", // Use previous end time as start
      "", // Empty end time
      "New section", // Default text
      currentData[index]?.[3] || "default" // Inherit emotion
    ];
  
    currentData.splice(index + 1, 0, newSection);
    setTranscriptData(currentData);
  
    // Automatically open the newly added section for editing
    setSelectedParagraph({ 
      start: newSection[0], 
      end: newSection[1], 
      text: newSection[2], 
      emotion: newSection[3], 
      index: index + 1 
    });
  
    setSelectedEmotion(newSection[3]);
  };


  const handleSave = () => {
    if (selectedParagraph && selectedParagraph.index !== undefined) {
      const updatedData = [...transcriptData];
  
      // Update only the correct index, maintaining JSON format
      updatedData[selectedParagraph.index] = [
        selectedParagraph.start,  // Keep as string to prevent NaN errors
        selectedParagraph.end,
        selectedParagraph.text || "New section", // Prevent empty values
        selectedParagraph.emotion,
      ];
  
      setTranscriptData(updatedData); // Update state
      setSelectedParagraph(null); // Close modal
    }
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
      <div className="flex justify-center">
      <div className="px-40 max-w-[1200px]">
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

      <div className="flex w-full h-[40vh] relative">
        {/* First Column (70%) */}
        <div className="w-full overflow-y-scroll">
          {transcriptData.map((entry, index) => {
            if (!Array.isArray(entry) || entry.length < 4) return null; // Prevent errors

            const [start, end, text, emotion] = entry; // Extract values safely

            return (
              <div key={index} className="relative mb-4">
                {regexNoVocals.test(text) ? (
                  <div className="flex items-start">
                    {/* Add Section Buttons */}
                    <div className="flex flex-col">
                      {/* Hide + button when a new section is added */}
                      {!text && (
                        <button
                          className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
                          onClick={() => handleAddSection(index)}
                        >
                          +
                        </button>
                      )}
                      <div className="bg-yellow-100 p-2 rounded mt-1">
                        <div className="text-2xl text-gray-800">🎵</div>
                      </div>
                      <button
                        className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 mt-1"
                        onClick={() => handleAddSection(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative mb-4">
                    <p className="cursor-pointer mt-2" onClick={() => handleParagraphClick(index)}>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {/* Second Column (30%) */}
      {selectedParagraph && (
  <div className="absolute bg-gray-100 shadow-lg border border-black p-6 rounded-md"
    style={{ right: "0", bottom:0, width: "43%", maxHeight: "auto" }}
  >
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">EMOTION:</label>
      <EmotionDropdown selectedEmotion={selectedParagraph.emotion} setSelectedEmotion={(emotion) =>
        setSelectedParagraph((prev) => ({ ...prev, emotion }))
      }/>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">TIME:</label>
      <div className="flex justify-between items-center">
        <input type="text"
          value={selectedParagraph.start}
          onChange={(e) => setSelectedParagraph((prev) => ({ ...prev, start: e.target.value }))}
          className="border border-gray-300 p-2 rounded-md w-[45%]"
        />
        <span className="mx-2 text-gray-500">-</span>
        <input type="text"
          value={selectedParagraph.end}
          onChange={(e) => setSelectedParagraph((prev) => ({ ...prev, end: e.target.value }))}
          className="border border-gray-300 p-2 rounded-md w-[45%]"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">TEXT:</label>
      <textarea value={selectedParagraph.text}
        onChange={(e) => setSelectedParagraph((prev) => ({ ...prev, text: e.target.value }))}
        className="w-full border border-gray-300 p-2 rounded-md"
        rows={6}
      ></textarea>
    </div>

    <div className="flex justify-end">
      <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
        onClick={() => setSelectedParagraph(null)}>Cancel</button>
      <button className="px-4 py-2 bg-black text-white rounded-md"
        onClick={handleSave}>Save</button>
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
          onClick={() => navigate("/choosecharacter")}
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
          <span className={`w-4 h-4 rounded-full ${emotionColors[selectedEmotion]} mr-2`}></span>
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
              <span className={`w-4 h-4 rounded-full ${emotionColors[emotion]} mr-2`}></span>
              {emotion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptPage;