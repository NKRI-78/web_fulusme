"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  passwordValue: string;
  confirmPasswordValue: string;
  passwordOnChange: (value: string) => void;
  confirmPasswordOnChange: (value: string) => void;
  passwordErrorMessage?: string;
  confirmPasswordErrorMessage?: string;
}

export default function ChangePasswordField(props: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="w-full">
        <label className="font-bold text-primary block mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukan Password Baru"
            className="w-full p-3 bg-[#F1F5F9] rounded text-black pr-10"
            value={props.passwordValue}
            onChange={(e) => props.passwordOnChange(e.target.value)}
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

        {props.passwordErrorMessage && (
          <p className="text-red-500 text-[13px] mt-2 line-clamp-2">
            {props.passwordErrorMessage}
          </p>
        )}
      </div>
      <div className="w-full">
        <label className="font-bold text-primary block mb-1">Konfirmasi</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Masukan Password Anda"
            className="w-full p-3 bg-[#F1F5F9] rounded text-black pr-10"
            value={props.confirmPasswordValue}
            onChange={(e) => props.confirmPasswordOnChange(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-500"
            aria-label="Toggle password visibility"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {props.confirmPasswordErrorMessage && (
          <p className="text-red-500 text-[13px] mt-2 line-clamp-2">
            {props.confirmPasswordErrorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
