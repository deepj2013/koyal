import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { Download, Play } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  useLazyGetFinalVideoQuery,
  useLazyGetProcessedVideoQuery,
  useProcessFinalVideoMutation,
  useProcessVideoMutation,
} from "../redux/services/finalVideoService/finalVideoApi";
import { AppState } from "../redux/features/appSlice";
import { useSelector } from "react-redux";
import { formatTime } from "../utils/helper";
import { FaInfoCircle, FaUndo } from "react-icons/fa";

const FinalVideoPage = () => {
  const location = useLocation();

  const { selectedStyle, orientationStyle } = location?.state || {};

  const {
    protoPromptsUrl,
    characterName,
    scenesJson,
    imageFolderUrl,
    replacementWord,
  } = useSelector(AppState);

  const [processVideo, { data: processVideoData }] = useProcessVideoMutation();
  const [getProcessedVideo, { data: getProcessedVideoData }] =
    useLazyGetProcessedVideoQuery();
  const [processFinalVideo, { data: processFinalVideoData }] =
    useProcessFinalVideoMutation();
  const [getFinalVideo, { data: getFinalVideoData }] =
    useLazyGetFinalVideoQuery();

  const [isGenerating, setIsGenerating] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [finalVideo, setFinalVideo] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const videoRef = useState<any>(null);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = finalVideo; // Video file path
    link.download = "Final_Video.mp4"; // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Play Button Click
  const handlePlay = () => {
    if (videoRef?.current) {
      videoRef?.current.play(); // Play the video
    }
    setShowPlayButton(false); // Hide Play Button
  };

  const handleSkipTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const regenerateVideo = (index: number) => {};

  // Remove "5 minutes remaining" after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setShowPlayButton(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPreviewImages(scenesJson);
  }, [scenesJson]);

  useEffect(() => {
    processVideo({
      proto_prompts: protoPromptsUrl,
      character_name: characterName,
      style: selectedStyle?.name?.toLowerCase(),
      orientation: orientationStyle?.toLowerCase(),
      image_folder_path: imageFolderUrl,
      replacement_word: replacementWord,
    });
  }, []);

  useEffect(() => {
    if (processVideoData?.call_id) {
      getProcessedVideo(processVideoData?.call_id);
    }
  }, [processVideoData]);

  useEffect(() => {
    if (getProcessedVideoData?.video_folder_path) {
      processFinalVideo({
        proto_prompts: protoPromptsUrl,
        video_folder_path: processVideoData?.video_folder_path,
      });
    }
  }, [getProcessedVideoData]);

  useEffect(() => {
    if (processFinalVideoData?.call_id) {
      getFinalVideo(processFinalVideoData?.call_id);
    }
  }, [processFinalVideoData]);

  useEffect(() => {
    if (getFinalVideoData?.final_video_path) {
      setFinalVideo(getFinalVideoData?.final_video_path);
    }
  }, [getFinalVideoData]);

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
                src={finalVideo}
                controls={!isGenerating} // Enable controls after 10 sec
                autoPlay={false} // AutoPlay disabled initially
              />

              {/* Overlay Loader (Removed After 10 Sec) */}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                  <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-4 text-lg">
                    5 minutes remaining...{" "}
                  </p>
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
                  <div>
                    <div className="flex w-full relative">
                      <div className="absolute z-50 top-1 left-1 bg-gray-800 p-0.5 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-gray-700 hover:scale-110 cursor-pointer">
                        <span
                          className="flex justify-center items-center w-[14px] h-[14px] text-gray-300 hover:text-white transition-colors duration-200"
                          title={preview?.description}
                        >
                          i
                        </span>
                      </div>

                      <div
                        onClick={() => regenerateVideo(index)}
                        className="absolute z-50 top-1 right-1 bg-gray-800 p-0.5 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-gray-700 hover:scale-110 cursor-pointer"
                      >
                        <span className="flex justify-center items-center w-[14px] h-[14px] text-gray-300 hover:text-white transition-colors duration-200">
                          ↺
                        </span>
                      </div>

                      <button
                        key={index}
                        className="relative w-36 min-w-[8rem] rounded-lg overflow-hidden border border-gray-300 hover:border-white transition-all"
                        onClick={() => handleSkipTo(preview.start)}
                      >
                        <img
                          src={preview.image}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-lg w-full flex justify-between">
                          <span>Shot {index + 1}</span>
                          <span>{formatTime(preview.start)}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 mb-10">
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
