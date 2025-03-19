import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import musicicon from "../assets/images/Audiofile.png";
import { useNavigate } from "react-router-dom";
import { uploadFileToS3 } from "../aws/s3-service";
import { useDispatch } from "react-redux";
import {
  useEmotionEndpointMutation,
  useLazyGetEmotionResultQuery,
  useLazyGetSceneResultQuery,
  useLazyGetTranscriberResultQuery,
  useSceneEndpointMutation,
  useTranscriberEndpointMutation,
} from "../redux/services/uploadAudioService/uploadAudioApi";
import {
  setAudioType,
  setSceneDataFileUrl,
} from "../redux/features/uploadSlice";
import { convertJsonToFile } from "../utils/helper";

const allowedFileTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];
const AudioUploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fetchTranscriberResult, { data: transcriberResult }] =
    useLazyGetTranscriberResultQuery();
  const [fetchEmotionResult, { data: emotionResult }] =
    useLazyGetEmotionResultQuery();
  const [fetchSceneResult, { data: sceneResult }] =
    useLazyGetSceneResultQuery();
  useSceneEndpointMutation;
  const [processEmotion, { data: emotionResponse }] =
    useEmotionEndpointMutation();
  const [processTranscriber, { data: transcriberResponse }] =
    useTranscriberEndpointMutation();
  const [procesScene, { data: sceneResponse }] = useSceneEndpointMutation();

  const [selectedAudioType, setSelectedAudioType] = useState("");
  const [isEnglish, setIsEnglish] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioFileURL, setAudioFileURL] = useState(null);
  const [emotionsFileURL, setEmotionsFileURL] = useState(null);
  const [wordTimeStampFileURL, setWordTimeStampFileURL] = useState(null);

  const isNextButtonEnabled =
    audioFileURL && emotionsFileURL && wordTimeStampFileURL;

  const handleNext = () => {
    navigate("/lyricedit");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file && allowedFileTypes?.includes(file.type)) {
      setUploadedFile(file);
      setUploadProgress(0); // Reset progress

      try {
        // Simulate file upload progress up to 90%
        let progress = 0;
        const interval = setInterval(() => {
          if (progress < 90) {
            progress += 10;
            setUploadProgress(progress);
          } else {
            clearInterval(interval);
          }
        }, 100);

        // Upload file to S3
        const fileUrl = await uploadFileToS3(
          file,
          localStorage.getItem("currentUser")
        );

        setAudioFileURL(fileUrl);
        console.log("fileUrl", fileUrl);

        if (fileUrl) {
          callEmotionsAPI(fileUrl);
        } else {
          console.log("File upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        console.log("File upload failed. Please try again.");
        setUploadProgress(0); // Reset progress on failure
      }
    } else {
      console.log("Please select an MP3 or WAV file.");
    }
  };

  const handleJsonFileUpload = async (
    data,
    fileName,
    setFileURL,
    nextAPICall
  ) => {
    try {
      const file = convertJsonToFile(data, fileName);
      const url = await uploadFileToS3(
        file,
        localStorage.getItem("currentUser")
      );
      console.log(fileName, url);

      if (setFileURL) {
        setFileURL(url);
      }

      if (nextAPICall) {
        nextAPICall();
      }

      return url;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  const callEmotionsAPI = (fileURL: string) => {
    dispatch(processEmotion({ data: fileURL }));
  };

  const callTranscriberAPI = (fileURL: string) => {
    dispatch(
      processTranscriber({ data: fileURL, english_priority: isEnglish })
    );
  };

  const callSceneAPI = () => {
    dispatch(
      procesScene({
        word_timestamps: wordTimeStampFileURL,
        emotion_data: emotionsFileURL,
        audio_file: audioFileURL,
      })
    );
  };

  useEffect(() => {
    if (emotionResponse?.call_id) {
      fetchEmotionResult(emotionResponse?.call_id);
    }
  }, [emotionResponse]);

  useEffect(() => {
    if (transcriberResponse?.call_id) {
      fetchTranscriberResult(transcriberResponse?.call_id);
    }
  }, [transcriberResponse]);

  useEffect(() => {
    if (sceneResponse?.call_id) {
      fetchSceneResult(sceneResponse?.call_id);
    }
  }, [sceneResponse]);

  useEffect(() => {
    if (emotionResult) {
      handleJsonFileUpload(
        emotionResult,
        "emotion_data.json",
        setEmotionsFileURL,
        () => callTranscriberAPI(audioFileURL)
      );
    }
  }, [emotionResult]);

  useEffect(() => {
    if (transcriberResult) {
      handleJsonFileUpload(
        transcriberResult,
        "word_timestamp.json",
        setWordTimeStampFileURL,
        callSceneAPI
      );
    }
  }, [transcriberResult]);

  useEffect(() => {
    if (sceneResult) {
      handleJsonFileUpload(sceneResult, "scene.json", null, null).then(
        (url) => {
          setUploadProgress(100);
          dispatch(setSceneDataFileUrl(url));
        }
      );
    }
  }, [sceneResult]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex justify-center">
        <div className="px-20 max-w-[1200px]">
          {/* Main Content */}
          <div className="w-full mt-10">
            <div className="flex justify-start w-[60%] mb-6">
              <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                Generate your video
              </h1>
            </div>
          </div>
          <ProgressBar currentStep={1} />

          {/* Form Section */}
          <div className="w-full mt-12 space-y-12">
            {/* Select Audio Type */}
            <div>
              <h2 className="text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-900 mb-2">
                Select your audio type to upload
                <span className="text-red-500">*</span>
              </h2>
              <p className="text-[16px] font-normal leading-[24px] tracking-[0%] text-gray-500">
                Files supported: MP3, WAV
              </p>
              {uploadedFile ? (
                <div className="border-2 border-blue-500 py-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    {/* Music Icon */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={musicicon} // Replace with the actual path to your icon
                        alt="Music Icon"
                        className="w-6 h-6"
                      />
                      <div>
                        {/* File Name */}
                        <p className="text-gray-900 font-medium">
                          {uploadedFile.name}
                        </p>
                        {/* File Size */}
                        <p className="text-gray-500 text-sm">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {/* Cancel Button */}
                    <button
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => {
                        setUploadedFile(null);
                        setUploadProgress(0);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {/* Upload Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="pl-0 p-4 rounded-lg">
                  <div className="flex space-x-4">
                    {["Music", "Podcast", "Voiceover"].map((type) => (
                      <button
                        key={type}
                        className={`px-6 py-3 border rounded-md ${
                          selectedAudioType === type
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "text-gray-800 hover:bg-gray-100"
                        } focus:ring-2 focus:ring-black`}
                        onClick={() => {
                          setSelectedAudioType(type); // Ensure selection happens first
                          dispatch(setAudioType(type));
                          setTimeout(
                            () => document.getElementById("file-input").click(),
                            0
                          ); // Ensures single click
                        }}
                      >
                        {type}
                      </button>
                    ))}
                    <input
                      id="file-input"
                      type="file"
                      accept=".mp3, .wav"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Is the audio in English? */}
              <div className="mt-8">
                <h2 className="text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-900 mb-2">
                  Is the primary spoken language in the audio file going to be
                  English?
                </h2>
                <p className="text-[16px] font-normal leading-[24px] tracking-[0%] text-gray-500 mb-5">
                  Knowing this helps us transcribe the audio better :)
                </p>
                <div className="flex space-x-4">
                  {["Yes", "No"].map((option, index) => (
                    <button
                      key={option}
                      className={`px-6 py-3 border rounded-md flex items-center space-x-2 focus:ring-2 focus:ring-black ${
                        isEnglish === (index === 0)
                          ? "bg-black text-white"
                          : "text-gray-800"
                      }`}
                      onClick={() => setIsEnglish(index === 0)}
                    >
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end w-full mt-12 mx-auto">
              <button className="px-6 py-1 mr-2 h-[40px] border border-gray-300 rounded-md text-gray-500">
                Previous
              </button>
              <button
                className={`px-6 py-1 h-[40px] rounded-md relative group ${
                  !isNextButtonEnabled
                    ? "bg-gray-300 text-gray-800"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                disabled={!isNextButtonEnabled}
                onClick={handleNext}
              >
                Next
                {!uploadedFile && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-black text-white text-[16px] font-normal leading-[24px] tracking-[0%] px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity min-w-[220px] ">
                    Please upload audio to move to next step
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioUploadPage;
