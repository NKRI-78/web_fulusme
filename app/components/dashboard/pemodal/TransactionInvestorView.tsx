"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  CircleDollarSign,
  Inbox,
  Eye,
  RotateCcw,
  Loader2,
  Info,
} from "lucide-react";
import axios from "axios";
import { getTransactions } from "@/actions/fetchTransaction";
import { TransactionItem } from "@/app/interfaces/transaction/transaction";
import Pagination from "../../pagination/pagination";
import { getUser } from "@/app/lib/auth";
import GeneralDialog from "../../GeneralDialog";
import { API_BACKEND } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { AnimatedWrapper } from "../../AnimatedWrapper";
import Center from "../../Center";
import CircularProgressIndicator from "../../CircularProgressIndicator";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import { useRouter } from "next/navigation";
import Tooltip from "../../Tooltip";

export default function TransactionInvestorView() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [agreeRefundStatement, setAgreeRefundStatement] =
    useState<boolean>(false);

  // modal untuk dialog [ SEBELUM ] proses refund
  const [showRefundStatement, setShowRefundStatement] = useState(false);
  // modal untuk konfirmasi dialog [ SEBELUM ] proses refund
  const [showConfirmRefundStatement, setShowConfirmRefundStatement] =
    useState(false);

  // modal untuk konfirmasi dialog [ SETELAH ] proses refund
  const [showRefundExlanation, setShowRefundExplanation] = useState(false);

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [processing, setProcessing] = useState(false); // loading state refund

  const totalPages = Math.ceil(totalItems / limit);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  const fetchData = async (p: number) => {
    try {
      setLoading(true);
      const data = await getTransactions(user?.token ?? "", p, limit);
      setTransactions(data.items);
      setTotalItems(data.total_items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData(page);
    }
  }, [page, user]);

  const refundPayment = async (paymentId: string, token: string) => {
    try {
      const res = await axios.post(
        `${API_BACKEND}/api/v1/project/refund`,
        { payment_id: paymentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  return (
    <div className="">
      {loading ? (
        <Center fullParent horizontal vertical className="h-96">
          <CircularProgressIndicator textDescription="Memuat Transaksi" />
        </Center>
      ) : transactions.length === 0 ? (
        <AnimatedWrapper>
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Inbox className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">Belum ada transaksi</p>
            <p className="text-sm">Transaksi Anda akan muncul di sini.</p>
          </div>
        </AnimatedWrapper>
      ) : (
        <>
          <AnimatedWrapper>
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
              <table className="w-full border-collapse text-black">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Project</th>
                    <th className="p-3 text-left">Perusahaan</th>
                    <th className="p-3 text-left">Nominal</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Tanggal</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {transactions.map((trx, idx) => (
                    <tr
                      key={trx.payment_id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 text-left">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="p-3 text-left">{trx.project_title}</td>
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          {trx.company.name == "" ? "-" : trx.company.name}
                        </div>
                      </td>
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <CircleDollarSign className="w-4 h-4 text-green-600" />
                          Rp {trx.amount.toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="p-3 text-left">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            trx.payment_status === "REFUNDED" ||
                            trx.payment_status === "EXPIRED"
                              ? "bg-red-100 text-red-700"
                              : trx.payment_status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {trx.payment_status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {new Date(trx.created_at).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-x-3">
                          <Tooltip label="Lihat Detail">
                            <div
                              className="bg-blue-50 p-1 rounded-md border border-blue-500 cursor-pointer transition-all duration-400 active:scale-[0.98] hover:shadow-sm active:hover:shadow-md"
                              onClick={() => {
                                router.push(
                                  `/waiting-payment?orderId=${trx.payment_id}`,
                                );
                              }}
                            >
                              <Eye size={18} className="text-blue-500" />
                            </div>
                          </Tooltip>
                          {trx.payment_status === "PAID" ? (
                            <Tooltip label="Kembalikan Dana">
                              <div
                                className="bg-red-50 p-1 rounded-md border border-red-500 cursor-pointer transition-all duration-400 active:scale-[0.98] hover:shadow-sm active:hover:shadow-md"
                                onClick={() => {
                                  setSelectedPaymentId(
                                    trx.payment_id.toString() ?? "",
                                  );
                                  setShowRefundStatement(true);
                                }}
                              >
                                <RotateCcw size={18} className="text-red-500" />
                              </div>
                            </Tooltip>
                          ) : trx.payment_status === "REFUNDED" ? (
                            <Tooltip label="Informasi Refund">
                              <div
                                className="bg-green-50 p-1 rounded-md border border-green-500 cursor-pointer transition-all duration-400 active:scale-[0.98] hover:shadow-sm active:hover:shadow-md"
                                onClick={() => {
                                  setShowRefundExplanation(true);
                                }}
                              >
                                <Info size={18} className="text-green-500" />
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="bg-transparent p-1 rounded-md border border-transparent">
                              <Info size={18} className="text-transparent" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedWrapper>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </>
      )}

      {/* Modal Konfirmasi */}
      <GeneralDialog
        isOpen={showRefundStatement}
        onClose={() => {
          setShowRefundStatement(false);
          setSelectedPaymentId(null);
          setAgreeRefundStatement(false);
        }}
      >
        <div className="w-full">
          <p className="text-2xl font-bold text-center mb-6">
            Ajukan Pengembalian Dana
          </p>

          <p className="text-gray-700 text-center mb-6">
            Pengajuan pengembalian dana hanya dapat dilakukan dalam waktu
            maksimal 2 jam setelah transaksi berhasil. Setelah pengajuan
            diterima, proses verifikasi dan pengembalian dana oleh admin
            memerlukan waktu hingga 3×24 jam.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="agreeRefundStatement"
              checked={agreeRefundStatement}
              onChange={(e) => setAgreeRefundStatement(e.target.checked)}
              className="mt-1"
            />
            <label
              htmlFor="agreeRefundStatement"
              className="text-xs text-gray-700"
            >
              Saya telah membaca dan menyetujui ketentuan pengembalian dana di
              atas.
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowRefundStatement(false);
                setSelectedPaymentId(null);
                setAgreeRefundStatement(false);
              }}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={() => {
                setShowRefundStatement(false);
                setShowConfirmRefundStatement(true);
                setAgreeRefundStatement(false);
              }}
              disabled={!agreeRefundStatement}
              className={`px-4 py-2 rounded-md text-white ${
                agreeRefundStatement
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Ajukan
            </button>
          </div>
        </div>
      </GeneralDialog>

      {/* Modal Proses Refund */}
      <GeneralDialog
        isOpen={showConfirmRefundStatement}
        onClose={() => {
          if (!processing) {
            setShowConfirmRefundStatement(false);
            setSelectedPaymentId(null);
          }
        }}
      >
        <div className="w-full">
          <p className="text-2xl font-bold text-center mb-6">
            Konfirmasi Pengajuan Pengembalian Dana
          </p>

          <p className="text-gray-700 text-center mb-6">
            Setelah diajukan, permintaan pengembalian dana akan diproses oleh
            admin. Apakah Anda yakin ingin melanjutkan?
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <button
              disabled={processing}
              onClick={() => {
                setShowConfirmRefundStatement(false);
                setSelectedPaymentId(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Tutup
            </button>
            <button
              disabled={processing}
              onClick={async () => {
                if (!selectedPaymentId) return;
                setProcessing(true);
                try {
                  await refundPayment(selectedPaymentId, user?.token ?? "");

                  // load ulang
                  await fetchData(1);

                  Swal.fire({
                    icon: "success",
                    title: "Pengembalian Dana Berhasil Diajukan",
                    text: "Proses membutuhkan waktu maksimal 3 hari kerja. Silakan periksa rekening Anda secara berkala.",
                    confirmButtonColor: "#13733b",
                  });
                } catch (err: any) {
                  Swal.fire({
                    icon: "error",
                    title: "Gagal Mengajukan Refund",
                    text:
                      err?.message ||
                      "Terjadi kesalahan pada server. Coba lagi nanti.",
                    confirmButtonColor: "#dc2626", // merah
                  });
                } finally {
                  setProcessing(false);
                  setShowConfirmRefundStatement(false);
                  setSelectedPaymentId(null);
                }
              }}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              {processing ? "Memproses..." : "Konfirmasi Pengembalian"}
            </button>
          </div>
        </div>
      </GeneralDialog>

      {/* DIALOG PENJELASAN SETELAH USER BERHASIL REFUND */}
      <GeneralDialog
        isOpen={showRefundExlanation}
        onClose={() => {
          setShowRefundExplanation(false);
        }}
      >
        <div className="w-full">
          <p className="text-2xl font-bold text-center mb-6">
            Pengembalian Dana Sedang Diproses
          </p>

          <p className="text-gray-700 text-center mb-6">
            Permintaan pengembalian dana Anda sedang diproses oleh tim kami.
            Proses verifikasi dan pengembalian dana memerlukan waktu maksimal
            3×24 jam. Mohon cek rekening Anda secara berkala.
          </p>

          <div className="flex justify-center gap-2">
            <button
              onClick={async () => {
                setShowRefundExplanation(false);
              }}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              Mengerti
            </button>
          </div>
        </div>
      </GeneralDialog>
    </div>
  );
}
