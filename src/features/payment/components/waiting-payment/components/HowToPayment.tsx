"use client";

import React from "react";

interface CaraPembayaranProps {
  method?: {
    name: string;
    name_code: string;
    logo: string;
  };
  vaNumber?: string;
}

const CaraPembayaran: React.FC<CaraPembayaranProps> = ({
  method,
  vaNumber,
}) => {
  if (!method) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Cara Pembayaran</h3>

      <details open className="group">
        <summary className="flex items-center justify-between cursor-pointer px-2 py-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={method.logo}
              alt={method.name}
              className="h-8 w-8 object-contain"
            />
            <span className="font-medium text-gray-800">{method.name}</span>
          </div>
          <span className="transition-transform group-open:rotate-180 text-gray-500">
            ▼
          </span>
        </summary>

        <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3 text-sm text-gray-700">
          {method.name_code === "gopay" && (
            <ul className="list-decimal list-inside space-y-1">
              <li>
                Buka aplikasi <strong>Gojek</strong> / e-wallet yang mendukung
                QRIS
              </li>
              <li>
                Pilih menu <strong>Bayar</strong>
              </li>
              <li>Scan QR Code yang tersedia di atas</li>
              <li>Pastikan nominal sesuai dengan tagihan</li>
              <li>Konfirmasi & selesaikan pembayaran</li>
            </ul>
          )}

          {method.name_code === "bca" && (
            <>
              <p className="font-semibold text-gray-800">🔹 BCA Mobile</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Buka aplikasi <strong>BCA Mobile</strong>
                </li>
                <li>
                  Pilih menu <strong>m-Transfer</strong>
                </li>
                <li>
                  Pilih <strong>BCA Virtual Account</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Konfirmasi & selesaikan pembayaran</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">🔹 ATM BCA</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Masukkan kartu & PIN</li>
                <li>
                  Pilih menu <strong>Transaksi Lainnya</strong>
                </li>
                <li>
                  Pilih <strong>Transfer → Ke BCA Virtual Account</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Konfirmasi & simpan bukti pembayaran</li>
              </ul>
            </>
          )}

          {method.name_code === "bni" && (
            <>
              <p className="font-semibold text-gray-800">
                🔹 BNI Mobile Banking
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Buka aplikasi <strong>BNI Mobile Banking</strong>
                </li>
                <li>
                  Pilih menu <strong>Transfer</strong>
                </li>
                <li>
                  Pilih <strong>Virtual Account Billing</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal pembayaran</li>
                <li>Konfirmasi transaksi</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">🔹 ATM BNI</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Masukkan kartu & PIN</li>
                <li>
                  Pilih menu <strong>Menu Lain → Transfer</strong>
                </li>
                <li>
                  Pilih <strong>Virtual Account Billing</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Selesaikan transaksi & simpan struk</li>
              </ul>
            </>
          )}

          {method.name_code === "mandiri" && (
            <>
              <p className="font-semibold text-gray-800">
                🔹 Livin’ by Mandiri
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Buka aplikasi <strong>Livin’ by Mandiri</strong>
                </li>
                <li>
                  Pilih menu <strong>Bayar</strong>
                </li>
                <li>
                  Pilih <strong>Multipayment</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal pembayaran</li>
                <li>Konfirmasi & selesaikan transaksi</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">🔹 ATM Mandiri</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Masukkan kartu & PIN</li>
                <li>
                  Pilih menu <strong>Bayar/Beli → Multipayment</strong>
                </li>
                <li>Masukkan nomor perusahaan + VA</li>
                <li>Masukkan nominal pembayaran</li>
                <li>Selesaikan transaksi & simpan bukti</li>
              </ul>
            </>
          )}

          {method.name_code === "bri" && (
            <>
              <p className="font-semibold text-gray-800">🔹 BRImo</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Buka aplikasi <strong>BRImo</strong>
                </li>
                <li>Login dengan akun Anda</li>
                <li>
                  Pilih menu <strong>BRIVA</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal pembayaran</li>
                <li>Konfirmasi & selesaikan transaksi</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">🔹 ATM BRI</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Masukkan kartu & PIN</li>
                <li>
                  Pilih menu <strong>Transaksi Lain</strong>
                </li>
                <li>
                  Pilih <strong>Pembayaran</strong> → <strong>BRIVA</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Selesaikan transaksi & simpan bukti pembayaran</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">
                🔹 Internet Banking BRI
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Login ke <strong>IB BRI</strong>
                </li>
                <li>
                  Pilih menu <strong>Pembayaran</strong>
                </li>
                <li>
                  Pilih <strong>BRIVA</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal pembayaran</li>
                <li>Konfirmasi & selesaikan transaksi</li>
              </ul>
            </>
          )}

          {method.name_code === "cimb" && (
            <>
              <p className="font-semibold text-gray-800">
                🔹 OCTO Mobile (CIMB Niaga)
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Buka aplikasi <strong>OCTO Mobile</strong>
                </li>
                <li>Login dengan akun Anda</li>
                <li>
                  Pilih menu <strong>Pembayaran</strong>
                </li>
                <li>
                  Pilih <strong>Virtual Account</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Konfirmasi & selesaikan transaksi</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">
                🔹 ATM CIMB Niaga
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Masukkan kartu & PIN</li>
                <li>
                  Pilih menu <strong>Pembayaran</strong>
                </li>
                <li>
                  Pilih <strong>Virtual Account</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Selesaikan transaksi & simpan bukti</li>
              </ul>

              <p className="font-semibold text-gray-800 mt-3">
                🔹 CIMB Clicks (Internet Banking)
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>
                  Login ke <strong>CIMB Clicks</strong>
                </li>
                <li>
                  Pilih menu <strong>Pembayaran</strong>
                </li>
                <li>
                  Pilih <strong>Virtual Account</strong>
                </li>
                <li>
                  Masukkan nomor VA:{" "}
                  <span className="font-mono">{vaNumber}</span>
                </li>
                <li>Masukkan nominal pembayaran</li>
                <li>Konfirmasi transaksi</li>
              </ul>
            </>
          )}

          {!["gopay", "bca", "bni", "mandiri", "bri"].includes(
            method.name_code
          ) && (
            <p>
              Silakan lakukan pembayaran melalui{" "}
              <span className="font-semibold">{method.name}</span> sesuai
              instruksi di aplikasi/ATM yang Anda gunakan.
            </p>
          )}
        </div>
      </details>
    </div>
  );
};

export default CaraPembayaran;
