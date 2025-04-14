import { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const setSocket = (newSocket: Socket) => {
  socket = newSocket;
};

export const getSocket = () => socket;