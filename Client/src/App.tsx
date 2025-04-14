import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import "@fontsource/gloria-hallelujah";
import AppRoutes from "./routes/Routes";
import ToastProvider from "./components/common/Toast/ToastProvider";
import { AuthState } from "./redux/features/authSlice";
import { createSocket } from "./socket/socket";

const App: React.FC = () => {
  const { userInfo } = useSelector(AuthState);
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userInfo?.token) return;

    const socket = createSocket(userInfo?.token);
    socketRef.current = socket;

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("authentication-error", (err) => {
      console.error("Socket auth error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo]);

  return (
    <>
      <ToastProvider />
      <AppRoutes />
    </>
  );
};

export default App;
