import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { Download, Play } from "lucide-react";
// import FinalVideo from "../assets/vedio/no_face_mehul_captioned.mp4";
import FinalVideo from "../assets/vedio/cartoon_video_soumya.mp4"

const FinalVideoPage = () => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useState(null);

  // Remove "18 minutes remaining" after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setShowPlayButton(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Handle Play Button Click
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Play the video
    }
    setShowPlayButton(false); // Hide Play Button
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 text-center my-6">
        Generating your video... ⏳
      </h1>

      {/* Progress Bar (Step 6) */}
      <div className="px-4 text-center">
        <ProgressBar currentStep={6} />
      </div>

      {/* Video Section */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="relative z-50 w-[25rem] h-[25rem] bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            src={FinalVideo}
            controls={!isGenerating} // Enable controls after 10 sec
            autoPlay={false} // AutoPlay disabled initially
          />

          {/* Overlay Loader (Removed After 10 Sec) */}
          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4 text-lg">preparing...  </p>
            </div>
          )}

          {/* Play Button (Appears After 10 Sec) */}
          {showPlayButton && (
            <button
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl rounded-full w-16 h-16"
              onClick={handlePlay}
            >
              <Play className="w-10 h-10" />
            </button>
          )}
        </div>

        {/* Video Title */}
        {/* <p className="text-gray-600 text-sm mt-3">Add video title</p> */}

        {/* Download Button (Enabled After 10 sec) */}
        <div className="relative mt-6">
          <button
            className={`flex items-center px-6 py-3 ${
              isGenerating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-lg shadow-md`}
            disabled={isGenerating}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalVideoPage;