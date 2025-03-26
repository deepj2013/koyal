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

  const { protoPromptsUrl, characterName, scenesJson, imageFolderUrl } = useSelector(AppState);

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

  useEffect(() => {
    processVideo({
      proto_prompts: protoPromptsUrl,
      character_name: characterName,
      style: selectedStyle?.name?.toLowerCase(),
      orientation: orientationStyle?.toLowerCase(),
      image_folder_path: imageFolderUrl
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
                  <div className="border border-gray-300  rounded-lg">
                    <div className="flex w-full relative">
                      {/* Preview Button */}
                      <button
                        key={index}
                        className="relative w-32 overflow-hidden border border-gray-300 hover:border-white transition-all"
                        onClick={() => handleSkipTo(preview.start)}
                      >
                        <img
                          src={preview.image}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </button>

                      <div className="absolute top-1 right-1 bg-white rounded-full shadow-md">
                        <FaInfoCircle
                          className="w-3 h-3 text-gray-500 hover:text-blue-500 cursor-pointer"
                          title={preview?.description}
                        />
                      </div>

                      <div className="flex items-center">
                        <button
                          key={index}
                          className="relative"
                         
                        >
                          <FaUndo className="mx-2 w-4 h-4 text-gray-500 hover:text-black transition-colors duration-200" />
                        </button>
                      </div>
                    </div>
                    <div className="flex text-center w-full">
                      <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 w-full">
                        Shot {index + 1}: {formatTime(preview.start)}
                      </span>
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
