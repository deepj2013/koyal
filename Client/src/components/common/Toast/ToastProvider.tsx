import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 2500,
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          style: {
            background: "#4CAF50",
          },
        },
        error: {
          style: {
            background: "#F44336",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
