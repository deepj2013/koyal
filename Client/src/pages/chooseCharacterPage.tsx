import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChooseCharacterPage = () => {
  const navigate = useNavigate()
  const [themeText, setThemeText] = useState(
    "In a neon-drenched Tokyo arcade at midnight, the main character's journey becomes a metaphor for navigating fame and solitude amidst the electric pulse of urban life. Through the kaleidoscope of flashing lights and pulsing beats, he moves between digital realms and reality, each game screen reflecting a different facet of his fame."
  );
  const [newThemeInput, setNewThemeInput] = useState(""); // Stores user input in modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [stage, setStage] = useState("default");
  const videoRef = useRef(null);
  const [identifier, setIdentifier] = useState("");
  const [gender, setGender] = useState("");
  const [currentAction, setCurrentAction] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [completedActions, setCompletedActions] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const actions = [
    "TURN YOUR HEAD RIGHT",
    "SQUINT YOUR EYES",
    "TILT YOUR HEAD DOWN",
    "OPEN YOUR MOUTH",
    "TILT YOUR HEAD UP",
    "STANDUP (ENSURE YOUR HEAD IS IN THE FRAME)"
  ];

  useEffect(() => {
    if (stage !== "default" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing webcam:", error));
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "actionRecord") {
      setTimeLeft(7); // Reset timer
      setCurrentAction(0); // Reset actions to start from the first action
      setCompletedActions([]); // Clear completed actions
      setIsComplete(false); // Reset completion state
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "actionRecord") return; // Prevents countdown from running on other stages
  
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentAction < actions.length - 1 && !isComplete) {
      setCompletedActions((prev) => [...prev, currentAction]);
      setCurrentAction(currentAction + 1);
      setTimeLeft(7);
    } else if (currentAction === actions.length - 1 && !isComplete) {
      setCompletedActions((prev) => [...prev, currentAction]);
      setIsComplete(true); // User must manually click "Continue to Narrative"
    }
  }, [timeLeft, currentAction, isComplete, stage]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleYesClick = () => setStage("verification");

  const handleSaveTheme = () => {
    setThemeText(newThemeInput || "Aboard a luxury yacht on the endless ocean, the main character's journey becomes a metaphor for navigating fame and solitude. Through triumph and contemplation, he moves between worlds.");
    setIsModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <h1 className="text-2xl font-semibold text-gray-900  text-center">Generate your video</h1>
      <div className="px-2">
        <ProgressBar currentStep={3} />
        {stage === "default" && (
          <div className="w-full max-w-3xl mx-auto bg-transparent border-none shadow-none">
            <p className="text-gray-700 mb-3">
              Describe the theme for the video that Koyal will create <span className="text-red-500">*</span>
            </p>
            <p className="text-gray-400 text-[16px] font-inter font-normal leading-[24px] tracking-normal">
              Click to edit text or press button to completely change the theme
            </p>
            <textarea
        className="w-full h-32 p-3 border rounded-md bg-transparent text-gray-700"
        rows="4"
        value={themeText} // Bound to state
        readOnly
      />
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Describe new theme
            </button>
            <p className="text-gray-700 mt-6">Do you want your likeness in the video?<span className="text-red-500">*</span></p>
            <p className="text-gray-400 text-[16px] font-inter font-normal leading-[24px] tracking-normal"> You can train your face using our secure personalization protocol or describe a custom main character for the final video</p>
            <div className="flex flex-col space-y-4">
      {/* Yes/No Selection */}
      <div className="flex space-x-4">
        {/* Yes Option */}
        <label
          className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
            ${selected === "yes" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"}`}
        >
          <input
            type="radio"
            name="likeness"
            value="yes"
            className="hidden"
            onChange={() => setSelected("yes")} // Just update state
          />
          <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-2 
            ${selected === "yes" ? "border-white bg-black" : "border-gray-500 bg-white"}`}>
            {selected === "yes" && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
          </span>
          Yes
        </label>

        {/* No Option */}
        <label
          className={`inline-flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all 
            ${selected === "no" ? "bg-white text-gray-700 border-gray-400" : "bg-white text-gray-700 border-gray-300"}`}
        >
          <input
            type="radio"
            name="likeness"
            value="no"
            className="hidden"
            onChange={() => setSelected("no")}
          />
          <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-2 
            ${selected === "no" ? "border-black bg-white" : "border-gray-500 bg-white"}`}>
            {selected === "no" && <span className="w-2.5 h-2.5 bg-black rounded-full"></span>}
          </span>
          No
        </label>
      </div>

      {/* Continue Button - Only Show When Yes/No is Selected */}
      {selected && (
        <button
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
          onClick={handleYesClick}
        >
          Continue
        </button>
      )}
    </div>

            <p className="text-gray-800 mt-1 inline-flex items-center">
              If you’ve already trained your own character,
              <a className="text-green-600 font-bold ml-1" href="#">Use an existing character</a>
            </p>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative z-50 border border-white/20">
              <button onClick={handleCloseModal} className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl">✖</button>
              <h2 className="text-xl font-semibold text-white text-center mb-4">Describe how you want the new theme to be</h2>
              <textarea className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-gray-200" rows="4" placeholder="Make the video more vibrant and colorful."></textarea>
              <button
              onClick={handleSaveTheme}
              className="w-full bg-white/20 text-white mt-4 py-3 rounded-lg hover:bg-white/30 transition duration-200 border border-white/30"
            >
              Create New Theme
            </button>
            </div>
          </div>
        )}

        <div className="flex w-full h-screen px-10 py-6 flex-start rounded-lg">
          <div className="w-1/2  overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto rounded-xl"
              autoPlay
              playsInline
            ></video>
          </div>


          {/* Right Side: Dynamic Content */}
          <div className="w-1/2 p-6 flex flex-col mt-5 text-center align-center flex-start">
            {stage === "verification" && (
              <div className="flex flex-col items-center text-center">
                {/* Centering h1 and h2 */}
                <h1 className="text-3xl font-bold text-gray-900">C.H.A.R.C.H.A.</h1>
                <h2 className="text-lg w-1/2 text-gray-700 mb-4">Computer Human Assessment for Recreating Characters with Human Actions</h2>

                {/* Right-aligning h3 and ordered list */}
                <div className="w-full flex flex-col items-start text-xl text-left">
                  <h3 className="text-xl font-bold text-gray-900 ml-20">This takes only about a minute!</h3>
                  <ol className="list-decimal list-inside mb-4 text-gray-700 ml-20  ">
                    <li>Find a well-lit space with room to move & stand up</li>
                    <li>Remove face coverings (glasses optional)</li>
                    <li>Follow the on-screen actions when prompted</li>
                  </ol>
                </div>

                {/* Centering p and button */}
                <p className="text-gray-600 mb-6">Photos will only be collected for training your character.</p>
                <button
                  className="bg-white text-black border border-black py-2 px-6 rounded-lg"
                  onClick={() => setStage("identification")}
                >
                  Begin Face Verification
                </button>
              </div>
            )}
            {stage === "identification" && (
              <>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">Please enter your information</h2>
                <div className="mx-[60px] items-start text-xl text-left ">
                  <p className="text-gray-700 mb-4">
                    Use a unique identifier that isn't part of regular English vocabulary.
                  </p>
                  <p className="text-gray-700 mb-4">
                    For example, your full name without spaces or a nickname. Do not use any numbers or special characters.
                  </p>
                </div>

                {/* Input for Unique Identifier */}
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="border border-gray-900 rounded-lg p-3 w-full mb-4"
                  placeholder="Enter unique identifier"
                />

                {/* Dropdown for Gender Selection */}
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border border-gray-900 rounded-lg p-3 w-full mb-4 text-gray-600"
                >
                  <option value="">Select Gender Identity</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>

                {/* Continue Button */}
                <button
                  className="border border-gray-500 rounded-lg p-3 w-full text-gray-900 font-bold hover:bg-gray-900 hover:text-white"
                  onClick={() => setStage("calibration")}
                >
                  Continue
                </button>
              </>
            )}
            {stage === "calibration" && (
              <div className="flex flex-col items-center text-center">
                {/* Title */}
                <h2 className="text-xl font-bold text-black mb-4">CALIBRATION</h2>

                {/* Instructions (Centered, Proper Spacing) */}
                <div className=" p-4 w-[80%] md:w-[50%] mb-4">
                  <p className="text-gray-700">Please keep your head in a neutral position and look straight at the camera.</p>
                  <p className="text-gray-700">Try to maintain similar positioning for the test.</p>
                  <p className="text-gray-700">Click start to begin.</p>
                </div>

                {/* Progress Indicator */}
                <p className="text-black font-bold">Calibration progress: <span className="font-bold">30 frames remaining</span></p>

                {/* Start Button (Bordered with Red & Hover Effect) */}
                <button
                  className="border border-black-900 rounded-lg px-6 py-3 mt-6 text-black font-bold hover:bg-black-900 hover:text-white-200 transition-shadow shadow-sm hover:shadow-md"
                  onClick={() => setStage("actionRecord")}
                >
                  Start Calibration
                </button>
              </div>
            )}
            {stage === "actionRecord" && (
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold text-gray-900">C.H.A.R.C.H.A.</h1>
                <h2 className="text-lg text-gray-700 mb-4">Perform the following action for 7 seconds.</h2>
                <p className="text-xl font-bold text-black">Time left: {timeLeft} seconds</p>

                {/* Action List */}
                <ul className="list-none space-y-4 mt-4 text-left relative">
  {actions
    .map((action, index) => ({ action, index })) // Convert to object for better readability
    .filter(({ index }) => completedActions.includes(index) || index === currentAction) // Show only completed or current action
    .map(({ action, index }) => (
      <li
        key={index}
        className={`relative flex items-center justify-center p-3 rounded-lg w-96 border-2
        ${index === currentAction ? "bg-black text-white" : "bg-white text-black"}
        ${completedActions.includes(index) ? "border-green-500 text-black" : "border-gray-400"}`}
      >
        {/* Number Circle Positioned Outside on the Left */}
        <span className={`absolute -left-10 w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold 
        ${completedActions.includes(index) ? "border-green-500 text-black" : "border-gray-500"}`}>
          {index + 1}
        </span>

        {/* Action Text */}
        <span className="flex-1 text-center font-semibold pl-4">{action}</span>

        {/* Check Icon Positioned Outside on the Right */}
        {completedActions.includes(index) && (
          <span className="absolute -right-8 text-green-500 text-lg">
            <FaCheck />
          </span>
        )}
      </li>
    ))}
</ul>

                {/* Start Button (Only Visible at the Beginning) */}
                {currentAction === 0 && timeLeft === 7 && (
                  <button
                    className="bg-black text-white px-6 py-3 rounded-lg mt-6"
                    onClick={() => setTimeLeft(6)} // Start countdown when clicked
                  >
                    Start Actions
                  </button>
                )}

                {/* Final Button Appears After Completion, Waits for User Click */}
                {isComplete && (
                  <button
                    className="bg-black text-white px-6 py-3 rounded-lg mt-6 border border-red-500 shadow-lg"
                    onClick={() => navigate("/characterSelection")}
                  >
                    Continue to Narrative
                  </button>
                )}
              </div>
            )}
          </div>
        </div>



      </div>
    </div>
  );
};

export default ChooseCharacterPage;
