"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6">
      {/* Tombol Prev */}
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-full transition font-medium ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#10565C] text-white hover:bg-[#0c4348]"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Info Halaman */}
      <span className="text-sm font-semibold text-black">
        Page {page} of {totalPages}
      </span>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-full transition font-medium ${
          page === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#10565C] text-white hover:bg-[#0c4348]"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
