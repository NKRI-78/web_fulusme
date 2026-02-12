"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatInputRupiah } from "@app/lib/utils";

export default function VerifikasiPage() {
  const [noKtp, setNoKtp] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [noRekening, setNoRekening] = useState("");
  const [pemilikRekening, setPemilikRekening] = useState("");
  const [error, setError] = useState("");
  const [earn, setEarn] = useState("");
  const router = useRouter();

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);

  const [npwpFile, setNpwpFile] = useState<File | null>(null);
  const [npwpPreview, setNpwpPreview] = useState<string | null>(null);

  const [rekeningFile, setRekeningFile] = useState<File | null>(null);
  const [rekeningPreview, setRekeningPreview] = useState<string | null>(null);

  const [dokumenLainFile, setDokumenLainFile] = useState<File | null>(null);
  const [dokumenLainPreview, setDokumenLainPreview] = useState<string | null>(
    null,
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePendapatanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEarn(formatInputRupiah(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!noKtp || !namaRekening || !noRekening || !pemilikRekening) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (noKtp.length < 16 || noRekening.length < 10) {
      setError("Format NIK atau nomor rekening tidak valid.");
      return;
    }

    setError("");

    router.push("/verifikasi/sukses");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-5/6">
        <h1 className="text-xl font-bold mb-6 text-center text-[#322783]">
          Verifikasi Akun Anda
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* === Data Pribadi === */}
            <div>
              <h3 className="text-black mb-4 font-semibold text-sm border-b pb-1 border-gray-400">
                Data Pribadi
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK
                  </label>
                  <input
                    type="text"
                    value={noKtp}
                    onChange={(e) => setNoKtp(e.target.value)}
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan NIK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap (KTP)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan nama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempat, Tanggal Lahir (KTP)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: Bandung, 12 Januari 1990"
                  />
                </div>
              </div>

              <div className="my-4">
                <h3 className="text-black mb-4 font-semibold text-sm border-b pb-1 border-gray-400">
                  Informasi Pekerjaan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: PT Maju Jaya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi/Jabatan
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lama Bekerja
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: 3 tahun"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pendapatan Bulanan
                    </label>
                    <input
                      type="text"
                      value={earn}
                      onChange={handlePendapatanChange}
                      className="w-full px-4 py-2 border text-black rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: Rp 10.000.000"
                    />
                  </div>
                </div>

                {/* === Lampiran === */}
                <div className="my-4">
                  <h3 className="text-black mb-4 font-semibold text-sm border-b pb-1 border-gray-400">
                    Lampiran Dokumen
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fotokopi KTP
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(e, setKtpFile, setKtpPreview)
                        }
                        className="w-full px-4 py-2 border rounded bg-white"
                      />
                      {ktpPreview && (
                        <div className="mt-2">
                          {ktpFile?.type.startsWith("image") ? (
                            <img
                              src={ktpPreview}
                              alt="Preview KTP"
                              className="w-32 rounded"
                            />
                          ) : (
                            <p className="text-sm text-gray-600">
                              {ktpFile?.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fotokopi NPWP
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(e, setNpwpFile, setNpwpPreview)
                        }
                        className="w-full px-4 py-2 border rounded bg-white"
                      />
                      {npwpPreview && (
                        <div className="mt-2">
                          {npwpFile?.type.startsWith("image") ? (
                            <img
                              src={npwpPreview}
                              alt="Preview NPWP"
                              className="w-32 rounded"
                            />
                          ) : (
                            <p className="text-sm text-gray-600">
                              {npwpFile?.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fotokopi Rekening Koran
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            setRekeningFile,
                            setRekeningPreview,
                          )
                        }
                        className="w-full px-4 py-2 border rounded bg-white"
                      />
                      {rekeningPreview && (
                        <div className="mt-2">
                          {rekeningFile?.type.startsWith("image") ? (
                            <img
                              src={rekeningPreview}
                              alt="Preview Rekening"
                              className="w-32 rounded"
                            />
                          ) : (
                            <p className="text-sm text-gray-600">
                              {rekeningFile?.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dokumen Pendukung Lainnya
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            setDokumenLainFile,
                            setDokumenLainPreview,
                          )
                        }
                        className="w-full px-4 py-2 border rounded bg-white"
                      />
                      {dokumenLainPreview && (
                        <div className="mt-2">
                          {dokumenLainFile?.type.startsWith("image") ? (
                            <img
                              src={dokumenLainPreview}
                              alt="Preview Dokumen"
                              className="w-32 rounded"
                            />
                          ) : (
                            <p className="text-sm text-gray-600">
                              {dokumenLainFile?.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === Informasi Bank === */}
            <div>
              <h3 className="text-black mb-4 font-semibold text-sm border-b pb-1 border-gray-400">
                Informasi Bank
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={namaRekening}
                    onChange={(e) => setNamaRekening(e.target.value)}
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: BCA, BRI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={noRekening}
                    onChange={(e) => setNoRekening(e.target.value)}
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan nomor rekening"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    value={pemilikRekening}
                    onChange={(e) => setPemilikRekening(e.target.value)}
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan nama pemilik rekening"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cabang Bank
                  </label>
                  <input
                    type="text"
                    value={pemilikRekening}
                    onChange={(e) => setPemilikRekening(e.target.value)}
                    className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan cabang bank"
                  />
                </div>
              </div>
              <div className="my-4">
                <h3 className="text-black mb-4 font-semibold text-sm border-b pb-1 border-gray-400">
                  Profil Risiko
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tujuan Investasi
                    </label>
                    <select className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Pilih tujuan</option>
                      <option value="pendapatan">Pendapatan Tambahan</option>
                      <option value="jangka-panjang">
                        Pertumbuhan Jangka Panjang
                      </option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Toleransi Risiko
                    </label>
                    <select className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Pilih tingkat risiko</option>
                      <option value="rendah">Rendah</option>
                      <option value="sedang">Sedang</option>
                      <option value="tinggi">Tinggi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pengalaman Investasi
                    </label>
                    <select className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Pilih pengalaman</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                      <option value="Kurang">Kurang</option>
                      <option value="Cukup">Cukup</option>
                      <option value="Banyak">Banyak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pengetahuan tentang Pasar Modal
                    </label>
                    <select className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Pilih pengalaman</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                      <option value="Kurang">Kurang</option>
                      <option value="Cukup">Cukup</option>
                      <option value="Banyak">Banyak</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-[#4CD137] text-white font-semibold hover:bg-[#44bd32]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
