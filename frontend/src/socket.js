import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
  withCredentials: true,
});

export default socket;
