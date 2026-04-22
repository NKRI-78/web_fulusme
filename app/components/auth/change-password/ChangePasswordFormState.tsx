"use client";

import api from "@/utils/axios";
import axios from "axios";
import { ArrowLeft, CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`]).{8,}$/;

//* HANDLE ERROR
const handleError = (error: any, enableDialog: boolean = true) => {
  let title = "Terjadi Kesalahan";
  let message = "Terjadi kesalahan. Silakan coba kembali.";

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const remoteMessage = error.response?.data?.message;
    if (status === 400) {
      title = "Terjadi Kesalahan";
      message = remoteMessage || "Permintaan tidak valid.";
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
  return { title, message };
};

//* COMPONENT
export default function ChangePasswordFormState() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [tokenIsValid, setValidToken] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [appError, setAppError] = useState<{
    title: string | null;
    message: string | null;
  } | null>(null);

  ///! get email and token
  const getEmailToken = (): { email: string; token: string } | null => {
    try {
      if (!slug) {
        setAppError({
          title: "Invalid URL",
          message: "Link tidak valid atau tidak lengkap",
        });
        return null;
      }
      const decoded = decodeURIComponent(slug);
      const [token, email] = decoded.split("&email=");
      if (!token || !email) {
        setAppError({
          title: "Invalid URL",
          message: "Format link tidak sesuai",
        });
        return null;
      }
      return { token, email };
    } catch {
      setAppError({
        title: "Error",
        message: "Terjadi kesalahan saat memproses link",
      });
      return null;
    }
  };

  //* validate url
  const validateUrl = async () => {
    const data = getEmailToken();
    if (data && data.email && data.token) {
      setLoadingVerify(true);
      try {
        const response = await api.post("/api/v1/forgot-password/check-token", {
          email: data.email,
          token: data.token,
        });
        const { is_valid, is_expired, is_used } = response.data?.data ?? {};
        if (is_used) {
          setAppError({
            title: "Link Sudah Digunakan",
            message:
              "Link reset password ini sudah pernah digunakan. Silakan minta link baru jika Anda masih ingin mengubah password.",
          });
        } else if (is_expired) {
          setAppError({
            title: "Link Kedaluwarsa",
            message:
              "Link reset password ini sudah tidak berlaku. Silakan minta link baru untuk melanjutkan.",
          });
        } else if (!is_valid) {
          setAppError({
            title: "Link Tidak Valid",
            message:
              "Link reset password tidak valid. Pastikan Anda menggunakan link terbaru dari email Anda.",
          });
        } else {
          setValidToken(true);
        }
      } catch (error) {
        const remoteError = handleError(error, false);
        setAppError(remoteError);
      } finally {
        setLoadingVerify(false);
      }
    }
  };

  useEffect(() => {
    validateUrl();
  }, []);

  //* validate form
  const validateForm = (): boolean => {
    let isValid = true;
    setPasswordError("");
    setConfirmPasswordError("");
    setAppError(null);
    if (!password) {
      setPasswordError("Password wajib diisi");
      isValid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Konfirmasi password wajib diisi");
      isValid = false;
    }
    if (!isValid) return false;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Minimal 8 karakter, huruf besar, kecil, angka, dan simbol",
      );
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Konfirmasi password tidak cocok");
      isValid = false;
    }
    return isValid;
  };

  //* reset password
  const resetPassword = async () => {
    const data = getEmailToken();
    if (data && data.email && data.token) {
      const formIsValid = validateForm();
      if (formIsValid) {
        setLoadingReset(true);
        try {
          await api.put("/api/v1/reset-password", {
            email: data.email,
            token: data.token,
            new_password: password,
          });
          setResetSuccess(true);
          setTimeout(() => {
            router.replace("/auth/login");
          }, 2000);
        } catch (error) {
          const remoteError = handleError(error, false);
          setAppError(remoteError);
        } finally {
          setLoadingReset(false);
        }
      }
    }
  };

  //* handle submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword();
  };

  //* handle password change with auto-clear error
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError("");
  };

  //* handle confirm password change with auto-clear error
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordError) setConfirmPasswordError("");
  };

  //* — LAYOUT SHELL —
  return (
    <div className="w-full h-screen bg-gray-100 px-8 sm:px-12 md:px-16 lg:px-20 py-14">
      <div className="w-full h-full bg-white rounded-md shadow-md shadow-gray-200 flex flex-col lg:flex-row overflow-hidden">
        {/* Left banner */}
        <div
          className="
            w-full lg:w-[58%] relative lg:px-14 p-6 lg:py-12
            flex flex-col justify-center items-center text-center lg:justify-between lg:items-start lg:text-start
            bg-[url('/images/bg-login.webp')] bg-cover bg-center text-white
            rounded-t-lg lg:rounded-t-none lg:rounded-tl-lg lg:rounded-bl-lg
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent backdrop-blur-sm z-0" />
          <div className="relative z-10 flex flex-col items-center lg:justify-between lg:items-start gap-y-2 h-full">
            <Image
              src="/images/logo-fulusme-vertical-white.png"
              alt="Logo Fulusme Vertical"
              width={130}
              height={100}
              className="hidden md:block"
            />
            <div className="lg:space-y-3">
              <p className="text-base md:text-xl lg:text-3xl font-bold text-white">
                Buat Kata Sandi Baru
              </p>
              <p className="text-sm md:text-base text-white hidden md:block">
                Buat kata sandi baru yang kuat dan mudah diingat untuk
                mengamankan akun Fulusme Anda.
              </p>
            </div>
            <p className="text-transparent select-none hidden lg:block">s</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-[42%] flex items-center justify-center p-8 min-h-[60vh] lg:min-h-0">
          {loadingVerify ? (
            <LoadingState />
          ) : appError && !tokenIsValid ? (
            <ErrorState
              title={appError.title}
              message={appError.message}
              onBack={() => router.replace("/auth/forgot-password")}
            />
          ) : resetSuccess ? (
            <SuccessState />
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <p className="text-center font-bold text-xl text-gray-800">
                Buat Kata Sandi Baru
              </p>
              <p className="text-center text-[10px] md:text-[14px] px-6 text-gray-500 mt-1 mb-7">
                Pastikan kata sandi yang dibuat aman dan mudah diingat.
              </p>

              <div className="mb-6 space-y-4">
                {/* Password */}
                <div className="w-full">
                  <label className="font-semibold text-sm md:text-base text-primary block mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan Password Baru"
                      className={`w-full p-3 bg-[#F1F5F9] rounded text-black pr-11 outline-none transition-all focus:ring-2 focus:ring-primary ${
                        passwordError ? "ring-2 ring-red-400" : ""
                      }`}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-[12px] mt-1.5 leading-snug">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="w-full">
                  <label className="font-semibold text-sm md:text-base text-primary block mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi Password Baru"
                      className={`w-full p-3 bg-[#F1F5F9] rounded text-black pr-11 outline-none transition-all focus:ring-2 focus:ring-primary ${
                        confirmPasswordError ? "ring-2 ring-red-400" : ""
                      }`}
                      value={confirmPassword}
                      onChange={(e) =>
                        handleConfirmPasswordChange(e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-red-500 text-[12px] mt-1.5 leading-snug">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                {/* Global API error */}
                {appError && (
                  <p className="text-red-500 text-[12px] mt-1 leading-snug">
                    {appError.message}
                  </p>
                )}
              </div>

              <div className="w-full flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-x-1 bg-transparent p-1 md:px-4 md:py-2 text-xs md:text-base rounded-md border border-gray-400 text-gray-500 font-semibold transition-all duration-200 hover:bg-gray-50 hover:text-gray-700 active:shadow-sm"
                  onClick={() => router.replace("/")}
                >
                  <ArrowLeft size={15} />
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={loadingReset}
                  className={`flex-1 bg-primary text-white px-4 py-2 text-xs md:text-base rounded-md font-semibold transition-all border border-primary active:shadow-sm ${
                    loadingReset
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  {loadingReset ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Password"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

//* Loading state
function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Memverifikasi link...</p>
    </div>
  );
}

//* Error state
function ErrorState({
  title,
  message,
  onBack,
}: {
  title: string | null;
  message: string | null;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-xs">
      <XCircle size={52} className="text-red-400" strokeWidth={1.5} />
      <div className="space-y-1">
        <p className="font-bold text-gray-800 text-lg">
          {title ?? "Link Tidak Valid"}
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          {message ??
            "Link reset password tidak valid atau telah kedaluwarsa. Silakan minta link baru."}
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-2 flex items-center gap-x-1.5 bg-primary text-white px-5 py-2.5 text-sm rounded-md font-semibold transition-all hover:opacity-90 active:shadow-sm"
      >
        <ArrowLeft size={15} />
        Minta Link Baru
      </button>
    </div>
  );
}

//* Success state
function SuccessState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-xs">
      <CheckCircle size={52} className="text-primary" strokeWidth={1.5} />
      <div className="space-y-1">
        <p className="font-bold text-gray-800 text-lg">
          Password Berhasil Diubah!
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          Kata sandi Anda telah berhasil diperbarui. Anda akan diarahkan ke
          halaman login dalam beberapa detik.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
        <span className="w-3 h-3 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        Mengalihkan ke halaman login...
      </div>
    </div>
  );
}
