import React, { useState } from "react";
import { FileText } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import clsx from "clsx";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";
import { compressImage } from "@/app/helper/CompressorImage";

const IMAGE_MIME = ["image/png", "image/jpeg"];
const DOC_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const IMAGE_EXT = ["png", "jpg", "jpeg"];
const DOC_EXT = ["pdf", "doc", "docx"];

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase();
}

function isAllowedFile(file: File, accept?: string) {
  const ext = getFileExtension(file);
  if (!ext) return false;

  const isImage = IMAGE_EXT.includes(ext) && IMAGE_MIME.includes(file.type);
  const isDoc = DOC_EXT.includes(ext) && DOC_MIME.includes(file.type);

  // accept mengandung image → hanya image
  if (accept?.includes("image")) return isImage;

  // accept mengandung pdf/doc → dokumen
  if (accept?.includes("pdf") || accept?.includes("doc")) return isDoc;

  // fallback default → dokumen
  return isDoc;
}

interface FileInputProps {
  fileName: string;
  fileUrl?: string;
  placeholder?: string;
  onChange: (e: string) => void;
  errorText?: string;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  placeholder,
  fileName,
  fileUrl,
  onChange,
  errorText,
  accept,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  function getFileNameFromUrl(url?: string | null): string | null {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);
      return fileName || null;
    } catch (error) {
      return null;
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;

    const file = e.target.files?.[0];
    if (!file) {
      setLoading(false);
      return;
    }

    if (!isAllowedFile(file, accept)) {
      Swal.fire({
        title: "Gagal",
        text: "Tipe file tidak didukung. Hanya PDF/DOC atau PNG/JPG.",
        icon: "warning",
        timer: 3000,
      });
      e.target.value = "";
      return;
    }

    setLoading(true);

    if (file.size > 10 * 1024 * 1024) {
      setLoading(false);
      Swal.fire({
        title: "Gagal",
        text: "Ukuran file maksimal 10 mb.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    const isImage = file.type.startsWith("image/");
    const compressedFile = isImage ? await compressImage(file) : file;

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", fileName);
    formData.append("media", compressedFile);

    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
        formData,
        {
          onUploadProgress: (progress) => {
            const total = progress.total ?? 1;
            const percentCompleted = Math.round(
              (progress.loaded * 100) / total,
            );
            console.log("Progress:", percentCompleted, "%");
            setUploadProgress(percentCompleted);
          },
        },
      );

      const url = res.data?.data?.path;
      if (url) {
        onChange(url);
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Upload gagal, tidak ada URL yang diterima.",
          icon: "warning",
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Gagal upload:", error);
      Swal.fire({
        title: "Gagal",
        text: "Upload gagal. Silakan coba lagi.",
        icon: "warning",
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label
        className={clsx(
          "relative inline-flex items-center gap-2 px-2 md:px-6 py-2 rounded-lg cursor-pointer font-semibold text-[12px] text-white overflow-hidden",
          loading ? "bg-gray-400" : "bg-gray-700 hover:bg-gray-800",
        )}
      >
        {loading && (
          <div
            className="absolute left-0 top-0 h-full bg-gray-700 transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          <FileText size={13} />
          {placeholder ?? "Upload Dokumen"}
        </span>

        <div className="flex gap-x-4">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept ?? ".pdf,.doc,.docx"}
            disabled={loading}
          />
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
            <span className="text-white font-bold text-xs bg-black/60 px-2 py-1 rounded-full">
              {uploadProgress}%
            </span>
          </div>
        )}
      </label>

      {fileUrl && (
        <div className="flex items-center gap-2 text-xs text-blue-500 font-semibold">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate max-w-[130px] text-inherit no-underline"
          >
            {getFileNameFromUrl(fileUrl)}
          </a>
        </div>
      )}

      {errorText && <p className="text-red-500 text-xs">{errorText}</p>}
    </div>
  );
};

export default FileInput;
