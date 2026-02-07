"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { API_BACKEND } from "@app/utils/constant";
import { setCookie } from "@/app/helper/cookie";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { AuthResponse } from "@/app/interfaces/auth/auth";

const schema = z
  .object({
    name: z.string().min(2, "Nama wajib diisi"),
    // phone: z.string().min(8, "No. Tlp wajib diisi"),
    phone: z
      .string({
        required_error: "No. Tlp wajib diisi",
      })
      .min(10, "No. Tlp minimal 10 digit")
      .max(13, "No. Tlp maksimal 13 digit"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormSchema = z.infer<typeof schema>;

export default function RegisterForm({
  onNext,
  onClose,
}: {
  onNext?: () => void;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(schema),
  });
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/\D/g, "")
      .slice(0, 13);
  };

  const onSubmit = async (data: RegisterFormSchema) => {
    setLoading(true);

    const payload = {
      fullname: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };

    setLoading(true);
    try {
      console.log("Data yang dikirim:", data);

      const response = await axios.post(
        `${API_BACKEND}/api/v1/auth/register`,
        payload,
      );

      const result: AuthResponse = response.data;

      console.log("Respon backend:", result.data);
      setCookie("user", JSON.stringify(result.data));
      onNext?.();
    } catch (err: any) {
      console.error("Failed to fetch:", err);

      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const msg =
            err.response.data?.message || JSON.stringify(err.response.data);
          if (msg === "USER_ALREADY_EXIST") {
            errorMessage =
              "Email sudah digunakan. Silakan masuk atau gunakan email lain.";
          }
        } else if (err.request) {
          errorMessage = "Tidak ada respon dari server.";
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = err.message || String(err);
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden max-w-3xl w-full">
        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-2xl font-bold mb-4">
            Silakan Buat Akun Terlebih Dahulu
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name", {
                  onChange: (e) => {
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/\b\w/g, (char: string) => char.toUpperCase());
                    e.target.value = value;
                  },
                })}
                type="text"
                placeholder="Nama Lengkap"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              {errors.name ? (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              ) : (
                <p className="text-[11px] text-gray-500 mt-1">
                  <span className="text-red-500">* </span> Nama harus sesuai
                  dengan nama yang tertera di KTP
                </p>
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="No. Tlp"
                className="w-full border border-gray-300 px-4 py-2 rounded"
                onInput={handleNumberInput}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Alamat Email"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Konfirmasi Password"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-3 text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                name="disclamer"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="form-checkbox text-[#4821C2]"
              />
              <label>
                <span className="text-sm font-medium text-gray-700">
                  Dengan mendaftar, saya menyetujui{" "}
                  <span
                    onClick={() => setShowModal(true)}
                    className="text-sm text-blue-500 hover:text-blue-700 font-bold underline cursor-pointer"
                  >
                    pernyataan
                  </span>{" "}
                  kebijakan privasi platform ini, dan memahami risiko yang
                  mungkin timbul dalam penggunaannya.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isChecked || loading}
              className={`w-full py-2 rounded ${
                !isChecked || loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {loading ? "Mendaftarkan..." : "Buat Akun"}
            </button>
          </form>
        </div>

        {/* Gambar */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/images/modal-auth.png"
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative max-h-[37rem] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Disclaimer</h2>
            <p className="text-sm text-gray-700 mb-1">
              Pembelian saham bisnis merupakan aktivitas beresiko tinggi. Anda
              berinvestasi pada bisnis yang mungkin saja mengalami kenaikan dan
              penurunan kinerja bahkan mengalami kegagalan. Harap menggunakan
              pertimbangan ekstra dalam membuat keputusan untuk membeli saham.
              Ada kemungkinan Anda tidak bisa menjual kembali saham bisnis
              dengan cepat. Lakukan diversifikasi investasi, hanya gunakan dana
              yang siap Anda lepaskan (affors to loose) dan atau disimpan dalam
              jangka panjang. FuLusme tidak memaksa pengguna untuk membeli saham
              bisnis sebagai investasi. Semua keputusan pembelian merupakan
              keputusan independen oleh pengguna.
            </p>
            <p className="text-sm text-gray-700 mb-1">
              FuLusme bertindak sebagai penyelenggara urun dana yang
              mempertemukan pemodal dan penerbit, bukan sebagai pihak yang
              menjalankan bisnis (Penerbit). Otoritas Jasa Keuangan bertindak
              sebagai regulator dan pemberi izin, bukan sebagai penjamin
              investasi. Keputusan pembelian saham, sepenuhnya merupakan hak dan
              tanggung jawab Pemodal (investor). Dengan membeli saham di FuLusme
              berarti Anda sudah menyetujui seluruh syarat dan ketentuan serta
              memahami semua risiko investasi termasuk resiko kehilangan
              sebagian atau seluruh modal.
            </p>
            <p className="text-sm text-gray-700 mb-1">
              “OTORITAS JASA KEUANGAN TIDAK MEMBERIKAN PERNYATAAN MENYETUJUI
              ATAU TIDAK MENYETUJUI EFEK INI, TIDAK JUGA MENYATAKAN KEBENARAN
              ATAU KECUKUPAN INFORMASI DALAM LAYANAN URUN DANA INI. SETIAP
              PERNYATAAN YANG BERTENTANGAN DENGAN HAL TERSEBUT ADALAH PERBUATAN
              MELANGGAR HUKUM.”
            </p>
            <p className="text-sm text-gray-700 mb-1">
              “INFORMASI DALAM LAYANAN URUN DANA INI PENTING DAN PERLU MENDAPAT
              PERHATIAN SEGERA. APABILA TERDAPAT KERAGUAN PADA TINDAKAN YANG
              AKAN DIAMBIL, SEBAIKNYA BERKONSULTASI DENGAN PENYELENGGARA.”
            </p>
            <p className="text-sm text-gray-700 mb-1">
              “PENERBIT DAN PENYELENGGARA, BAIK SENDIRI-SENDIRI MAUPUN
              BERSAMA-SAMA, BERTANGGUNG JAWAB SEPENUHNYA ATAS KEBENARAN SEMUA
              INFORMASI YANG TERCANTUM DALAM LAYANAN URUN DANA INI.”
            </p>
            <div>
              <span className="text-sm font-bold">Risiko Usaha</span>
              <p className="text-sm text-gray-700 mb-1">
                Risiko usaha merupakan sesuatu yang tidak dapat dihindari dalam
                suatu kegiatan usaha. Sejumlah risiko usaha yang dapat terjadi
                adalah penutupan kegiatan bisnis secara sementara ataupun
                permanen sebagai dampak dari adanya bencana alam dan/atau
                keadaan lainnya
              </p>
            </div>
            <div>
              <span className="text-sm font-bold">
                Risiko Kerugian Investasi
              </span>
              <p className="text-sm text-gray-700 mb-1">
                Setiap investasi memiliki tingkat risiko yang bervariasi,
                seperti tidak terkumpulnya dana investasi selama proses
                pengumpulan dana dan/atau proyek yang dijalankan tidak
                menghasilkan keuntungan sesuai dengan yang diharapkan
              </p>
            </div>
            <div>
              <span className="text-sm font-bold">
                Risiko Kekurangan Likuiditas
              </span>
              <p className="text-sm text-gray-700 mb-1">
                Investasi memungkinkan tidak likuid karena efek bersifat ekuitas
                yang ditawarkan tidak terdaftar di bursa efek atau belum
                dilaksanakan perdagangan efek (pasar sekunder). Hal ini berarti
                ada kemungkinan tidak dapat dengan mudah menjual saham miliknya
                kepada pihak lain.
              </p>
            </div>
            <div>
              <span className="text-sm font-bold">
                Risiko Kelangkaan Pembagian Dividen dan/atau Dilusi Kepemilikan
                Saham
              </span>
              <p className="text-sm text-gray-700 mb-1">
                Pemodal yang melakukan investasi Saham, memiliki hak untuk
                mendapat dividen sesuai dengan jumlah kepemilikan yang dimiliki
                yang dibagikan oleh Penerbit melalui Penyelenggara secara
                periodik. Namun, kelangkaan dalam pembagian dividen dimungkinkan
                terjadi karena kinerja bisnis yang diinvestasikan tidak berjalan
                sebagaimana mestinya serta berpotensi terdilusi kepemilikan
                saham karena bertambahnya total saham yang beredar atau
                ditawarkan.
              </p>
            </div>
            <div>
              <span className="text-sm font-bold">
                Risiko Kegagalan Sistem Elektronik
              </span>
              <p className="text-sm text-gray-700 mb-1">
                FuLusme sudah menerapkan sistem elektronik dan keamanan data
                yang handal. Namun gangguan sistem teknologi informasi dan
                kegagalan sistem mungkin saja tetap terjadi. Untuk mencegah hal
                tersebut terjadi.
              </p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
