"use client";

import { formatRupiah } from "@shared/lib/format/formatRupiah";

type PaymentItem = {
  id: number;
  template_name: string;
  calculated_amount: number;
  template_description?: string;
  percentage?: number;
  fixed_amount?: number;
  project_id?: string;
  template_id?: number;
};

type PaymentDetail = {
  info: PaymentItem[];
  total_amount?: number;
};

export default function DetailPembayaran({
  detail,
}: {
  detail: PaymentDetail | null;
}) {
  if (!detail || !Array.isArray(detail.info) || detail.info.length === 0) {
    return (
      <div className="bg-white border border-[#10565C] rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Detail Pembayaran
        </h3>
        <p className="text-sm text-gray-500">Tidak ada rincian pembayaran.</p>
      </div>
    );
  }

  const computedTotal =
    typeof detail.total_amount === "number" &&
    !Number.isNaN(detail.total_amount)
      ? detail.total_amount
      : detail.info.reduce(
          (s, it) => s + (Number(it.calculated_amount) || 0),
          0
        );

  return (
    <div className="bg-white border border-[#10565C] rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Detail Pembayaran
      </h3>

      <ul className="divide-y divide-gray-200">
        {detail.info.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {item.template_name}
                  </span>

                  {typeof item.percentage === "number" &&
                  item.percentage > 0 ? (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700">
                      {item.percentage}%
                    </span>
                  ) : null}

                  {typeof item.fixed_amount === "number" &&
                  item.fixed_amount > 0 ? (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700">
                      Fixed {formatRupiah(item.fixed_amount)}
                    </span>
                  ) : null}
                </div>

                {item.template_description ? (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.template_description}
                  </p>
                ) : null}
              </div>

              <span className="shrink-0 font-semibold text-[#10565C]">
                {formatRupiah(item.calculated_amount || 0)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="pt-4 mt-1 border-t flex items-center justify-between">
        <span className="text-gray-700 font-semibold">Total</span>
        <span className="text-xl font-bold text-[#10565C]">
          {formatRupiah(computedTotal)}
        </span>
      </div>
    </div>
  );
}
