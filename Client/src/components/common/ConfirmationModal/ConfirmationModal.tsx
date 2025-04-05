import './style.css'
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Confirm Action</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      <div className="modal-body">
        <p className="modal-message">Are you sure you want to Regenerate the Scene?</p>
      </div>
      <div className="modal-footer">
        <button className="button button-secondary"  onClick={onClose}>Cancel</button>
        <button className="button button-primary"  onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>

  );
};
