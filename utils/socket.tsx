// socket.js
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://chatrio-backend.onrender.com";

let socket: Socket | undefined;

export const connectSocket = (token: string) => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ["websocket"],
            auth: { token },
        });
    }
    return socket;
};

export const getSocket = () => socket;
