"use client";

import { store } from "@redux/store";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";

import ModalLogout from "@components/modal/logout/Logout";
import Footer from "@components/footer/Footer";
import FooterV2 from "@components/footer/FooterV2";
import Navbar from "@components/navbar/Navbar";
import NavbarV2 from "../navbar/NavbarV2";

import localFont from "next/font/local";

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
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isViewer = pathname.startsWith("/viewer");

  return (
    <Provider store={store}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathname === "/auth/login" || pathname === "/auth/register" ? (
          <div className="w-full flex items-center justify-center h-screen">
            {children}
          </div>
        ) : (
          <main className="min-h-screen text-white relative overflow-hidden flex flex-col">
            {!isViewer && <NavbarV2 />}
            <div className="">
              <div className="">{children}</div>
            </div>
            {pathname === "/form-pemodal" ||
            pathname === "/form-penerbit" ||
            // pathname === "/terms-conditions" ||
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
    </Provider>
  );
}
