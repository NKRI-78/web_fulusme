"use client";

import { store } from "@store/store";
import { Provider } from "react-redux";

import { SocketProvider } from "@features/inbox/providers/socket-provider";
import SessionTimeoutProvider from "@features/auth/providers/session-timeout-provider";
import { SessionProvider } from "@features/auth/providers/session-provider";
import { FileViewerProvider } from "@shared/hooks/useFileViewerModal";
import { SessionData } from "@shared/lib/auth";
import ModalLogout from "@shared/ui/Logout";

/**
 * Thin client provider shell. Owns ONLY cross-cutting providers (Redux, session,
 * socket, session-timeout, file-viewer) plus the global logout modal. Chrome
 * (navbar/footer) is decided by route-group layouts, not here — see app/(marketing),
 * app/(dashboard), app/(auth), app/(standalone).
 */
export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionData | null;
}) {
  const isAuthenticated =
    session != null && session.enabled && session.fulfilled_registration;

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <FileViewerProvider>
          <SocketProvider userId={session?.id ?? ""} />
          <SessionTimeoutProvider isAuthenticated={isAuthenticated}>
            {children}
            <ModalLogout />
          </SessionTimeoutProvider>
        </FileViewerProvider>
      </SessionProvider>
    </Provider>
  );
}