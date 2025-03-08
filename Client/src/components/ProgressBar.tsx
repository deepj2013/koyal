import React from "react";
import progresimg1 from "../assets/images/FeaturedIcon.svg";
import progresimg2 from "../assets/images/Transcript.svg";
import progresimg3 from "../assets/images/ChooseChar.svg";
import progresimg4 from "../assets/images/SelectChar.svg";
import progresimg5 from "../assets/images/EditScene.svg";
import progresimg6 from "../assets/images/FinalVideo.svg";

const steps = [
  { id: 1, label: "Upload audio", icon: progresimg1 },
  { id: 2, label: "Review transcript", icon: progresimg2 },
  { id: 3, label: "Choose character", icon: progresimg3 },
  { id: 4, label: "Select style", icon: progresimg4 },
  { id: 5, label: "Edit scenes", icon: progresimg5 },
  { id: 6, label: "Final video", icon: progresimg6 },
];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-around w-full py-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Circle and Label */}
          <div className="flex flex-col items-center">
            {/* Step Circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                currentStep >= step.id
                  ? "bg-black text-white"
                  : "text-gray-700"
              }`}
            >
              <img
                src={step.icon}
                alt={step.label}
                className={`w-full h-full ${
                  currentStep >= step.id && step.id !== 1 ? "filter invert" : ""
                }`}
              />
            </div>

            {/* Step Label */}
            <div
              className={`mt-2 text-sm text-center ${
                currentStep === step.id
                  ? "text-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </div>
          </div>

          {/* Step Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`h-[1.5px] w-16 ${
                currentStep > step.id ? "bg-black" : "bg-gray-200"
              }`}
              style={{
                marginTop: "-2.5rem", // Adjusts the line to align vertically in the middle of the icon
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;