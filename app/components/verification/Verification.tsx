"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifikasiPage() {
  const [noKtp, setNoKtp] = useState("");
  const [noRekening, setNoRekening] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noKtp || !noRekening) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (noKtp.length < 16 || noRekening.length < 10) {
      setError("Format KTP atau Rekening tidak valid.");
      return;
    }

    setError("");

    router.push("/verifikasi/sukses");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center text-[#322783]">
          Verifikasi Akun Anda
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Nomor KTP
            </label>
            <input
              type="text"
              value={noKtp}
              onChange={(e) => setNoKtp(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan nomor KTP"
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Nomor Rekening
            </label>
            <input
              type="text"
              value={noRekening}
              onChange={(e) => setNoRekening(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan nomor rekening"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-[#4CD137] text-white font-semibold hover:bg-[#44bd32]"
          >
            Verifikasi Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
