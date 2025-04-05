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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative z-50 border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
        >
          ✖
        </button>
        <h2 className="text-[18px] text-white text-center mb-4">
          Confirm Action
        </h2>
        <p className="text-lg text-white">{title}</p>
        <div className="flex justify-between mt-8">
          <button
            onClick={onClose}
            className="px-5 bg-white/20 py-3 mt-4 py-3  text-white rounded-lg hover:bg-white/30  transition duration-200 border border-white/30"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 bg-white/20 py-3 mt-4 py-3  text-white rounded-lg hover:bg-white/30  transition duration-200 border border-white/30"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
