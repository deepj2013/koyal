import React, { useRef } from "react";

const UploadExcelButton = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg"
        onClick={handleButtonClick}
      >
        Upload Excel
      </button>
    </>
  );
};

export default UploadExcelButton;
