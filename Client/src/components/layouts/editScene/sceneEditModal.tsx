import React from "react";
import "./style.scss";

interface SceneEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  handleTextChange: (e) => void;
  onConfirm: () => void;
}

const SceneEditModal: React.FC<SceneEditModalProps> = ({
  isOpen,
  onClose,
  text,
  handleTextChange,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="scene-edit-modal">
      <div className="overlay">
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">What kind of scene do you want?</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <textarea
              className="textarea-field"
              placeholder="Ex: make the character smile"
              value={text}
              onChange={(e) => handleTextChange(e)}
            ></textarea>
          </div>
          <button className="action-button" onClick={onConfirm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneEditModal;
