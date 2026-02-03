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
import { Check, Copy, FileUp, FileText, Upload, X, Trash2 } from "lucide-react";
import axios from "axios";
import { formatRupiah } from "@/app/utils/formatRupiah";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { getUser } from "@/app/lib/auth";
import { uploadMediaService } from "@/app/helper/mediaService";

const ACCEPT_TYPES = ["image/jpeg", "image/png"] as const;
type AcceptType = (typeof ACCEPT_TYPES)[number];
const isAcceptType = (t: string): t is AcceptType =>
  (ACCEPT_TYPES as readonly string[]).includes(t);

const MAX_SIZE_MB = 5;

const proofSchema = z
  .custom<File>((v) => v instanceof File, {
    message: "File bukti wajib diunggah.",
  })
  .refine((file) => isAcceptType(file.type), {
    message: "Tipe file tidak didukung (JPG/PNG).",
  })
  .refine((file) => file.size <= MAX_SIZE_MB * 1024 * 1024, {
    message: `Ukuran file maksimal ${MAX_SIZE_MB}MB.`,
  });

const schema = z.object({
  proof: proofSchema,
});
type FormValues = z.infer<typeof schema>;

type Props = {
  bankName?: string;
  accountNumber?: string;
  accountOwner?: string;
  logoSrc?: string; // path logo (public/)
};

export default function PembayaranDanamon({
  bankName = "Bank BCA",
  accountNumber = "5855319788",
  accountOwner = "PT Fintek Andalan Solusi Teknologi",
  logoSrc = "/images/bank/bca-logo.png",
}: Props) {
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const searchParams = useSearchParams();
  const inboxId = searchParams.get("inboxId");
  const projectId = searchParams.get("projectId");
  const price = searchParams.get("price");

  const router = useRouter();

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
    defaultValues: {
      proof: undefined,
    },
  });

  const file = watch("proof");
  const isPDF = useMemo(() => file && file.type === "application/pdf", [file]);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewURL(null);
  }, [file]);

  const copyRekening = () => {
    const num = accountNumber.replace(/\s+/g, "");
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
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

  const onSubmit = async ({ proof }: FormValues) => {
    const uploadMediaResult = await uploadMediaService(file);

    let fileUrl = "-";

    if (uploadMediaResult.ok && uploadMediaResult.data) {
      fileUrl = uploadMediaResult.data.path;
    }

    const payload = {
      path: fileUrl,
      project_id: projectId,
      inbox_id: inboxId,
    };

    const user = getUser();

    const res = await axios.post(
      `${API_BACKEND}/api/v1/document/transaction/payment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.statusText || "Gagal mengirim bukti pembayaran.");
    }

    clearFile();
    reset();

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Bukti pembayaran terkirim. Terima kasih!",
      timer: 950,
      timerProgressBar: true,
    });

    router.push("/dashboard/emiten-transaction");
  };

  return (
    <div className="py-28 px-4 md:py-36 flex items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-2xl w-full p-5 md:p-8">
        {/* Header bank */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src={logoSrc} alt={bankName} width={56} height={56} />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                {bankName}
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Pembayaran manual & unggah bukti
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info Rekening */}
          <div className="bg-gray-50 border border-[#10565C] rounded-2xl p-5 space-y-3">
            <p className="text-gray-600">Nomor Rekening</p>
            <p className="text-2xl font-bold text-gray-900 tracking-wide">
              {accountNumber}
            </p>
            <p className="text-gray-500">{accountOwner}</p>

            <div className="mt-3 p-3 rounded-xl bg-[#10565C]/5 border border-[#10565C]">
              <p className="text-sm text-gray-600">Total yang harus dibayar</p>
              <p className="text-xl font-bold text-[#10565C]">
                {formatRupiah(Number(price))}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyRekening}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10565C] text-white hover:opacity-90 transition"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Disalin!" : "Salin Rekening"}
              </button>
            </div>

            <div className="pt-3 border-t border-[#10565C]">
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
                <li>Simpan bukti transfer, lalu unggah di formulir.</li>
              </ul>
            </div>
          </div>

          {/* Upload Bukti */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gray-50 border border-[#10565C] rounded-2xl p-5 space-y-4"
          >
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
                    accept={(ACCEPT_TYPES as readonly string[]).join(",")}
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
                {errors.proof.message as string}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isUploaded} // ✅ disable kalau lagi submit atau sudah terkirim
              className={[
                "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white transition",
                isSubmitting || isUploaded
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
                  {isUploaded ? "Sudah Terkirim" : "Kirim Bukti"}
                </>
              )}
            </button>

            <p className="text-[13px] text-gray-500 text-center">
              Verifikasi manual oleh tim kami (≈ 1x24 jam kerja).
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
