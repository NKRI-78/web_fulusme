import { io, Socket } from "socket.io-client";

export const createSocket = (userId: string): Socket => {
  return io(process.env.NEXT_PUBLIC_API_SOCKET!, {
    transports: ["websocket"],
    query: { user_id: userId },
  });
};

const socket = io(process.env.NEXT_PUBLIC_API_SOCKET!);
export default socket;
