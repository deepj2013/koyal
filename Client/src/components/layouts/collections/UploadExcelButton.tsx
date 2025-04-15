import React, { useRef } from "react";
import { FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";

const UploadExcelButton = ({ onFileRead }: { onFileRead: (data: any) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      onFileRead(jsonData); 
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
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
        <div className="flex">
          <FaUpload className="w-4 h-4 mr-2" />
          Upload Excel
        </div>
      </button>
    </>
  );
};

export default UploadExcelButton;
