import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { Download, Play } from "lucide-react";
 import FinalVideo from "../assets/vedio/no_face_mehul_captioned.mp4";
import AnimatedVideo from "../assets/vedio/portrait_video.mp4";
import RealisticVideo from "../assets/vedio/realistic_video.mp4";
import muxData from "../assets/sample/lyrics.json";
import promptsData from "../assets/sample/proto_prompts.json";
import { useLocation } from "react-router-dom";
import { CharacterStyles } from "../utils/constants";
import { images } from "./edtiScence";
import { formatTime } from "../utils/helper";

const FinalVideoPage = () => {
  const location = useLocation();

  const [isGenerating, setIsGenerating] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const videoRef = useState(null);

  const FinalVideo =
    location.state?.selectedStyle === CharacterStyles.ANIMATED
      ? AnimatedVideo
      : RealisticVideo;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = FinalVideo; // Video file path
    link.download = "Final_Video.mp4"; // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Remove "5 minutes remaining" after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setShowPlayButton(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const mergedScenes = muxData
        .map((muxItem) => {
          const promptMatch = promptsData?.find(
            (prompt) =>
              prompt.start === muxItem.start && prompt.end === muxItem.end
          );

          if (promptMatch) {
            const { start, end } = promptMatch;
            return {
              image:
                images[
                  location.state?.selectedStyle === CharacterStyles.ANIMATED
                    ? "animated"
                    : "realistic"
                ][promptMatch.number - 1],
              description: promptMatch.narrative,
              dialogue: promptMatch.dialogue || muxItem[2],
              emotion: promptMatch.emotion || muxItem[3],
              start,
              end,
            };
          }
          return null;
        })
        .filter(Boolean);

        setPreviewImages(mergedScenes);
    } catch (error) {
      console.error("Error loading scene data", error);
    }
  }, []);


  // Handle Play Button Click
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Play the video
    }
    setShowPlayButton(false); // Hide Play Button
  };

  const handleSkipTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />
      <div className="flex justify-center">
        <div className="px-20 max-w-[1200px]">
          <div className="w-full mt-10">
            <div className="flex justify-start w-[60%] mb-6">
              <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                {isGenerating
                  ? "Generating your video... ⏳"
                  : "Your video is ready! 🥳"}
              </h1>
            </div>
          </div>

          {/* Progress Bar (Step 6) */}
          <div className="text-center">
            <ProgressBar currentStep={6} />
          </div>

          {/* Video Section */}
          <div className="flex flex-col items-center justify-center flex-grow mt-4">
            <div className="relative z-50 w-[80%] h-[25rem] bg-black rounded-2xl overflow-hidden">
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
                  <p className="text-white mt-4 text-lg">5 minutes remaining... </p>
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
            <div className="relative z-50 w-[80%]">
              <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide">
                {previewImages.map((preview, index) => (
                  <button
                    key={index}
                    className="relative w-32 h-20 min-w-[8rem] rounded-lg overflow-hidden border border-gray-300 hover:border-white transition-all"
                    onClick={() => handleSkipTo(preview.start)}
                  >
                    <img
                      src={preview.image}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-lg w-full">
                      Shot {index + 1}: {formatTime(preview.start)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Title */}
            {/* <p className="text-gray-600 text-sm mt-3">Add video title</p> */}

            {/* Download Button (Enabled After 10 sec) */}
            <div className="relative mt-10">
              <button
                className={`flex h-[40px] items-center px-6 py-3 ${
                  isGenerating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } text-white rounded-lg shadow-md`}
                disabled={isGenerating}
                onClick={handleDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalVideoPage;
