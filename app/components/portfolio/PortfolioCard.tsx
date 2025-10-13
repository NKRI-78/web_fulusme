import { InvestorDataPortfolio } from "@/app/interfaces/investor/IInvestorData";
import { formatRupiah } from "@/app/lib/utils";
import Link from "next/link";
import React from "react";

interface PortfolioCardProps {
  data: InvestorDataPortfolio;
  hasRekeningEfek?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  data,
  hasRekeningEfek = false,
}) => {
  const {
    project_title,
    target_amount,
    user_paid_idr,
    project_paid_amount_idr,
    recent_transactions,
  } = data;

  const percentage = ((user_paid_idr / target_amount) * 100).toFixed(3);
  const totalTransactions = recent_transactions?.length || 0;

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col justify-between border border-[#13733b] hover:shadow-md transition">
      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-800">{project_title}</h3>

      {/* Progress */}
      <div className="mt-3">
        <p className="text-xs text-gray-600">
          {formatRupiah(project_paid_amount_idr)} dari{" "}
          {formatRupiah(target_amount)}
        </p>
      </div>

      {/* Allocation */}
      {!hasRekeningEfek && (
        <p className="text-xs text-gray-600 mt-1">
          Alokasi {percentage}% dari total limit Anda
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* User Investment */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">Investasi Anda:</span>
        <span className="text-sm font-semibold text-[#13733b]">
          {formatRupiah(user_paid_idr)}
        </span>
      </div>

      {/* Transaction Count */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-700">Jumlah Transaksi:</span>
        <span className="text-sm font-semibold text-gray-800">
          {totalTransactions}x
        </span>
      </div>
    </div>
  );
};

export default PortfolioCard;
