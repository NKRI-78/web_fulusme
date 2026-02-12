"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { Eye, EyeOff } from "lucide-react";
import { registerAsync } from "@redux/slices/authSlice";
import { useState } from "react";
import Swal from "sweetalert2";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType || !firstName || !email || !phone || !password) {
      Swal.fire({
        icon: "warning",
        title: "Form Belum Lengkap",
        text: "Mohon isi semua field wajib.",
      });
      return;
    }

    try {
      await dispatch(
        registerAsync({
          register: {
            fullname: `${firstName} ${lastName}`,
            email,
            phone,
            password,
            role: userType === "Individu" ? "1" : "2",
          },
        }),
      ).unwrap();

      router.push("/");
    } catch {}
  };

  return (
    <div className="w-full md:w-1/2 bg-white px-6 md:px-20 py-10">
      <div className="flex justify-between items-center mb-10">
        <img src="/images/img.jpg" alt="FuLusme Logo" className="w-20 h-20" />
        <button
          onClick={() => router.push("/")}
          className="text-[#321B87] font-bold text-sm"
        >
          &lt; Kembali Ke Beranda
        </button>
      </div>

      <h1 className="text-3xl font-medium text-[#321B87] mb-2">
        Selamat Datang <span className="font-bold">di FuLusme,</span>
      </h1>
      <p className="text-lg text-[#321B87] mb-10">
        Silahkan berinvestasi dengan <br className="md:hidden" />
        Daftar diri anda terlebih dahulu
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="font-bold text-[#321B87] block mb-1">
            Daftar Sebagai
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full p-3 bg-[#F1F5F9] rounded text-black"
          >
            <option value="">Pilih Tipe Pemodal</option>
            <option value="Individu">Individu</option>
            <option value="Institusi">Institusi</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#321B87] block mb-1">
              Nama Depan
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 bg-[#F1F5F9] rounded text-black"
            />
          </div>
          <div>
            <label className="font-bold text-[#321B87] block mb-1">
              Nama Belakang (Opsional)
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 bg-[#F1F5F9] rounded text-black"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-[#321B87] block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#F1F5F9] rounded text-black"
          />
        </div>

        <div>
          <label className="font-bold text-[#321B87] block mb-1">
            Nomor Handphone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 bg-[#F1F5F9] rounded text-black"
          />
        </div>

        <div>
          <label className="font-bold text-[#321B87] block mb-1">
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
          <p className="w-full md:w-1/2 text-sm">
            Butuh pertanyaan?{" "}
            <a
              href="#"
              className="text-[#321B87] cursor-pointer font-bold hover:underline"
            >
              Hubungi Kami
            </a>
          </p>
          <button
            type="submit"
            className="w-full md:w-1/4 mt-4 md:mt-0 bg-[#321B87] text-white py-3 rounded-full font-bold hover:bg-[#2A1572] transition"
          >
            Daftar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
