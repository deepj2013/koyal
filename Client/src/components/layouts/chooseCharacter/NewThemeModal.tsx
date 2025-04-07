import React from "react";
import "./style.css";

interface NewThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  handleTextChange: (e) => void;
  onConfirm: () => void;
}

const NewThemeModal: React.FC<NewThemeModalProps> = ({
  isOpen,
  onClose,
  text,
  handleTextChange,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="new-theme-modal">
      <div className="overlay">
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">Create New Theme</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <textarea
              className="textarea-field"
              placeholder="Describe how you want the new theme to be..."
              value={text}
              onChange={e => handleTextChange(e)}
            >
              Make the video more vibrant and colorful.
            </textarea>
            <p className="description">
              Be specific about colors, mood, and style to get the best results.
            </p>
          </div>
          <button className="action-button" onClick={onConfirm}>
            Create New Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewThemeModal;
