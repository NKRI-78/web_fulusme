"use client";

import { store } from "@store/store";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";

import ModalLogout from "@components/modal/logout/Logout";
import FooterV2 from "@components/footer/FooterV2";

import localFont from "next/font/local";
import { SocketProvider } from "@/app/providers/socket-provider";
import SessionTimeoutProvider from "@/app/providers/session-timeout-provider";
import { SessionData } from "@/app/lib/auth";
import { SessionProvider } from "@/app/providers/session-provider";
import Navbar from "../navbar/Navbar";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionData | null;
}) {
  const pathname = usePathname();
  const isViewer = pathname.startsWith("/viewer");
  const isChangePassword = pathname.endsWith("/change-password");
  const isAuthenticated =
    session != null && session.enabled && session.fulfilled_registration;

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <SocketProvider userId={session?.id ?? ""} />
        <SessionTimeoutProvider isAuthenticated={isAuthenticated}>
          <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {pathname === "/auth/login" ||
            pathname === "/auth/register" ||
            pathname === "/auth/forgot-password" ||
            isChangePassword ? (
              <div className="w-full flex items-center justify-center h-screen">
                {children}
              </div>
            ) : (
              <main className="min-h-screen text-white relative overflow-hidden flex flex-col">
                {!isViewer && <Navbar />}
                <div className="">
                  <div className="">{children}</div>
                </div>
                {pathname === "/form-pemodal" ||
                pathname === "/form-penerbit" ||
                pathname === "/dashboard" ||
                pathname === "/form-signature" ||
                pathname === "/form-pemodal-perusahaan" ||
                pathname === "/dashboard/create-project" ||
                pathname === "/dashboard/dokumen-pelengkap" ||
                pathname === "/dashboard/main" ||
                pathname === "/dashboard/project-draft" ||
                pathname === "/dashboard/portfolio" ||
                pathname === "/dashboard/emiten-transaction" ||
                pathname === "/dashboard/investor-transaction" ||
                pathname === "/inbox" ||
                pathname === "/form-data-pemodal-perusahaan" ||
                pathname === "/informasi" ||
                pathname === "/transaction"
                  ? ""
                  : !isViewer && <FooterV2 />}
              </main>
            )}
            <ModalLogout />
          </div>
        </SessionTimeoutProvider>
      </SessionProvider>
    </Provider>
  );
}
