import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { arrowUpSvg } from "../../../assets";

export const FileUpload = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Uploaded Files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/mpeg": [".mp3"], "audio/wav": [".wav"] },
  });

  return (
    <div className="w-full">
      <label className="block text-base font-medium text-gray-700">
        Upload your songs <span className="text-red-500">*</span>
      </label>
      <p className="text-sm text-gray-500 mb-8">Files supported: MP3, WAV</p>

      <div
        {...getRootProps()}
        className={`mt-2 flex flex-col items-center justify-center border-2 border rounded-lg p-6 cursor-pointer min-h-[30vh] ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-800 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full">
            <img src={arrowUpSvg} alt="" />
          </div>
          <p className="text-base font-medium text-gray-700 mt-2">
            Drop your audio files here
          </p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </div>
      </div>
    </div>
  );
};
