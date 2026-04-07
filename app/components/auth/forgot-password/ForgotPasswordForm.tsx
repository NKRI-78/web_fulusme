"use client";

import api from "@/utils/axios";
import { logger } from "@/utils/logger";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

//* MASK EMAIL
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  const start = localPart.slice(0, 2);
  const end = localPart.slice(-3);

  const maskedLength = Math.max(localPart.length - 5, 0);
  const masked = "*".repeat(maskedLength);

  return `${start}${masked}${end}@${domain}`;
}

//* VALIDATE EMAIL
const validateEmail = (email: string) => {
  let msg = "";
  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    msg = "Email tidak boleh kosong";
    valid = false;
  } else if (!emailRegex.test(email)) {
    msg = "Format email tidak valid";
    valid = false;
  }
  return {
    mesaage: msg,
    isValid: valid,
  };
};

//* HANDLE ERROR
const handleError = (error: any, enableDialog: boolean = true) => {
  let title = "Terjadi Kesalahan";
  let message = "Terjadi kesalahan. Silakan coba kembali.";
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const remoteMessage = error.response?.data?.message;
    if (status === 400) {
      title = "Permintaan Tidak Valid";
      message = remoteMessage || "Permintaan tidak valid.";
    }
    if (message === "USER_NOT_FOUND") {
      title = "Email Tidak Ditemukan";
      message =
        "Periksa kembali email yang Anda masukkan. Pastikan tidak ada kesalahan penulisan dan gunakan email yang terdaftar di Fulusme.";
    }
    if (message === "INVALID_OTP") {
      title = "Kode OTP Tidak Valid";
      message =
        "Kode OTP yang Anda masukkan tidak sesuai. Periksa kembali atau minta kode OTP baru.";
    }
    if (!error.response) {
      title = "Koneksi Bermasalah";
      message =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba kembali.";
    }
    if (status === 500) {
      title = "Server Bermasalah";
      message =
        "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";
    }
  }
  if (enableDialog) {
    Swal.fire({
      icon: "warning",
      title: title,
      text: message,
      iconColor: "#10565C",
      confirmButtonColor: "#10565C",
      confirmButtonText: "Mengerti",
      customClass: {
        title: "text-base md:text-xl font-bold",
        htmlContainer: "text-sm md:text-base",
        confirmButton: "text-sm md:text-base px-4 py-2",
      },
    });
  }
  return {
    title: title,
    message: message,
  };
};

//* COMPONENT
export default function ForgotPasswordForm() {
  const { forgotToken } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = forgotToken as string;
    logger.info("token", token);
  }, []);

  //* handle submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    sendEmail();
  };

  //* send email
  const sendEmail = async () => {
    const validateResult = validateEmail(email);
    if (validateResult.isValid) {
      setLoading(true);
      setIsEmailSent(false);
      try {
        await api.put("/api/v1/forgot-password", {
          email: email,
        });
        setIsEmailSent(true);
      } catch (e) {
        const error = handleError(e);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage(validateResult.mesaage);
    }
  };

  //* ui
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <p className="text-center font-bold text-xl">"Lupa Kata Sandi"</p>
      <p className="text-center text-[10px] md:text-[14px] px-10 text-gray-600 mb-6">
        {isEmailSent && email ? (
          <>
            Kami telah mengirimkan link untuk mereset password anda melalui
            email{" "}
            <span className="font-semibold text-gray-800">
              {maskEmail(email)}
            </span>
          </>
        ) : (
          "Masukkan kembali email yang terdaftar pada akun Fulusme"
        )}
      </p>

      <div className="mb-6">
        <div className="w-full">
          <label className="font-bold text-sm md:text-base text-primary block mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Masukan Email Anda"
            className="w-full p-3 rounded text-black bg-[#F1F5F9] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {errorMessage && (
            <p className="text-red-500 text-[13px] mt-2 line-clamp-2">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex gap-4">
        <button
          type="button"
          className="flex items-center gap-x-1 bg-transparent p-1 md:px-4 md:py-2 text-xs md:text-base rounded-md border border-gray-500 text-gray-500 font-bold transition-all duration-300 hover:bg-gray-50 hover:text-black active:shadow-md"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`flex-1 bg-primary text-white px-4 py-2 text-xs md:text-base rounded-md font-bold transition-all border border-primary active:shadow-md ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary"
          }`}
        >
          {loading ? "Mengirimkan Email" : "Kirim"}
        </button>
      </div>
    </form>
  );
}
