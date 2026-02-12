"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Copy,
  FileUp,
  FileText,
  Upload,
  X,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { formatRupiah } from "@/app/utils/formatRupiah";
import { useRouter } from "next/navigation";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { getUser } from "@/app/lib/auth";
import DetailPembayaran from "../components/DetailPembayaran";
import { uploadMediaService } from "@/app/helper/mediaService";

/* =========================
 *  TYPES
 * ========================= */
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
type InboxDetail = {
  inboxId: string;
  title: string;
  status: string;
  createdAt: string;
  projectId: string;
  detail: PaymentDetail | null;
};

/* =========================
 *  PARSER: tangani string/object & double-encoded
 * ========================= */
function parseDetail(raw: unknown): PaymentDetail | null {
  const tryJson = (x: unknown) => {
    if (typeof x !== "string") return x;
    const s = x.trim();
    if (!s) return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  // object langsung
  if (raw && typeof raw === "object") return finalize(raw as any);

  // parse 1x
  const once = tryJson(raw);
  if (once && typeof once === "object") return finalize(once as any);

  // parse 2x (double-encoded)
  const twice = tryJson(once);
  if (twice && typeof twice === "object") return finalize(twice as any);

  return null;

  function finalize(d: any): PaymentDetail {
    const info = Array.isArray(d?.info) ? d.info : [];
    const total =
      typeof d?.total_amount === "number"
        ? d.total_amount
        : info.reduce(
            (s: number, it: any) => s + (Number(it?.calculated_amount) || 0),
            0,
          );
    return { info, total_amount: total };
  }
}

/* =========================
 *  VALIDASI FILE (Zod)
 * ========================= */
const ACCEPT_TYPES = ["image/jpeg", "image/png"] as const;
const MAX_SIZE_MB = 5;

const proofSchema = z
  .custom<File>((v) => v instanceof File, {
    message: "File bukti wajib diunggah.",
  })
  .refine(
    (file) => ACCEPT_TYPES.includes(file.type as (typeof ACCEPT_TYPES)[number]),
    {
      message: "Tipe file tidak didukung (JPG/PNG).",
    },
  )
  .refine((file) => file.size <= MAX_SIZE_MB * 1024 * 1024, {
    message: `Ukuran file maksimal ${MAX_SIZE_MB}MB.`,
  });

const schema = z.object({ proof: z.union([proofSchema, z.any()]) as any }); // agar RHF init tidak error
type FormValues = z.infer<typeof schema>;

/* =========================
 *  PROPS
 * ========================= */
type Props = {
  inboxId: string;
  bankName?: string;
  accountNumber?: string;
  accountOwner?: string;
  logoSrc?: string;
};

export default function PembayaranBCAWithDetail({
  inboxId,
  bankName = "Bank BCA",
  accountNumber = "5855319788",
  accountOwner = "PT Fintek Andalan Solusi Teknologi",
  logoSrc = "/images/bank/bca-logo.png",
}: Props) {
  /* ----------------- state umum ----------------- */
  const [copiedRek, setCopiedRek] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [loading, setLoading] = useState(true);
  const [headerTitle, setHeaderTitle] = useState(
    "Pembayaran Administrasi Proyek",
  );
  const [headerStatus, setHeaderStatus] = useState<string>("");
  const [detail, setDetail] = useState<PaymentDetail | null>(null);

  const router = useRouter();

  /* ----------------- fetch detail by id (axios + Bearer) ----------------- */
  useEffect(() => {
    (async () => {
      try {
        const user = getUser();
        if (!user?.token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(
          `${API_BACKEND}/api/v1/inbox/detail/${inboxId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );

        // Sesuaikan dengan envelope respons yang kamu kirim
        const json = res.data;
        setHeaderTitle(json?.data?.title ?? "Pembayaran Administrasi Proyek");
        setHeaderStatus(json?.data?.status ?? "");

        const parsed = parseDetail(json?.data?.data);
        setDetail(parsed);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [inboxId]);

  const totalPrice =
    detail?.total_amount ??
    (detail?.info || []).reduce(
      (s, it) => s + (Number(it.calculated_amount) || 0),
      0,
    );

  /* ----------------- RHF ----------------- */
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: { proof: undefined },
  });

  const file = watch("proof");
  const isPDF = useMemo(() => file && file.type === "application/pdf", [file]);

  useEffect(() => {
    if (file && file.type?.startsWith?.("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewURL(null);
  }, [file]);

  /* ----------------- helpers ----------------- */
  const copyRekening = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ""));
    setCopiedRek(true);
    setTimeout(() => setCopiedRek(false), 1800);
  };

  const copyTotal = () => {
    navigator.clipboard.writeText(totalPrice.toString());
    setCopiedTotal(true);
    setTimeout(() => setCopiedTotal(false), 1800);
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) setValue("proof", f, { shouldDirty: true, shouldValidate: true });
    },
    [setValue],
  );

  const clearFile = () => {
    setValue("proof", undefined as unknown as File, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ----------------- submit ----------------- */
  const onSubmit = async ({ proof }: FormValues) => {
    try {
      const user = getUser();
      if (!user?.token) return;

      // 1) upload media
      const uploadMediaResult = await uploadMediaService(file);

      let fileUrl = "-";

      if (uploadMediaResult.ok && uploadMediaResult.data) {
        fileUrl = uploadMediaResult.data.path;
      }

      // 2) simpan dokumen transaksi
      const payload = {
        path: fileUrl,
        type: "transaction-payment",
        inbox_id: inboxId,
        total: totalPrice,
        bank: bankName,
        project_id: detail?.info[0].project_id,
        account_number: accountNumber.replace(/\s+/g, ""),
        account_owner: accountOwner,
        detail: detail ?? undefined, // kirim breakdown agar backend punya salinannya
      };

      const res = await axios.post(
        `${API_BACKEND}/api/v1/document/transaction/payment`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } },
      );

      if (res.status !== 200)
        throw new Error(res.statusText || "Gagal mengirim bukti pembayaran.");

      clearFile();
      reset();
      setIsUploaded(true);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Bukti pembayaran terkirim. Terima kasih!",
        timer: 950,
        timerProgressBar: true,
      });

      router.push("/dashboard/emiten-transaction");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Gagal mengirim bukti pembayaran.";
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: msg,
      });
    }
  };

  /* ----------------- render ----------------- */
  if (loading) {
    return (
      <div className="py-28 px-4 md:py-36 flex items-center justify-center">
        <div className="rounded-xl border px-4 py-3 text-gray-600">
          Memuat rincian pembayaran...
        </div>
      </div>
    );
  }

  return (
    <div className="py-28 px-4 md:py-36 flex items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-5 md:p-8">
        {/* Header bank + meta */}
        <div className="flex items-center gap-3">
          <Image src={logoSrc} alt={bankName} width={56} height={56} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {bankName}
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              {headerTitle}
              {headerStatus ? (
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {headerStatus}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 1 ? "bg-[#10565C]" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 2 ? "bg-[#10565C]" : "bg-gray-200"
            }`}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="mt-6 space-y-6">
            {/* DETAIL PEMBAYARAN */}
            {detail ? (
              <DetailPembayaran detail={detail} />
            ) : (
              <div className="rounded-xl border p-4 text-sm text-gray-600">
                Rincian pembayaran belum tersedia.
              </div>
            )}

            {/* Kartu rekening */}
            <div className="bg-gray-50 border border-[#10565C] rounded-2xl p-5 space-y-3">
              <p className="text-gray-600 mb-1">Nomor Rekening</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 tracking-wide">
                  {accountNumber}
                </span>
                <button type="button" onClick={copyRekening}>
                  {copiedRek ? (
                    <Check size={20} color="#10565C" />
                  ) : (
                    <Copy size={20} color="#10565C" />
                  )}
                </button>
              </div>
              <p className="text-gray-500">{accountOwner}</p>

              <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-[#10565C] bg-[#10565C]/5 px-4 py-3">
                <div>
                  <p className="text-xs text-gray-600">
                    Total yang harus dibayar
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight text-[#10565C]">
                    {formatRupiah(totalPrice)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyTotal}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#10565C] text-white hover:opacity-90 transition"
                >
                  {copiedTotal ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="pt-2">
                <h2 className="text-base text-gray-600 md:text-lg font-semibold">
                  Cara Pembayaran
                </h2>
                <ul className="list-disc list-inside text-gray-600 text-sm md:text-[15px] space-y-1 mt-2">
                  <li>
                    Transfer via ATM, m-Banking, atau iBanking ke rekening di
                    atas.
                  </li>
                  <li>
                    Pastikan nama penerima sesuai: <b>{accountOwner}</b>.
                  </li>
                  <li>
                    Simpan bukti transfer untuk diunggah pada langkah
                    berikutnya.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#10565C] px-4 py-2 text-white hover:opacity-90"
              >
                Upload Bukti Pembayaran
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 bg-gray-50 border border-[#10565C] rounded-2xl p-5 space-y-4"
          >
            <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-[#10565C] bg-[#10565C]/5 px-4 py-3">
              <div>
                <p className="text-xs text-gray-600">Total pembayaran</p>
                <p className="text-2xl font-extrabold tracking-tight text-[#10565C]">
                  {formatRupiah(totalPrice)}
                </p>
              </div>

              <button
                type="button"
                onClick={copyTotal}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#10565C] text-white hover:opacity-90 transition"
              >
                {copiedTotal ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Unggah Bukti Pembayaran
              </h3>
              {file ? (
                <button
                  type="button"
                  onClick={clearFile}
                  className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              ) : null}
            </div>

            <Controller
              control={control}
              name="proof"
              render={({ field }) => (
                <label
                  onDrop={onDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(false);
                  }}
                  className={[
                    "relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-6 cursor-pointer transition",
                    dragOver
                      ? "border-[#10565C] bg-[#10565C]/5"
                      : "border-[#10565C] hover:bg-white",
                    field.value ? "py-4" : "py-10",
                  ].join(" ")}
                >
                  {!field.value ? (
                    <>
                      <FileUp className="mb-3 text-[#10565C]" />
                      <p className="text-center text-gray-700 font-medium">
                        Seret & letakkan file di sini
                      </p>
                      <p className="text-center text-gray-500 text-sm">
                        atau klik untuk memilih file
                      </p>
                      <p className="mt-3 text-xs text-gray-400">
                        Format: JPG, PNG • Maks {MAX_SIZE_MB}MB
                      </p>
                    </>
                  ) : (
                    <div className="w-full flex items-center gap-3">
                      {isPDF ? (
                        <div className="shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-white border border-[#10565C] flex items-center justify-center">
                            <FileText className="text-[#10565C]" />
                          </div>
                        </div>
                      ) : (
                        <div className="shrink-0">
                          <div className="relative w-16 h-16 overflow-hidden rounded-lg border border-[#10565C] bg-white">
                            {previewURL && (
                              <Image
                                src={previewURL}
                                alt={field.value.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {field.value.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(field.value.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                          {isPDF
                            ? "PDF"
                            : field.value.type
                                .replace("image/", "")
                                .toUpperCase()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearFile}
                        className="ml-auto inline-flex items-center justify-center rounded-full w-8 h-8 border border-[#10565C] hover:bg-[#10565C]/10"
                        aria-label="Hapus file"
                      >
                        <X size={16} className="text-[#10565C]" />
                      </button>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept={ACCEPT_TYPES.join(",")}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) field.onChange(f);
                    }}
                    aria-label="Pilih file bukti pembayaran"
                  />
                </label>
              )}
            />

            {errors.proof && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {String(errors.proof.message || "")}
              </div>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#10565C] px-4 py-2 text-[#10565C] hover:bg-[#10565C]/10"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>

              <button
                type="submit"
                disabled={!file || isSubmitting || isUploaded}
                className={[
                  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white transition",
                  !file || isSubmitting || isUploaded
                    ? "bg-[#10565C]/50 cursor-not-allowed"
                    : "bg-[#10565C] hover:opacity-90",
                ].join(" ")}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    {isUploaded ? "Sudah Terkirim" : "Submit"}
                  </>
                )}
              </button>
            </div>

            <p className="text-[13px] text-gray-500 text-center">
              Verifikasi manual oleh tim kami (≈ 1×24 jam kerja).
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
