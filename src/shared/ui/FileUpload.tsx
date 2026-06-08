import { FaFileAlt } from "react-icons/fa";
import React, { useRef, useState } from "react";
import { useFileViewerModal } from "../hooks/useFileViewerModal";
import SectionPoint from "@/app/components/inputFormPenerbit/_component/SectionPoint";

type FileUploadProps = {
  label: string;
  fileUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void; // support async
  error?: string;
};

export default function FileUpload({
  label,
  fileUrl,
  onUpload,
  error,
}: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { openFile } = useFileViewerModal();
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    try {
      await onUpload(e);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="mb-4">
      <SectionPoint text={label} className="mb-1" />

      <button
        type="button"
        onClick={() => !isUploading && fileRef.current?.click()}
        disabled={isUploading}
        className={`flex items-center w-56 py-2 rounded-lg ${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-white"
        }`}
      >
        <FaFileAlt size={20} className="mx-2" />
        {isUploading ? "Mengunggah..." : "Upload Dokumen"}
      </button>

      <input
        type="file"
        ref={fileRef}
        accept="application/pdf"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {fileUrl && (
        <button
          type="button"
          onClick={() => openFile(fileUrl)}
          className="text-blue-600 underline text-sm mt-2 block"
        >
          Lihat Dokumen
        </button>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <p className="text-xs text-gray-500">File maksimal berukuran 10MB</p>
    </div>
  );
}
