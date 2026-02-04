"use client";

import { useEffect } from "react";
import { disconnectSocket, initSocket } from "../utils/sockets";

export function SocketProvider({ userId }: { userId: string }) {
  useEffect(() => {
    initSocket(userId);

    return () => {
      // logout / app close
      disconnectSocket();
    };
  }, [userId]);

  return null;
}
