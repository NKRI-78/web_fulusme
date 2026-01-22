"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";

const errorMessages: Record<string, string> = {
  CREDENTIALS_IS_INCORRECT: "Password yang kamu masukkan salah.",
  USER_NOT_FOUND: "Email salah atau belum terdaftar, cek kembali email Anda.",
};

const LoginV2: React.FC = () => {
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
        text: "Mohon isi semua field wajib.",
      });
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth//login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // asumsi backend kirim token / data user
      // if (res.data?.access_token) {
      //   localStorage.setItem("token", res.data.access_token);
      // }

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Terjadi kesalahan saat login. Silakan coba lagi.";

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white px-10 md:px-15 py-5 mx-auto">
      <div className="flex justify-between items-center mb-10">
        <img
          src="/images/logo-fulusme-vertical.png"
          alt="FuLusme Logo"
          className="h-10"
        />
        <Link href="/">
          <button className="text-[#10565C] font-bold text-sm">
            &lt; Kembali Ke Beranda
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="w-full">
          <label className="font-bold text-[#10565C] block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-[#F1F5F9] rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label className="font-bold text-[#10565C] block mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
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

        <div className="flex flex-row flex-wrap justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-1/4 bg-[#10565C] text-white py-3 rounded-xl font-bold transition ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-[#16EDFF] hover:text-black"
            }`}
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginV2;
