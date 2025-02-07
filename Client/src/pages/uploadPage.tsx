import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

const UploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps: string[] = [
    "Upload",
    "Character",
    "Narrative",
    "Prompts",
    "Style",
    "Video",
  ];

  const navigate = useNavigate();

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
    navigate("/lyricedit");
  };

  return (
    <div className="bg-gray-50">
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} />

      <div className="flex flex-col items-center px-4 py-8">
        {/* Upload Form */}
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
          <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
            Choose which type of file to upload?
          </h2>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300">
              Music
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300">
              Podcast
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300">
              Voiceover
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="audioTitle"
                className="block text-gray-600 mb-2"
              >
                Audio Title:
              </label>
              <input
                id="audioTitle"
                type="text"
                placeholder="Enter audio title"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Upload Audio File:
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-all duration-300">
                  Choose File
                  <input type="file" className="hidden" />
                </label>
                <span className="text-gray-400">No file chosen</span>
              </div>
            </div>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            <strong>Note:</strong> Currently, only the first minute of audio will
            be processed. Full-length support coming soon.
          </p>

          <button
            onClick={handleNextStep}
            className="mt-6 w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Transcribe Audio
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;