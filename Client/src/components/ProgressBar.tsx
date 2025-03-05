import React from "react";
import progresimg1 from "../assets/images/icon1.png";
import progresimg2 from "../assets/images/icon2.png";
import progresimg3 from "../assets/images/icon3.png";
import progresimg4 from "../assets/images/icon4.png";
import progresimg5 from "../assets/images/icon5.png";
import progresimg6 from "../assets/images/icon6.png";

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
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <img
                src={step.icon}
                alt={step.label}
                className={`w-6 h-6 ${
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