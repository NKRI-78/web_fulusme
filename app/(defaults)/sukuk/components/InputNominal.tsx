"use client";

import { getUser } from "@/app/lib/auth";
import { fetchDashboardClient } from "@/redux/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface InputNominalLotProps {
  label?: string;
  unitPrice: number; // harga per lot
  stokLot: number;
  lembarPerLot: number; // harga per lot
  totalUnit: number; // total lot tersedia
  minInvest: number; // minimal nominal investasi
  quota?: number; // sisa kuota IDR
  roi?: number;
  onConfirm?: (val: Record<string, any>) => Promise<void> | void;
}

export default function InputNominalLot({
  label = "Nominal Investasi",
  unitPrice,
  totalUnit,
  stokLot,
  minInvest,
  lembarPerLot,
  quota,
  roi,
  onConfirm,
}: InputNominalLotProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: dashboardData } = useSelector(
    (state: RootState) => state.dashboard,
  );

  const user = getUser();

  // ✅ cek status user
  const rekEfek = dashboardData?.rek_efek === true;
  // const isInstitusi = dashboardData?.is_institusi === true;

  // 📦 state
  const [lot, setLot] = useState<number>(1);
  const [value, setValue] = useState<string>("");
  const [numericValue, setNumericValue] = useState<number>(minInvest);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num);

  // 🔁 fetch dashboard user
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchDashboardClient(user.token));
    }
  }, [dispatch]);

  // sinkronisasi nominal ketika lot berubah
  useEffect(() => {
    const nominal = lot * minInvest;
    setNumericValue(nominal);
    setValue(formatRupiah(nominal));
  }, [lot, minInvest]);

  // 🔹 handle perubahan nominal manual
  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw);
    const newLot = Math.floor(numeric / minInvest);

    if (numeric < minInvest) {
      setError(`Minimal investasi Rp${formatRupiah(minInvest)}`);
    } else if (!rekEfek && quota && numeric > quota) {
      setError(`Melebihi kuota Rp${formatRupiah(quota)}!`);
    } else if (newLot > totalUnit) {
      setError(`Maksimal ${totalUnit} lot (stok penuh)`);
    } else {
      setError(null);
      setLot(newLot);
    }

    setValue(formatRupiah(numeric));
    setNumericValue(numeric);
  };

  // 🔹 handle perubahan lot (+/-)
  const handleLotChange = (newLot: number) => {
    const nominal = newLot * minInvest;

    if (nominal < minInvest) {
      return setError(`Minimal investasi Rp${formatRupiah(minInvest)}`);
    }
    if (!rekEfek && quota && nominal > quota) {
      return setError(`Melebihi kuota Rp${formatRupiah(quota)}!`);
    }
    if (newLot > totalUnit) {
      return setError(`Maksimal ${totalUnit} lot tersedia`);
    }

    setError(null);
    setLot(newLot);
  };

  const handleConfirm = async () => {
    if (!error && onConfirm) {
      try {
        setLoading(true);
        await onConfirm({ price: numericValue, total_lot: lot });
      } finally {
        setLoading(false);
      }
    }
  };

  // progress bar
  const percent =
    !rekEfek && quota ? Math.min((numericValue / quota) * 100, 100) : 0;

  const sisaLot = Math.max(totalUnit - lot, 0);
  const sisaNominal = sisaLot * minInvest;

  return (
    <div className="w-full p-5 space-y-5">
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}

      {/* 🔹 Flex Kiri-Kanan */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        {/* KIRI: JUMLAH Lot */}
        <div className="">
          <p className="text-sm font-medium text-gray-700 mb-2">Jumlah Lot</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLotChange(lot - 1)}
              disabled={lot <= 1}
              className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
            >
              −
            </button>

            <input
              type="text"
              inputMode="numeric"
              value={lot === 0 ? "" : lot}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  // ✅ kalau dikosongkan, biarkan kosong
                  setLot(0);
                  setError(null);
                  return;
                }

                const num = Number(val);
                if (isNaN(num)) return;

                const minLot = 1;

                if (num < minLot) {
                  setError(`Minimal ${minLot} Lot untuk investasi ini`);
                  setLot(num);
                  return;
                }

                // ✅ validasi kuota & batas maksimal
                if (num > stokLot) {
                  setError(`Maksimal ${stokLot} Lot tersedia`);
                  setLot(stokLot);
                  return;
                }

                setError(null);
                setLot(num);
              }}
              onBlur={() => {
                const minLot = 1;
                // kalau dikosongkan, auto reset ke minimal
                if (lot === 0 || lot < minLot) {
                  setLot(minLot);
                  setError(null);
                }
              }}
              className={`w-24 text-center border rounded-lg py-2 font-semibold text-gray-900 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />

            <button
              onClick={() => handleLotChange(lot + 1)}
              className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              +
            </button>
          </div>

          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {/* KANAN: NOMINAL INVESTASI */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Nominal Investasi
          </p>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700 font-semibold">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              disabled
              onChange={handleNominalChange}
              className={`w-full h-10 rounded-xl border pl-12 pr-4 py-5 font-semibold text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#10565C] focus:border-[#10565C] ${
                error ? "border-red-500" : "border-gray-500"
              }`}
              placeholder="Masukkan nominal"
            />
          </div>
        </div>
      </div>

      {/* INFO LOT & HARGA */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          Informasi Unit Investasi
        </p>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>1 Lot</span>
          <span className="font-semibold">{lembarPerLot} Lembar</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>Harga per Lembar</span>
          <span className="font-semibold">Rp {formatRupiah(unitPrice)}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>Jumlah Lot yang bisa dibeli</span>
          <span className="font-semibold">{formatRupiah(stokLot)} Lot</span>
        </div>

        <div className="pt-2 border-t text-xs text-gray-500">
          Nominal investasi dihitung berdasarkan jumlah lot yang Anda pilih.
        </div>
      </div>

      {/* PROGRESS KUOTA */}
      {!rekEfek && quota && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-800">
            Simulasi Kuota Investasi Saya
          </p>

          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Kuota Sekarang</span>
            <span className="font-semibold">
              Rp {quota.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex gap-x-1">
              <span>Sisa Kuota</span>
              <span>Rp {formatRupiah(quota - numericValue)}</span>
            </div>
            <div className="flex gap-x-1">
              <span>Terpakai</span>
              <span>{percent.toFixed(0)}%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${
                percent >= 100 ? "bg-red-500" : "bg-[#10565C]"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* STATUS USER */}
      {rekEfek && (
        <p className="text-sm text-green-600 font-medium">
          Rekening Efek Terverifikasi — investasi tanpa batas kuota.
        </p>
      )}
      {/* {isInstitusi && (
        <p className="text-sm text-green-600 font-medium">
          Pemodal Perusahaan Terverifikasi — investasi tanpa batas kuota.
        </p>
      )} */}

      {/* ROI */}
      {roi && (
        <div className="text-center bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="text-xs text-green-700 font-medium">
            Estimasi ROI {roi}%
          </p>
          <p className="text-lg font-bold text-green-700">
            Rp{formatRupiah((numericValue * roi) / 100)}
          </p>
        </div>
      )}

      {/* CHECKBOX */}
      <div className="flex items-center gap-6">
        <input
          id="agree"
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="h-4 w-4 text-[#10565C] border-gray-300 rounded"
        />
        <label htmlFor="agree" className="text-sm text-gray-700">
          Keputusan investasi sepenuhnya ada di tangan Anda. Kami tidak
          bertanggung jawab atas kerugian dari investasi ini.
        </label>
      </div>

      {/* TOMBOL KONFIRMASI */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!numericValue || !!error || !checked || loading}
        className={`w-full py-4 rounded-xl text-white font-semibold text-base 
          transition flex items-center justify-center gap-2
          ${
            !numericValue || !!error || !checked || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#10565C] hover:bg-[#0d474f]"
          }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          "Konfirmasi Investasi"
        )}
      </button>
    </div>
  );
}
