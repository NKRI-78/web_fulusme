"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface FundingProgressCardProps {
  title?: string;
  target: number;
  paid: number;
  reserved: number;
  icon?: React.ReactNode;
}

export default function FundingProgressCard({
  title = "Progress Pendanaan Proyek",
  target,
  paid,
  reserved,
  icon = <BarChart3 className="w-5 h-5 text-[#10565C]" />,
}: FundingProgressCardProps) {
  const total = paid + reserved;
  const percent = Math.min(100, (total / target) * 100);

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Target</span>
          <span className="font-medium text-gray-800">
            Rp {target.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sudah Cair</span>
          <span className="font-medium text-gray-800">
            Rp {paid.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Reserved</span>
          <span className="font-medium text-gray-800">
            Rp {reserved.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Progress Bar + Tooltip */}
      <div className="mt-3 relative group">
        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-3 bg-gradient-to-r from-[#10565C] to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-20 z-50 invisible group-hover:visible transition bg-black/90 text-white text-xs rounded-md px-3 py-2 shadow-lg whitespace-nowrap drop-shadow-lg">
          <p className="text-white">
            <span className="font-semibold">Paid:</span> Rp{" "}
            {paid.toLocaleString("id-ID")}
          </p>
          <p className="text-white">
            <span className="font-semibold">Reserved:</span> Rp{" "}
            {reserved.toLocaleString("id-ID")}
          </p>
          <p className="text-white">
            <span className="font-semibold">Total:</span> Rp{" "}
            {total.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Percent */}
        <p className="text-right text-xs text-gray-500 mt-1">
          {percent.toFixed(2)}% dari target
        </p>
      </div>
    </div>
  );
}
