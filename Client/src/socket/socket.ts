import { io } from "socket.io-client";
import { config } from "../config/config";

export const createSocket = (token) => {
  const socket = io(config.baseUrl, {
    auth: {
      token,
    },
    transports: ["websocket"],
    autoConnect: false, 
  });

  return socket;
};