import { logger } from "@/utils/logger";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(userId: string) {
  if (!socket) {
    logger.info("[socket] init → creating new connection", { userId });

    socket = io(process.env.NEXT_PUBLIC_API_SOCKET!, {
      transports: ["websocket"],
      query: { user_id: userId },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      logger.info("[socket] connected", {
        id: socket?.id,
      });
    });

    socket.on("disconnect", (reason) => {
      logger.info("[socket] disconnected", { reason });
    });

    socket.on("reconnect_attempt", (attempt) => {
      logger.info("[socket] reconnect attempt", { attempt });
    });

    socket.on("connect_error", (error) => {
      logger.error("[socket] connect error", error.message);
    });
  } else {
    logger.info("[socket] init skipped → existing connection", {
      id: socket.id,
    });
  }

  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    logger.error("[socket] getSocket failed → not initialized");
    throw new Error("Socket not initialized. Call initSocket() first.");
  }

  return socket;
}

export function onSocketReady(callback: (socket: Socket) => void) {
  if (!socket) {
    console.warn("[socket] onSocketReady called before init");
    return;
  }

  if (socket.connected && socket.id) {
    callback(socket);
    return;
  }

  const handleConnect = () => {
    logger.info("[socket] ready via connect event", socket?.id);
    callback(socket!);
    socket?.off("connect", handleConnect);
  };

  socket.on("connect", handleConnect);
}

export function disconnectSocket() {
  if (socket) {
    logger.info("[socket] disconnect → closing connection", {
      id: socket.id,
    });
    socket.disconnect();
    socket = null;
  } else {
    logger.info("[socket] disconnect skipped → no active socket");
  }
}
