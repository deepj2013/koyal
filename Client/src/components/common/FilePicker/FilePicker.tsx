import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";

export const FileUpload = ({ uploadedFiles, setUploadedFiles }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = acceptedFiles.filter(
        (newFile) => !prevFiles.some((file) => file.name === newFile.name)
      );
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/mpeg": [".mp3"], "audio/wav": [".wav"] },
  });

  return (
    <div className="w-full">
      <label className="block text-base font-medium text-gray-700">
        Upload your songs <span className="text-red-500">*</span>
      </label>
      <p className="text-sm text-gray-500 mb-4">Files supported: MP3, WAV</p>

      <div
        {...getRootProps()}
        className={`mt-2 flex flex-col items-center justify-center border-2 border rounded-lg p-6 cursor-pointer min-h-[20vh] ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-800 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full">
            <IoCloudUploadOutline className="text-2xl" />
          </div>
          <p className="text-base font-medium text-gray-700 mt-2">
            Drop your audio files here
          </p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </div>
      </div>

      <div className="mt-4 h-[15vh]">
        {uploadedFiles.length > 0 && (
          <>
            <p className="text-gray-600 font-semibold mb-2">Uploaded Files:</p>
            <div className="max-h-[15vh] overflow-y-auto border border-gray-300 rounded-lg p-2">
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button onClick={() => removeFile(index)}>
                      <IoClose className="text-lg text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
