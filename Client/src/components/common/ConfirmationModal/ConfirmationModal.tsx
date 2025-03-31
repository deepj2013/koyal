interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string
  }
  
  export const ConfirmationModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center transform transition-all scale-95">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Confirm Action</h2>
          <p className="text-lg text-gray-700">{title}</p>
          <div className="flex justify-between mt-8">
            <button
              onClick={onClose}
              className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };