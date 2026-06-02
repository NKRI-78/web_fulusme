"use client";

import { createContext, useContext } from "react";
import { SessionData } from "@/app/lib/auth";

const SessionContext = createContext<SessionData | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: SessionData | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionData | null {
  return useContext(SessionContext);
}
