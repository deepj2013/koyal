import React, { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import muxData from "../assets/sample/lyrics.json";
import promptsData from "../assets/sample/proto_prompts.json";
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

import replaced18 from "../assets/images/newEditScene/landscape_realistic/replacement_images/image_18_new.png";
import replaced23 from "../assets/images/newEditScene/landscape_realistic/replacement_images/image_23_new.png";

import { CharacterStyles } from "../utils/constants";

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

const newDescription18 =
  "mehulagarwal scribbles on hotel notepad at night, sketching the skyline visible from the moonlit window, adding whimsical details like stars and planets";
const newDescription23 =
  "mehulagarwal dances with his shadow being lit up by dramatic floor lamp lighting.";

const GenerateVideoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [scenes, setScenes] = useState<any[]>([]);
  const [tableBodyHeight, setTableBodyHeight] = useState("auto");

  // Open Modal and Load Scene Data
  const handleEditClick = (scene, index) => {
    setEditingScene({ ...scene, index });
    setNewDescription("");
    setIsModalOpen(true);
  };

  // Save Changes and Update Table
  const handleSave = () => {
    const updatedScenes = [...scenes];

    let replacedImage =
      location.state.selectedStyle === CharacterStyles.ANIMATED
        ? animatedImage37
        : img37;

    let newDesc =
      "mehulagarwal sits on edge of unmade bed surrounded by evidence of night's adventures – pillows, snacks, improvised toys – gazing at morning sun reflecting off countless apartment windows across Seoul, a small smile acknowledging the joy found in solitude.";

      if(location.state.selectedStyle === CharacterStyles.REALISTIC) {
        if (editingScene.index === 18) {
          replacedImage = replaced18;
          newDesc = newDescription18;
        } else if (editingScene.index === 23) {
          replacedImage = replaced23;
          newDesc = newDescription23;
        }
      }

    updatedScenes[editingScene.index] = {
      ...editingScene,
      description: newDesc,
      image: replacedImage,
    };
    setScenes(updatedScenes);
    setIsModalOpen(false);
  };

  const emotions = {
    euphoric: "bg-yellow-300",
    serene: "bg-blue-300",
    melancholy: "bg-purple-300",
    tense: "bg-red-300",
    default: "bg-gray-200",
  };

  useEffect(() => {
    try {
      const mergedScenes = muxData
        .map((muxItem) => {
          const promptMatch = promptsData?.find(
            (prompt) =>
              prompt.start === muxItem.start && prompt.end === muxItem.end
          );

          if (promptMatch) {
            return {
              image:
                images[
                  location.state.selectedStyle === CharacterStyles.ANIMATED
                    ? "animated"
                    : "realistic"
                ][promptMatch.number - 1],
              description: promptMatch.narrative,
              dialogue: promptMatch.dialogue || muxItem[2],
              emotion: promptMatch.emotion || muxItem[3],
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
                className="grid grid-cols-[1fr_2fr_2fr_1fr_0.5fr] gap-4 p-3 bg-gray-100 border-b text-gray-600 text-sm font-semibold"
              >
                <span className="pl-3">Scene visual</span>
                <span>Scene description</span>
                <span>Dialogue</span>
                <span>Emotion</span>
                <span className="pr-3 text-center">Edit</span>
              </div>

              {/* Table Rows */}
              <div
                className="divide-y overflow-y-auto"
                style={{ height: tableBodyHeight }}
              >
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
            <div className="mt-6" id="create-btn">
              <button
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() =>
                  navigate("/finalvideo", {
                    state: {
                      selectedStyle: location.state.selectedStyle,
                    },
                  })
                }
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
