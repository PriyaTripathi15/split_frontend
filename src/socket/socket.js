import { io } from "socket.io-client";

const socket = io("https://split-backend-3.onrender.com" || "http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});

export default socket;