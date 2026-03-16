import ForgotPasswordForm from "@/app/components/auth/forgot-password/ForgotPasswordForm";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | Fulusme",
  description:
    "Atur ulang kata sandi akun Fulusme Anda dengan memasukkan email yang terdaftar.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Lupa Kata Sandi | Fulusme",
    description: "Atur ulang kata sandi akun Fulusme Anda.",
    type: "website",
  },
};

export default function page() {
  return (
    <div className="w-full h-screen bg-gray-100 px-8 sm:px-12 md:px-16 lg:px-20 py-14">
      <div className="w-full h-full bg-white rounded-md shadow-md shadow-gray-200 flex flex-col lg:flex-row">
        <div
          className="
            w-full lg:w-[58%] relative lg:px-14 p-6 lg:py-12 
            flex flex-col justify-center items-center text-center lg:justify-between lg:items-start lg:text-start
            bg-[url('/images/bg-login.webp')] bg-cover bg-center text-white
            rounded-t-lg lg:rounded-t-none lg:rounded-tl-lg lg:rounded-bl-lg
            overflow-hidden
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent backdrop-blur-sm z-0"></div>

          <div className="relative z-10 flex flex-col items-center lg:justify-between lg:items-start gap-y-2 h-full">
            <Image
              src={"/images/logo-fulusme-vertical-white.png"}
              alt="Logo Fulusme Vertical"
              width={130}
              height={100}
              className="hidden md:block"
            />
            <div className="lg:space-y-3">
              <p className="text-base md:text-xl lg:text-3xl font-bold text-white">
                Pulihkan Akses Akun Anda
              </p>
              <p className="text-sm md:text-base text-white hidden md:block">
                Verifikasi email Anda untuk membuat kata sandi baru dan
                mendapatkan kembali akses ke akun.
              </p>
            </div>
            <p className="text-transparent select-none hidden lg:block">s</p>
          </div>
        </div>

        <div
          className="
            w-full lg:w-[42%] flex items-center justify-center p-8
            min-h-[60vh] lg:min-h-0
          "
        >
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
