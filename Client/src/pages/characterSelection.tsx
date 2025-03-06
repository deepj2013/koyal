import { useState } from "react";
import { FaUpload, FaFileAlt, FaUser, FaPalette, FaFilm, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import Realstic from "../assets/images/mehul_real.png";
import Cartoon from "../assets/images/mehul_anime.png";
import Sketch from "../assets/images/mehul_sketch.png";
import { FaArrowRight } from "react-icons/fa";



const CharacterSelectionPage = ({ setStage }) => {
  const navigate = useNavigate()
  const [selectedStyle, setSelectedStyle] = useState("Cartoon");
  const [selected, setSelected] = useState<string | null>(null);

  const styles = [
    { name: "Realistic", image: Realstic },
    { name: "Cartoon", image: Cartoon },
    { name: "Sketch", image: Sketch }
  ];

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
          <h1 className="text-lg font-bold text-gray-900">Choose your main character’s look & art style for the video</h1>
          <p className="text-gray-500 text-sm mt-1 w-full leading-[24px]">
            You can use the prompt bar to describe the look of the main character & then choose an art style for the final video
          </p>

          {/* Input & Change Look Button */}
          <div className="flex items-center mt-4 w-full bg-[#F3F3F3] rounded-xl p-2">
            
            <textarea className="w-full px-4 py-3 bg-transparent text-gray-600 placeholder-gray-500 outline-none" > mehulagarwal, White linen shirt, khaki shorts </textarea>
            <button className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center whitespace-nowrap transition-all">
              Change Look <span className="ml-2"><FaArrowRight/></span>
            </button>
          </div>
          </div>

          {/* Character Styles */}
          <div className="flex flex-col mt-6 space-y-6">
  <div className="flex space-x-6 px-8">
    {styles.map((style) => (
      <div
        key={style.name}
        className={`relative rounded-lg transition-all cursor-pointer overflow-hidden`}
        onClick={() => setSelectedStyle(style.name)}
      >
        <img src={style.image} alt={style.name} className="w-80 h-68 rounded-lg transition-transform duration-300" />
        {/* Overlay for Selected Item */}
        <div className={`absolute bottom-0 w-full py-2 text-center font-semibold
          ${selectedStyle === style.name ? "bg-black text-white" : "bg-white text-black bg-opacity-10 backdrop-blur-md"}`}>
          {style.name}
        </div>
      </div>
    ))}
  </div>
  
  {/* Show Lipsync Section below the images if style.name is Realistic */}
  {selectedStyle === "Realistic" && (
    <div className="mt-4 p-4 border rounded-lg">
      <p className="font-semibold">Do you want to add lipsync to your video?</p>
      <div className="flex space-x-4">
  <label
    className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
    ${selected === "yes" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"}`}
    onClick={() => setSelected("yes")}
  >
    <input
      type="radio"
      name="likeness"
      value="yes"
      className="hidden"
    />
    {/* Custom Radio Button Circle */}
    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-2 
      ${selected === "yes" ? "border-black bg-white" : "border-gray-500 bg-white"}`}>
      {selected === "yes" && <span className="w-2.5 h-2.5 bg-black rounded-full"></span>}
    </span>
    Yes
  </label>

  <label
    className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
    ${selected === "no" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"}`}
    onClick={() => setSelected("no")}
  >
    <input
      type="radio"
      name="likeness"
      value="no"
      className="hidden"
    />
    {/* Custom Radio Button Circle */}
    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-2 
      ${selected === "no" ? "border-black bg-white" : "border-gray-500 bg-white"}`}>
      {selected === "no" && <span className="w-2.5 h-2.5 bg-black rounded-full"></span>}
    </span>
    No
  </label>
</div>

    </div>
  )}
</div>

          {/* Navigation Buttons */}
          <div className="flex justify-end w-full mt-6">
            <button className="px-6 py-2 mr-2 border border-gray-400 text-gray-700 rounded-md bg-white hover:bg-gray-200">Previous</button>
            <button className="px-6 py-2 bg-black text-white rounded-md shadow-md hover:bg-gray-900"
             onClick={() => navigate("/editscene")}>Next</button>
          </div>
        </div>    
        </div>
    </div>
    </div>
    </div>
  );
};

export default CharacterSelectionPage;
