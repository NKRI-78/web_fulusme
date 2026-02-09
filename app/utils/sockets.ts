import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(userId: string) {
  if (!socket) {
    console.log("[socket] init → creating new connection", { userId });

    socket = io(process.env.NEXT_PUBLIC_API_SOCKET!, {
      transports: ["websocket"],
      query: { user_id: userId },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[socket] connected", {
        id: socket?.id,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected", { reason });
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("[socket] reconnect attempt", { attempt });
    });

    socket.on("connect_error", (error) => {
      console.error("[socket] connect error", error.message);
    });
  } else {
    console.log("[socket] init skipped → existing connection", {
      id: socket.id,
    });
  }

  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    console.error("[socket] getSocket failed → not initialized");
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
    console.log("[socket] ready via connect event", socket?.id);
    callback(socket!);
    socket?.off("connect", handleConnect);
  };

  socket.on("connect", handleConnect);
}

export function disconnectSocket() {
  if (socket) {
    console.log("[socket] disconnect → closing connection", {
      id: socket.id,
    });
    socket.disconnect();
    socket = null;
  } else {
    console.log("[socket] disconnect skipped → no active socket");
  }
}
