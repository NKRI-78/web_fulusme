"use client";

import React, { useEffect } from "react";
import { PaymentMethodType } from "./types";

interface TransactionSummaryProps {
  method: PaymentMethodType;
  baseAmount: number;
  onTotalChange?: (total: number) => void; // 🔹 callback ke parent
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  method,
  baseAmount,
  onTotalChange,
}) => {
  const subtotal = baseAmount;
  const fee = method.fee;
  const total = subtotal + fee;

  // kirim total ke parent setiap kali berubah
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [total, onTotalChange]);

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-[#10565C] px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-white">
          Rincian Transaksi
        </h2>
      </div>
      <div className="px-4 py-4 space-y-2 text-sm">
        {row(
          "Tanggal",
          new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        )}
        {row("Metode Pembayaran", method.name)}
        {row("Nominal Investasi", `Rp${subtotal.toLocaleString("id-ID")}`)}
        {row("Biaya Admin", `Rp${fee.toLocaleString("id-ID")}`)}

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-gray-200">
          <span className="text-gray-900 font-semibold">Total</span>
          <span className="text-lg font-bold text-[#10565C]">
            Rp{total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
