import React, { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import musicicon from "../assets/images/Audiofile.png"
import { useNavigate } from "react-router-dom";

const AudioUploadPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAudioType, setSelectedAudioType] = useState("");
    const [isEnglish, setIsEnglish] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleAudioTypeSelect = (type) => {
        setSelectedAudioType(type);
        document.getElementById("file-input").click(); // Trigger the file input
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "audio/mp3" || file.type === "audio/wav" || file.type === "audio/mpeg")) {
            setUploadedFile(file);
            // Simulate file upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress === 100) {
                    clearInterval(interval);
                }
            }, 100);
        } else {
            alert("Please select an MP3 or WAV file.");
        }
    };

    const isNextButtonDisabled =
        !selectedAudioType || !isEnglish || uploadProgress < 100;

    const navigate = useNavigate();

    const handleNext = () => {
        if (uploadedFile) {
            setIsUploading(true);
            setTimeout(() => {
                setIsUploading(false);
                navigate("/lyricedit"); // Redirect to TranscriptPage after loading
            }, 100); // 3 seconds delay for loading simulation
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex justify-center">
            <div className="px-40 max-w-[1200px]">
            {/* Main Content */}
            <div className="w-full mt-10">
                <div className="flex justify-start w-[60%] mb-6">
                    <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                        Generate your video
                    </h1>
                </div>
            </div>
            <ProgressBar currentStep={currentStep} />

            {/* Form Section */}
            <div className="w-full mt-12 space-y-12">
                {/* Select Audio Type */}
                <div>
                    <h2 className="text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-900 mb-2">
                        Select your audio type to upload<span className="text-red-500">*</span>
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
                    <p className="text-gray-900 font-medium">{uploadedFile.name}</p>
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
    <div className="p-4 rounded-lg">
        <div className="flex space-x-4">
            {["Music", "Podcast", "Voiceover"].map((type) => (
                <button
                    key={type}
                    className={`px-6 py-3 border rounded-md ${selectedAudioType === type ? "bg-gray-800 text-white" : "text-gray-800"
                        } hover:bg-gray-100 focus:ring-2 focus:ring-black`}
                    onClick={() => {
                        setSelectedAudioType(type); // Ensure selection happens first
                        setTimeout(() => document.getElementById("file-input").click(), 0); // Ensures single click
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
                            Is the primary spoken language in the audio file going to be English?
                        </h2>
                        <p className="text-[16px] font-normal leading-[24px] tracking-[0%] text-gray-500 mb-5">
                            Knowing this helps us transcribe the audio better :)
                        </p>
                        <div className="flex space-x-4">
                            {["Yes", "No"].map((option, index) => (
                                <button
                                    key={option}
                                    className={`px-6 py-3 border rounded-md flex items-center space-x-2 focus:ring-2 focus:ring-black ${isEnglish === (index === 0) ? "bg-black text-white" : "text-gray-800"
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
                        className={`px-6 py-1 h-[40px] rounded-md relative group ${!uploadedFile
                                ? "bg-gray-300 text-gray-800"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                        disabled={!uploadedFile}
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