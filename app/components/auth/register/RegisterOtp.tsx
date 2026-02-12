import { getCookie, setCookie } from "@app/helper/cookie";
import { API_BACKEND } from "@app/utils/constant";
import axios from "axios";
import React, { useState } from "react";
import Countdown from "react-countdown";
import OTPInput from "react-otp-input";
import Swal from "sweetalert2";

type AuthResponse = {
  data: any; // sesuaikan dengan shape data Anda
  message?: string;
  status?: string;
};

export default function RegisterOtp({
  onNext,
  onClose,
}: {
  onNext?: () => void;
  onClose?: () => void;
}) {
  // Ambil user dari cookie (sesuaikan sumbernya jika perlu)
  const cookie = getCookie("user");
  const decoded = decodeURIComponent(cookie ?? "");
  let user: any = {};
  try {
    user = JSON.parse(decoded || "{}");
  } catch {
    user = {};
  }

  const [isDisableResendOTP, setIsDisableResendOTP] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [expiry, setExpiry] = useState<number | null>(null); // deadline yang stabil

  const handleResendOTP = async () => {
    try {
      setIsDisableResendOTP(true);
      setExpiry(Date.now() + 60_000); // mulai countdown 60 detik

      const payloads = { val: user?.email };
      await axios.post(`${API_BACKEND}/api/v1/resend-otp`, payloads);
    } catch (err: any) {
      // Jika gagal, kembalikan state supaya user bisa coba lagi
      setIsDisableResendOTP(false);
      setExpiry(null);
      Swal.fire({
        title: "Permintaan Gagal!",
        text: err?.response?.data?.message ?? "Terjadi kesalahan",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleSendOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const payloads = {
        val: user?.email,
        otp,
      };
      const response = await axios.post(
        `${API_BACKEND}/api/v1/verify-otp`,
        payloads,
      );

      const result: AuthResponse = response.data;
      setCookie("user", JSON.stringify(result.data));
      // localStorage.setItem("user", JSON.stringify(result.data));

      setLoading(false);
      Swal.fire({
        title: "Berhasil",
        text: `Akun anda berhasil di verifikasi`,
        icon: "success",
        timer: 3000,
      });
      setOtpErrorMessage("");
      onNext?.();
    } catch (err: any) {
      setLoading(false);
      const msg = err?.response?.data?.message ?? "Terjadi kesalahan";
      setOtpErrorMessage(msg);

      if (msg === "USER_OR_OTP_IS_INVALID") {
        setOtpErrorMessage("OTP tidak sesuai");
      } else {
        Swal.fire({
          title: "Permintaan Gagal!",
          text: msg,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  // Renderer TANPA setState
  interface CountdownRenderProps {
    minutes: number;
    seconds: number;
    completed: boolean;
  }

  const countdownRenderer = ({
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps): JSX.Element | null => {
    if (completed) return null;
    return (
      <span className="text-sm font-medium">
        ({minutes}:{String(seconds).padStart(2, "0")})
      </span>
    );
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden max-w-3xl w-full">
      {/* Form OTP */}
      <div className="w-full md:w-1/2 p-8">
        <div className="text-2xl font-bold mb-4">
          Masukan Kode OTP, untuk Melanjutkan
        </div>
        <p className="text-sm mb-6">
          Masukkan OTP yang dikirimkan melalui email {user?.email ?? "-"} untuk
          memverifikasi akun
        </p>

        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="flex flex-col items-center">
            <OTPInput
              value={otp}
              onChange={(value) => setOtp(value.toUpperCase())}
              numInputs={4}
              inputType="text"
              renderSeparator={<span style={{ width: "1rem" }}></span>}
              shouldAutoFocus={true}
              inputStyle={{
                border: `1px solid ${otpErrorMessage ? "#D22E2E" : "gray"}`,
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
                justifyContent: "center",
                marginBottom: "0.5rem",
              }}
            />
            {otpErrorMessage && (
              <div className="text-xs text-center text-[#D22E2E] mt-1">
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
                  isDisableResendOTP ? "text-slate-400" : "text-[#004EA4]"
                }`}
                onClick={handleResendOTP}
                disabled={isDisableResendOTP}
              >
                Kirim Ulang
              </button>
            </div>

            {isDisableResendOTP && expiry && (
              <Countdown
                key={expiry} // reset internal state Countdown hanya saat expiry berubah
                date={expiry}
                renderer={countdownRenderer}
                onComplete={() => {
                  setIsDisableResendOTP(false);
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-2 mt-2">
            <button
              type="submit"
              className={`focus:ring-2 focus:ring-offset-2 text-sm font-semibold leading-none text-white focus:outline-none border py-4 w-full rounded-lg ${
                otp.length < 4 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3DA956]"
              }`}
              disabled={otp.length < 4 || loading}
            >
              {!loading ? "Kirim" : "Loading..."}
            </button>
          </div>
        </form>
      </div>

      <div className="hidden md:block md:w-1/2">
        <img
          src="/images/modal-auth.webp"
          alt="OTP"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
