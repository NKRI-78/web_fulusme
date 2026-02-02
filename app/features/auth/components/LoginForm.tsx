"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/auth-service";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const res = await loginUser(email, password);

    setLoading(false);

    Swal.fire({
      icon: res.ok ? "success" : "error",
      title: res.title,
      text: res.message,
      timer: res.ok ? 2000 : undefined,
      showConfirmButton: !res.ok,
      confirmButtonColor: "#10565C",
      confirmButtonText: res.case === "error" ? "Oke" : "Periksa",
    });

    if (res.ok) {
      router.replace("/");
      router.refresh();
    }
  };

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <p className="text-center font-bold text-xl">Masuk</p>

      <div className="w-full">
        <label className="font-bold text-[#10565C] block mb-1">Email</label>
        <input
          type="email"
          placeholder="Masukan Email Anda"
          className="w-full p-3 bg-[#F1F5F9] rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="w-full">
        <label className="font-bold text-[#10565C] block mb-1">Password</label>
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
            onClick={togglePassword}
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
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c4247]"
          }`}
        >
          {loading ? "Loading..." : "Masuk"}
        </button>
      </div>
    </form>
  );
}
