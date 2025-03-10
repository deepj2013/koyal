import { useState } from "react";
import { Eye } from "lucide-react";
import { Modal } from "./Modal";

export default function ImagePreview({ imageURL }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <img
        src={imageURL}
        alt="Image"
        className="rounded-lg object-cover border border-gray-300 max-h-[18rem]"
      />

      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-1 left-1 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition"
      >
        <Eye size={14} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Image Preview"
      >
        <div className="p-4 w-full flex justify-center">
          <img
            src={imageURL}
            alt="Full Preview"
            className="max-w-[50vw] max-h-[50vh] rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
}
