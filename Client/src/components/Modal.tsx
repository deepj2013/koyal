interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  isConfirmDisabled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  onConfirm,
  isConfirmDisabled,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
      <div className="bg-white p-6 rounded-2xl shadow-lg  max-w-[75vw] max-h-[80vw] transform transition-all scale-95">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-[500]">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 font-bold"
            >
              X
            </button>
          </div>
        </div>

        <div className="mb-4">{children}</div>

        <div className="flex justify-between gap-3 mt-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          )}

          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg transition 
               bg-blue-600 text-white hover:bg-blue-700 
               disabled:opacity-50 disabled:bg-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed"
              disabled={isConfirmDisabled}
            >
              {confirmText ? confirmText : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
