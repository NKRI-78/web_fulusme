"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import OTPInput from "react-otp-input";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Countdown from "react-countdown";
import { getCookie, setCookie } from "@/app/helper/cookie";
import { AuthDataResponse } from "@/app/interfaces/auth/auth";

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
}

export const registerCombinedSchema = z.object({
  fullName: z.string().min(1, "Nama Lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  phone: z
    .string()
    .min(10, "Nomor handphone minimal 10 digit")
    .regex(/^[0-9]+$/, "Nomor handphone harus berupa angka"),
});

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const RoleModal: React.FC<RoleModalProps> = ({ open, onClose }) => {
  const cookie = getCookie("user");
  const decoded = decodeURIComponent(cookie ?? "");
  const user = JSON.parse(decoded);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<
    "select" | "penerbit" | "pemodal" | "otpRegister"
  >("select");
  const [showPassword, setShowPassword] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isDisableResendOTP, setIsDisableResendOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(registerCombinedSchema),
  });

  const onSubmitRegister: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        fullname: data.fullName,
        email: data.email,
        phone: data.phone,
        role: step == "pemodal" ? "1" : "2",
        password: data.password,
      };

      const response = await axios.post(
        `${API_BACKEND}/api/v1/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result: AuthDataResponse = response.data;

      console.log("TOKEN ", result.token);
      await axios.post(
        `${API_BACKEND}/api/v1/resend-otp`,
        { val: data.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${response.data["data"]["otp"]}`, // Ganti yourToken dengan token-mu
          },
        },
      );

      console.log("✅ Success:", response.data["data"]);
      setCookie("user", JSON.stringify(response.data["data"]));
      setStep("otpRegister");
    } catch (error: any) {
      console.error("❌ Gagal submit:", error);
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsDisableResendOTP(true);
      const payloads = {
        email: user.email,
        type: "SENDING_OTP",
      };
      const { data } = await axios.post(
        `${API_BACKEND}/api/v1/verify-otp`,
        payloads,
      );
    } catch (err: any) {
      setIsLoading(false);
      Swal.fire({
        title: "Permintaan Gagal!",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleSendOTP = async (event: any) => {
    event.preventDefault();
    try {
      const payloads = {
        email: user.email,
        type: "VERIFIED",
        otp,
      };
      const { data } = await axios.post(
        `${API_BACKEND}/api/v1/auth/verify-email`,
        payloads,
      );

      setOtpErrorMessage("");
      window.location.reload();
    } catch (err: any) {
      setOtpErrorMessage(err.response.data.message);
      // Swal.fire({
      //   title: "Permintaan Gagal!",
      //   text: err.response.data.message,
      //   icon: "error",
      //   confirmButtonText: "Ok",
      // });
      console.log(err);
    }
  };

  // ✅ coundownTimerCompletion
  interface CountdownRenderProps {
    minutes: number;
    seconds: number;
    completed: boolean;
  }

  const countdownTimerCompletion = ({
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps): JSX.Element | string => {
    if (completed) {
      setIsDisableResendOTP(false);
      return "";
    } else {
      return (
        <span className="text-sm font-medium">
          ({minutes}:{seconds})
        </span>
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl overflow-y-scroll h-[700px] max-w-3xl w-full relative flex flex-col md:flex-row">
        {step !== "select" && (
          <button
            onClick={() => setStep("select")}
            className="absolute top-4 left-4 text-gray-600"
          >
            ←
          </button>
        )}
        <button
          onClick={() => {
            onClose();
            setStep("select");
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          X
        </button>
        {step === "select" && (
          <>
            <div className="p-8 md:w-1/2 bg-white z-20">
              <h2 className="text-3xl text-black font-bold mb-6">
                Pilih Peran Anda <br /> untuk Memulai
              </h2>

              <div className="space-y-6">
                <div
                  onClick={() => {
                    reset();
                    setStep("penerbit");
                  }}
                  className="border border-purple-600 rounded-xl p-4 hover:bg-purple-50 cursor-pointer"
                >
                  <h3 className="text-purple-700 font-bold text-lg">
                    Penerbit
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Anda tertarik mendukung dan membiayai ide bisnis yang
                    menjanjikan. Temukan proyek potensial, kelola investasi
                    Anda, dan bantu wujudkan inovasi.
                  </p>
                </div>

                <div
                  onClick={() => {
                    reset();
                    setStep("pemodal");
                  }}
                  className="border border-green-600 rounded-xl p-4 hover:bg-green-50 cursor-pointer"
                >
                  <h3 className="text-green-700 font-bold text-lg">Pemodal</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Anda memiliki ide atau bisnis yang siap dikembangkan. Cari
                    dukungan finansial dan bangun koneksi dengan pemodal.
                  </p>
                </div>
              </div>

              <p className="text-1xl text-gray-500 mt-6">
                Pilihan Anda akan menentukan alur dan fitur yang tersedia dalam
                platform.
              </p>
            </div>

            <div className="md:w-1/2 relative hidden md:block">
              <img
                src="/images/modal-auth.png"
                alt="Professional Woman"
                className="object-cover h-full w-full"
              />
            </div>
          </>
        )}

        {step === "penerbit" && (
          <div className="w-full flex flex-col items-center justify-center bg-white">
            {/* Judul */}
            <h1 className="text-3xl font-semibold text-indigo-900 mb-2">
              Selamat Datang{" "}
              <span className="font-bold text-indigo-900">di CaptBridge,</span>
            </h1>
            <p className="text-indigo-900 mb-8 text-start">
              Silahkan berinvestasi dengan <br /> Daftar diri anda terlebih
              dahulu
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmitRegister)}
              className="w-full p-10"
            >
              <div className="mb-4">
                <label className="block text-indigo-900 font-semibold mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-indigo-900 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="font-bold text-[#321B87] block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
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
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-indigo-900 font-semibold mb-1">
                  Nomor Handphone
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-indigo-900 text-sm">
                  Butuh Pertanyaan?{" "}
                  <a href="#" className="font-bold">
                    Hubungi Kami
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-500 text-white px-8 py-3 rounded-full font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Loading..." : "Lanjutkan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "pemodal" && (
          <div className="w-full flex flex-col items-center justify-center bg-white">
            {/* Judul */}
            <h1 className="text-3xl font-semibold text-indigo-900 mb-2">
              Selamat Datang{" "}
              <span className="font-bold text-indigo-900">di CaptBridge,</span>
            </h1>
            <p className="text-indigo-900 mb-8 text-start">
              Silahkan berinvestasi dengan <br /> Daftar diri anda terlebih
              dahulu
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmitRegister)}
              className="w-full p-10"
            >
              <div className="mb-4">
                <label className="block text-indigo-900 font-semibold mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-indigo-900 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="font-bold text-[#321B87] block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
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
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-indigo-900 font-semibold mb-1">
                  Nomor Handphone
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full p-3 rounded-lg text-black bg-indigo-50 focus:outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-indigo-900 text-sm">
                  Butuh Pertanyaan?{" "}
                  <a href="#" className="font-bold">
                    Hubungi Kami
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-500 text-white px-8 py-3 rounded-full font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Loading..." : "Lanjutkan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "otpRegister" && (
          <>
            <div className="w-full px-8 py-6 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-y-4 font-inter text-center">
                <h2 className="font-bold text-lg text-black/90">
                  Masukkan OTP
                </h2>
                <p className="text-sm text-center mt-3 text-black/50 font-medium">
                  Masukkan OTP yang dikirimkan melalui email untuk memverifikasi
                  akun
                </p>
              </div>
              <div className="font-inter mt-6">
                <form
                  onSubmit={handleResendOTP}
                  className="flex flex-col gap-y-6"
                >
                  <div className="my-4">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      inputType="text"
                      renderSeparator={<span style={{ width: "1rem" }}></span>}
                      shouldAutoFocus={true}
                      inputStyle={{
                        border: `1px solid ${
                          otpErrorMessage ? "#D22E2E" : "gray"
                        }`,
                        borderRadius: "8px",
                        width: "54px",
                        height: "54px",
                        fontSize: "1.25rem",
                        color: "#000",
                        fontWeight: "bold",
                        backgroundColor: "white",
                      }}
                      renderInput={(props) => <input {...props} />}
                      containerStyle={{
                        gap: "1rem",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    />
                    {otpErrorMessage && (
                      <div className="text-xs text-center text-[#D22E2E]">
                        {otpErrorMessage}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-x-2">
                    <div className="flex justify-between w-full">
                      <h6 className="text-sm">Tidak dapat kode?</h6>
                      <button
                        type="button"
                        className={`text-sm font-medium ${
                          isDisableResendOTP
                            ? "text-slate-400"
                            : "text-[#004EA4]"
                        }`}
                        onClick={handleResendOTP}
                        disabled={isDisableResendOTP}
                      >
                        Kirim Ulang
                      </button>
                    </div>
                    {isDisableResendOTP && (
                      <Countdown
                        date={Date.now() + 60000}
                        renderer={countdownTimerCompletion}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-y-2 mt-2">
                    <button
                      type="submit"
                      className={`focus:ring-2 focus:ring-offset-2 text-sm font-semibold leading-none text-white focus:outline-none border py-4 w-full rounded-lg ${
                        otp.length < 4
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#3DA956]"
                      }`}
                      disabled={otp.length < 4}
                    >
                      {!loading ? "Kirim" : "Loading..."}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoleModal;
