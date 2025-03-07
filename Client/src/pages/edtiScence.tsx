import React, { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import muxData from "../assets/sample/mehul_mux.json";
import promptsData from "../assets/sample/mehul_prompts.json";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/images/editscene/01.png";
import img2 from "../assets/images/editscene/02.png";
import img3 from "../assets/images/editscene/03.png";
import img4 from "../assets/images/editscene/04.png";
import img5 from "../assets/images/editscene/05.png";
import img6 from "../assets/images/editscene/06.png";
import img7 from "../assets/images/editscene/07.png";
import img8 from "../assets/images/editscene/08.png";
import img9 from "../assets/images/editscene/09.png";
import img10 from "../assets/images/editscene/10.png";
import img11 from "../assets/images/editscene/11.png";
import img12 from "../assets/images/editscene/12.png";
import img13 from "../assets/images/editscene/13.png";
import img14 from "../assets/images/editscene/14.png";
import img15 from "../assets/images/editscene/15.png";
import img16 from "../assets/images/editscene/16.png";
import img17 from "../assets/images/editscene/17.png";
import img18 from "../assets/images/editscene/18.png";
import img19 from "../assets/images/editscene/19.png";
import img20 from "../assets/images/editscene/20.png";
import img21 from "../assets/images/editscene/21.png";
import img22 from "../assets/images/editscene/22.png";
import img23 from "../assets/images/editscene/23.png";
import img24 from "../assets/images/editscene/24.png";
import img25 from "../assets/images/editscene/25.png";
import img26 from "../assets/images/editscene/26.png";
import img27 from "../assets/images/editscene/27.png";
import img28 from "../assets/images/editscene/28.png";
import img29 from "../assets/images/editscene/29.png";
import img30 from "../assets/images/editscene/30.png";
import img31 from "../assets/images/editscene/31.png";
import img32 from "../assets/images/editscene/32.png";
import img33 from "../assets/images/editscene/33.png";
import img34 from "../assets/images/editscene/34.png";
import img35 from "../assets/images/editscene/35.png";
import img36 from "../assets/images/editscene/36.png";
import img37 from "../assets/images/editscene/37.png";
import img38 from "../assets/images/editscene/38.png";
import img39 from "../assets/images/editscene/39.png";
import img40 from "../assets/images/editscene/40.png";
import img41 from "../assets/images/editscene/41.png";
import img42 from "../assets/images/editscene/42.png";
import img43 from "../assets/images/editscene/43.png";
import img49 from "../assets/images/editscene/49.png";

const images = {
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
  38: img38,
  39: img39,
  40: img40,
  41: img41,
  42: img42,
  43: img43,
};

const GenerateVideoPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  // Open Modal and Load Scene Data
  const handleEditClick = (scene, index) => {
    setEditingScene({ ...scene, index });
    setNewDescription("");
    setIsModalOpen(true);
  };

  // Save Changes and Update Table
  const handleSave = () => {
    const updatedScenes = [...scenes];
    updatedScenes[editingScene.index] = {
      ...editingScene,
      description:
        "mehulagarwal sips champagne from a crystal flute on the deck of a yacht",
      image: img49, // Replace with img49 on save
    };
    setScenes(updatedScenes);
    setIsModalOpen(false);
  };
  const [scenes, setScenes] = useState<any[]>([]);
  const emotions = {
    euphoric: "bg-yellow-300",
    serene: "bg-blue-300",
    melancholy: "bg-purple-300",
    tense: "bg-red-300",
    default: "bg-gray-200",
  };

  useEffect(() => {
    try {
      const structuredPrompts = promptsData["structured_prompts"];

      const mergedScenes = muxData
        .map((muxItem: any) => {
          const promptMatch = structuredPrompts.find(
            (prompt: any) =>
              prompt[0] === muxItem[0] && prompt[1] === muxItem[1]
          );

          if (promptMatch) {
            return {
              image: images[promptMatch[2].number],
              description: promptMatch[2].narrative,
              dialogue: muxItem[2],
              emotion: muxItem[3],
            };
          }
          return null;
        })
        .filter(Boolean);

      setScenes(mergedScenes);
    } catch (error) {
      console.error("Error loading scene data", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center">
        <div className="px-20 max-w-[1200px]">
          
          <div className="w-full mt-10">
                <div className="flex justify-start w-[60%] mb-6">
                    <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                        Generate your video
                    </h1>
                </div>
            </div>
          <div className="text-center">
            <ProgressBar currentStep={5} />
          </div>
          <div className="max-w-5xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
            {/* Title */}
            <h2 className="text-md font-semibold mb-4 text-gray-800">
              You can make edits to generated scenes individually
            </h2>

            {/* Table */}
            <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_2fr_2fr_1fr_0.5fr] gap-4 p-3 bg-gray-100 border-b text-gray-600 text-sm font-semibold">
                <span className="pl-3">Scene visual</span>
                <span>Scene description</span>
                <span>Dialogue</span>
                <span>Emotion</span>
                <span className="pr-3 text-center">Edit</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y">
                {scenes.map((scene, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_2fr_2fr_1fr_0.5fr] gap-4 items-center p-4"
                  >
                    {/* Image */}
                    <img
                      src={scene.image}
                      alt="Scene"
                      className="w-1000 h-50  rounded-lg object-cover border border-gray-300"
                    />

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
            <div className="mt-6">
              <button
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => navigate("/finalvideo")}
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
