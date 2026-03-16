"use client";

import api from "@/utils/axios";
import { logger } from "@/utils/logger";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import SendEmailField from "./component/SendEmailField";
import ChangePasswordField from "./component/ChangePasswordField";
import VerifyOtpField, { OTP_EXPIRY_KEY } from "./component/VerifyOtpField";

const STORAGE_KEY = "9mfsdiw9er34tmew9rq9m3i";

const STEPS = ["send_email", "verify_otp", "change_password"] as const;
type Step = (typeof STEPS)[number];
const STEP_TITLE: Record<Step, string> = {
  send_email: "Lupa Kata Sandi",
  verify_otp: "Verifikasi Kode OTP",
  change_password: "Ganti Password Baru",
};
const getStepSubtitle = (email?: string): Record<Step, string> => {
  const maskedEmail = email ? maskEmail(email) : null;
  return {
    send_email: "Masukkan kembali email yang terdaftar pada akun Fulusme",
    verify_otp: `Masukkan kode OTP yang telah dikirim ke ${maskedEmail ?? "email Anda"}`,
    change_password: `Masukkan kata sandi baru untuk ${maskedEmail ?? "akun Anda"}`,
  };
};
const CONFIRM_BUTTON_LABEL: Record<Step, readonly [string, string]> = {
  send_email: ["Kirim Kode", "Mengirim kode OTP"],
  verify_otp: ["Verifikasi OTP", "Memverifikasi OTP"],
  change_password: ["Ganti Password", "Memuat password baru"],
};

interface StepState {
  step: Step;
  email?: string;
  otp?: string;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

//* SAVE STATE
function saveState(state: StepState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

//* VALIDATE STEP
const isValidStep = (value: string): value is Step =>
  STEPS.includes(value as Step);

//* GET STATE
function getState(): StepState | null {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed: StepState = JSON.parse(savedState);
        return {
          ...parsed,
          step: isValidStep(parsed.step) ? parsed.step : "send_email",
        };
      } catch (error) {
        logger.error("error parsed StepState", error);
        return null;
      }
    }
  }
  return null;
}

//* REMOVE STATE
function removeState() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OTP_EXPIRY_KEY);
  }
}

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

//* VALIDATE OTP
const validateOtp = (otp: string) => {
  let message = "";
  let isValid = true;

  if (!otp) {
    message = "OTP wajib diisi";
    isValid = false;
  } else if (otp.length < 4) {
    message = "OTP tidak lengkap";
    isValid = false;
  }

  return {
    message,
    isValid,
  };
};

//* HANDLE ERROR
const handleError = (error: any, enableDialog: boolean = true) => {
  let errTitle = "Terjadi Kesalahan";
  let errMsg = "Terjadi kesalahan. Silakan coba kembali.";
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (status === 400) {
      errTitle = "Permintaan Tidak Valid";
      errMsg = message || "Permintaan tidak valid.";
    }
    if (message === "USER_NOT_FOUND") {
      errTitle = "Email Tidak Ditemukan";
      errMsg =
        "Periksa kembali email yang Anda masukkan. Pastikan tidak ada kesalahan penulisan dan gunakan email yang terdaftar di Fulusme.";
    }
    if (message === "INVALID_OTP") {
      errTitle = "Kode OTP Tidak Valid";
      errMsg =
        "Kode OTP yang Anda masukkan tidak sesuai. Periksa kembali atau minta kode OTP baru.";
    }
    if (!error.response) {
      errTitle = "Koneksi Bermasalah";
      errMsg =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba kembali.";
    }
    if (status === 500) {
      errTitle = "Server Bermasalah";
      errMsg =
        "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";
    }
  }
  if (enableDialog) {
    Swal.fire({
      icon: "warning",
      title: errTitle,
      text: errMsg,
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
    errTitle: errTitle,
    errMessage: errMsg,
  };
};

//* COMPONENT
export default function ForgotPasswordForm() {
  const router = useRouter();

  const [stepState, setStepState] = useState<StepState>({
    step: "send_email",
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmPassMessage, setConfirmPassMessage] = useState("");

  //* init state
  useEffect(() => {
    const savedState = getState();
    if (savedState) {
      setStepState(savedState);
      if (savedState.email) setEmail(savedState.email);
    }
  }, []);

  //* save state
  useEffect(() => {
    saveState({
      ...stepState,
      email: email,
      otp: otp,
    });
  }, [stepState, email, otp]);

  //* handle submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    switch (stepState.step) {
      case "send_email":
        sendEmail();
        break;
      case "verify_otp":
        verifyOtp();
        break;
      case "change_password":
        changePassword();
        break;
    }
  };

  //* send email
  const sendEmail = async () => {
    const res = validateEmail(email);
    if (res.isValid) {
      setLoading(true);
      try {
        await api.put("/api/v1/forgot-password", {
          email: email,
        });
        setStepState({
          ...stepState,
          step: "verify_otp",
        });
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    } else {
      setMessage(res.mesaage);
    }
  };

  //* verify otp
  const verifyOtp = async (otpParam?: string) => {
    const res = validateOtp(otpParam ?? otp);
    if (res.isValid) {
      setLoading(true);
      try {
        await api.put("/api/v1/verify-otp-change-password", {
          email: email,
          otp: otpParam ?? otp,
        });
        setStepState({
          ...stepState,
          step: "change_password",
        });
      } catch (error) {
        const res = handleError(error, false);
        setMessage(res.errMessage);
      } finally {
        setLoading(false);
      }
    } else {
      setMessage(res.message);
    }
  };

  //* resend otp
  const resendOtp = async () => {
    setLoading(true);
    try {
      await api.put("/api/v1/resend-otp-change-password", {
        email: email,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  //* change password
  const changePassword = async () => {
    setLoading(true);
    try {
      await api.put("/api/v1/change-password", {
        email: email,
        otp: otp,
        new_password: password,
      });
      removeState();
      router.replace("/auth/login");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  //* ui
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <p className="text-center font-bold text-xl">
        {STEP_TITLE[stepState.step]}
      </p>
      <p className="text-center text-[10px] md:text-[14px] px-10 text-gray-600 mb-6">
        {getStepSubtitle(email)[stepState.step]}
      </p>

      <div className="mb-6">
        {stepState.step === "send_email" ? (
          <SendEmailField
            className="w-full"
            value={email}
            onChange={(v) => setEmail(v)}
            errorMessage={message}
            showError={stepState.step === "send_email"}
          />
        ) : stepState.step === "verify_otp" ? (
          <VerifyOtpField
            value={otp}
            onChange={(v) => {
              setOtp(v);
              if (v.length === 4) verifyOtp(v);
              if (message && v) setMessage("");
            }}
            onResendOtp={resendOtp}
            loading={loading}
            errorMessage={message}
          />
        ) : (
          <ChangePasswordField
            passwordValue={password}
            confirmPasswordValue={confirmPassword}
            passwordOnChange={(v) => {
              setPassword(v);
              if (!passwordRegex.test(v)) {
                setMessage(
                  "Password minimal 8 karakter, memuat huruf besar, huruf kecil, angka, dan karakter khusus",
                );
                return;
              }
              setMessage("");
            }}
            confirmPasswordOnChange={(v) => {
              setConfirmPassword(v);
              setConfirmPassMessage(
                v && v !== password ? "Password tidak sama" : "",
              );
            }}
            passwordErrorMessage={message}
            confirmPasswordErrorMessage={confirmPassMessage}
          />
        )}
      </div>

      {stepState.step !== "verify_otp" && (
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
            {CONFIRM_BUTTON_LABEL[stepState.step][loading ? 1 : 0]}
          </button>
        </div>
      )}
    </form>
  );
}
