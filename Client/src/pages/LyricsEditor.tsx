import React, { useState } from "react";
import lyricsData from "../assets/sample/lyrics.json";

interface LyricItem {
  start: number;
  end: number;
  text: string;
  emotion: string;
}

const emotions = {
  euphoric: "bg-yellow-300",
  serene: "bg-blue-300",
  melancholy: "bg-purple-300",
  tense: "bg-red-300",
  default: "bg-gray-200",
};

const stages = ["Upload", "Character", "Narrative", "Prompts", "Style", "Video"];

const LyricsEditor: React.FC = () => {
  const [lyrics, setLyrics] = useState<LyricItem[]>(
    lyricsData.map((item) => ({
      start: item[0],
      end: item[1],
      text: item[2],
      emotion: item[3],
    }))
  );
  const [editing, setEditing] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(2); // Set this to the current stage (e.g., 2 for "Narrative")

  const handleEdit = (index: number) => {
    setEditing(index);
  };

  const handleSave = (index: number, updatedLyric: LyricItem) => {
    const updatedLyrics = [...lyrics];
    updatedLyrics[index] = updatedLyric;
    setLyrics(updatedLyrics);
    setEditing(null);
  };

  const handleAddMusic = (start: number) => {
    const newItem: LyricItem = {
      start,
      end: lyrics.find((lyric) => lyric.start > start)?.start || start + 5,
      text: "New music section",
      emotion: "default",
    };
    setLyrics([...lyrics, newItem].sort((a, b) => a.start - b.start));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center w-full">
              <div
                className={`h-2 flex-1 rounded ${
                  index <= currentStage ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
              {index < stages.length - 1 && (
                <div
                  className={`w-4 h-4 ${
                    index < currentStage ? "bg-red-500" : "bg-gray-300"
                  } border-2 border-gray-300 rounded-full`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm mt-2">
          {stages.map((stage, index) => (
            <span
              key={index}
              className={`${
                index === currentStage ? "text-red-600 font-semibold" : "text-gray-500"
              }`}
            >
              {stage}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">Lyrics Editor</h1>

      {/* Lyrics List */}
      <div className="space-y-4">
        {lyrics.map((lyric, index) => (
          <div
            key={index}
            className={`p-4 rounded ${emotions[lyric.emotion]} flex items-center justify-between`}
          >
            <div>
              <p className="text-sm text-gray-600">{`Start: ${lyric.start}s, End: ${lyric.end}s`}</p>
              {editing === index ? (
                <div>
                  <textarea
                    value={lyric.text}
                    onChange={(e) =>
                      handleSave(index, { ...lyric, text: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={lyric.emotion}
                    onChange={(e) =>
                      handleSave(index, { ...lyric, emotion: e.target.value })
                    }
                    className="mt-2 p-2 border rounded"
                  >
                    {Object.keys(emotions).map((emotion) => (
                      <option key={emotion} value={emotion}>
                        {emotion}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setEditing(null)}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-lg">{lyric.text}</p>
              )}
            </div>
            <div>
              {lyric.text.includes("- no vocals") ? (
                <button
                  onClick={() => handleAddMusic(lyric.start)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  +
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(index)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricsEditor;