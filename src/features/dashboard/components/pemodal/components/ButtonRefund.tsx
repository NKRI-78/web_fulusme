"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

type Props = {
  trx: {
    payment_status: string;
    paid_at: string; // pastikan ISO date string atau timestamp
    payment_id: string | number;
  };
  setSelectedPaymentId: (id: string) => void;
  setShowRefundStatement: (v: boolean) => void;
};

export default function RefundButton({
  trx,
  setSelectedPaymentId,
  setShowRefundStatement,
}: Props) {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (trx.payment_status !== "PAID" || !trx.paid_at) return;

    const checkExpired = () => {
      const paidAt = new Date(trx.paid_at);
      const now = new Date();
      const diffMs = now.getTime() - paidAt.getTime();
      setIsExpired(diffMs > 2 * 60 * 60 * 1000); // lebih dari 2 jam
    };

    checkExpired(); // cek awal
    const interval = setInterval(checkExpired, 60 * 1000); // cek tiap 1 menit

    return () => clearInterval(interval);
  }, [trx]);

  if (trx.payment_status !== "PAID") return null;

  return (
    <button
      className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md shadow-sm transition duration-200 ${
        isExpired
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
      onClick={() => {
        if (isExpired) return;
        setSelectedPaymentId(trx.payment_id?.toString() ?? "");
        setShowRefundStatement(true);
      }}
      disabled={isExpired}
    >
      <RotateCcw className="w-4 h-4" />
      {isExpired ? "Waktu Habis" : "Kembalikan Dana"}
    </button>
  );
}
