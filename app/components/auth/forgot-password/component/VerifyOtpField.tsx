"use client";

import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import OTPInput from "react-otp-input";

export const OTP_EXPIRY_KEY = "9348ujef8werhte4he4";
const OTP_DURATION = 5 * 60 * 1000; // 5 menit

interface Props {
  value: string;
  onChange: (value: string) => void;
  onResendOtp: () => Promise<void>;
  loading?: boolean;
  errorMessage?: string;
}

export default function VerifyOtpField(props: Props) {
  const [expiry, setExpiry] = useState<number | null>(null);

  useEffect(() => {
    const savedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);

    if (savedExpiry) {
      setExpiry(Number(savedExpiry));
    } else {
      const newExpiry = Date.now() + OTP_DURATION;
      localStorage.setItem(OTP_EXPIRY_KEY, String(newExpiry));
      setExpiry(newExpiry);
    }
  }, []);

  const handleResend = async () => {
    await props.onResendOtp();
    const newExpiry = Date.now() + OTP_DURATION;
    localStorage.setItem(OTP_EXPIRY_KEY, String(newExpiry));
    setExpiry(newExpiry);
  };

  if (!expiry) return null;

  return (
    <div className="w-full space-y-4">
      <OTPInput
        value={props.value}
        onChange={(v) => !props.loading && props.onChange(v.toUpperCase())}
        numInputs={4}
        inputType="text"
        renderSeparator={<span style={{ width: "1rem" }}></span>}
        shouldAutoFocus
        inputStyle={{
          border: `1px solid ${props.errorMessage ? "#D22E2E" : "gray"}`,
          borderRadius: "8px",
          width: "54px",
          height: "54px",
          fontSize: "1.25rem",
          color: "#000",
          fontWeight: "bold",
          backgroundColor: props.loading ? "#f5f5f5" : "white",
          cursor: props.loading ? "not-allowed" : "text",
        }}
        renderInput={(innerProps) => (
          <input {...innerProps} disabled={props.loading} />
        )}
        containerStyle={{
          justifyContent: "center",
          marginBottom: "0.5rem",
          opacity: props.loading ? 0.7 : 1,
        }}
      />

      {props.errorMessage && (
        <div className="text-xs text-center text-[#D22E2E]">
          {props.errorMessage}
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        <Countdown
          key={expiry}
          date={expiry}
          renderer={({ minutes, seconds, completed }) => {
            if (completed) {
              return (
                <button
                  onClick={!props.loading ? handleResend : undefined}
                  disabled={props.loading}
                  className="text-primary underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kirim ulang OTP
                </button>
              );
            }

            return (
              <span>
                Kirim ulang dalam {minutes}:
                {seconds.toString().padStart(2, "0")}
              </span>
            );
          }}
        />
      </div>
    </div>
  );
}
