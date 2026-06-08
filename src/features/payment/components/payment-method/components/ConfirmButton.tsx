"use client";

import { Loader2 } from "lucide-react";

interface ConfirmButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  onClick,
  disabled,
  loading,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center justify-center w-full md:w-auto py-3 px-6 rounded-xl text-white font-semibold transition-all duration-300
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#10565C] hover:bg-[#0d494e] shadow-lg hover:shadow-[#10565C]/50"
        }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Memproses...
        </span>
      ) : (
        "Konfirmasi Pembayaran"
      )}
    </button>
  );
};

export default ConfirmButton;
