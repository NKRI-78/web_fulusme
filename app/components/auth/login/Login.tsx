"use client";

import { AppDispatch } from "@redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BACKEND } from "@/app/utils/constant";
import Link from "next/link";
import Image from "next/image";

const errorMessages: Record<string, string> = {
  CREDENTIALS_IS_INCORRECT: "Password yang kamu masukkan salah.",
  USER_NOT_FOUND: "Email salah atau belum terdaftar, cek kembali email Anda.",
};

const Login: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Form Belum Lengkap",
        text: "Email atau password belum diisi. Silakan lengkapi terlebih dahulu.",
        iconColor: "#10565C",
        confirmButtonColor: "#10565C",
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      const userData = response.data.data;
      Cookies.set("user", JSON.stringify(response.data.data), { expires: 7 });

      if (!userData.enabled) {
        await Swal.fire({
          icon: "info",
          title: "Verifikasi Diperlukan",
          text: "Anda belum memasukkan kode OTP. Silakan verifikasi terlebih dahulu.",
          iconColor: "#10565C",
          confirmButtonColor: "#10565C",
          confirmButtonText: "Verifikasi Sekarang",
        });

        const payloads = {
          val: userData.email,
        };
        const { data } = await axios.post(
          `${API_BACKEND}/api/v1/resend-otp`,
          payloads
        );

        localStorage.setItem("showOtp", "true");

        router.push("/");
        return;
      }
      if (userData.role === "user") {
        await Swal.fire({
          icon: "info",
          title: "Data Belum Lengkap",
          text: "Silakan pilih peran anda dan lengkapi semua data yang dibutuhkan.",
          confirmButtonText: "Pilh Peran",
          iconColor: "#10565C",
          confirmButtonColor: "#10565C",
        });

        localStorage.setItem("user", JSON.stringify(response.data.data));

        if (userData.role === "user") {
          localStorage.setItem("showSelectRole", "true");
          router.push("/");
          return;
        }
      }
      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard");
    } catch (error: any) {
      const rawMessage = error.response?.data?.message;

      const message =
        errorMessages[rawMessage as keyof typeof errorMessages] ??
        "Terjadi kesalahan saat login. Silakan coba lagi.";

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
        confirmButtonColor: "#10565C",
      });
    } finally {
      setLoading(false);
    }
  };

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
                Selamat Datang Kembali!
              </p>
              <p className="text-sm md:text-base text-white">
                Akses kembali akun Anda dan lanjutkan aktivitas investasi
                bersama kami.
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
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <p className="text-center font-bold text-xl">Masuk</p>

            <div className="w-full">
              <label className="font-bold text-[#10565C] block mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukan Email Anda"
                className="w-full p-3 bg-[#F1F5F9] rounded text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="font-bold text-[#10565C] block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Password Anda"
                  className="w-full p-3 bg-[#F1F5F9] rounded text-black pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="w-full flex gap-4">
              <button
                type="button"
                className="flex items-center gap-x-1 bg-transparent px-4 py-2 rounded-md border border-gray-500 text-gray-500 font-bold transition-all duration-300 hover:bg-gray-50 hover:text-black active:shadow-md"
                onClick={() => router.back()}
              >
                <ArrowLeft size={16} />
                Kembali
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-[#10565C] text-white px-4 py-2 rounded-md font-bold transition-all border border-[#10565C] active:shadow-md ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#0c4247]"
                }`}
              >
                {loading ? "Loading..." : "Masuk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
