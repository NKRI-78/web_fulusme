import React, { useEffect, useRef, useState } from "react";
import { FolderUp, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { compressImage } from "@/app/helper/CompressorImage";
import SectionPoint from "./SectionPoint";
import { uploadMediaService } from "@/app/helper/mediaService";

interface PhotoUploaderContainerProps {
  fileOnChange: (urls: string[]) => void;
  photoPaths?: string[];
  errorText?: string;
  label?: string;
  maxUpload?: number;
}

const PhotoUploaderContainer: React.FC<PhotoUploaderContainerProps> = ({
  fileOnChange,
  errorText,
  photoPaths,
  label,
  maxUpload = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const allowedTypes: string[] = ["image/jpeg", "image/png"];

  const disabled = uploadedUrls.length >= maxUpload || isUploading;

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const uploadMediaResult = await uploadMediaService(file);
      const photoUrl = uploadMediaResult.data?.path;
      if (!photoUrl) return null;
      return photoUrl;
    } catch (error) {
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) =>
      allowedTypes.includes(file.type),
    );

    if (uploadedUrls.length + validFiles.length > maxUpload) {
      Swal.fire({
        title: "Batas foto tercapai",
        text: `Anda hanya bisa mengupload maksimal ${maxUpload} foto.`,
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    const uploaded: string[] = [];

    for (const file of validFiles) {
      const url = await uploadFile(file);
      if (url) uploaded.push(url);
    }

    const allUploaded = [...uploadedUrls, ...uploaded];
    setUploadedUrls(allUploaded);
    fileOnChange(allUploaded);

    setIsUploading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerInput = () => {
    if (!disabled) inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const updated = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(updated);
    fileOnChange(updated);
  };

  const openPreview = (photoUrl: string) => {
    Swal.fire({
      imageUrl: photoUrl,
      showConfirmButton: false,
      background: "transparent",
      backdrop: "rgba(0,0,0,0.8)",
    });
  };

  useEffect(() => {
    if (photoPaths && photoPaths.length > 0) {
      setUploadedUrls(photoPaths);
    }
  }, [photoPaths]);

  return (
    <div>
      {label && <SectionPoint className="mb-1" text={label} />}

      <div
        className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition ${
          errorText
            ? "border-red-500"
            : isDragging
              ? "border-blue-700 bg-blue-50"
              : "border-blue-500"
        }`}
        onClick={triggerInput}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        {uploadedUrls.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              {uploadedUrls.length < maxUpload
                ? `Masih bisa menambah ${
                    maxUpload - uploadedUrls.length
                  } foto lagi`
                : "Hapus salah satu foto untuk mengubah"}
            </span>
          </div>
        )}

        {uploadedUrls.length === 0 && (
          <>
            <FolderUp className="w-8 h-8 text-blue-400" />
            <p className="text-sm font-medium text-gray-600 my-2">
              Seret file Anda ke sini
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">Atau</span>
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInput();
                }}
                className={
                  disabled
                    ? "text-xs text-gray-500 border border-gray-600 px-3 py-1 rounded-md"
                    : "text-xs text-blue-500 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                }
              >
                Telusuri file
              </button>
            </div>
          </>
        )}

        {uploadedUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 w-full">
            {uploadedUrls.map((url, index) => (
              <div
                key={index}
                className="relative group border rounded-md overflow-hidden cursor-pointer"
              >
                <img
                  src={url}
                  alt={`foto-${index}`}
                  className="w-full h-24 object-cover"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPreview(url);
                  }}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <p className="text-xs text-gray-500 mt-2 italic">
            Mengunggah file...
          </p>
        )}
      </div>

      <input
        type="file"
        accept=".jpg,.png,.jpeg"
        multiple
        hidden
        ref={inputRef}
        onChange={handleInputChange}
      />

      {errorText ? (
        <p className="text-red-500 text-xs mt-1">{errorText}</p>
      ) : (
        <p className="text-xs text-gray-500 mt-1">
          Hanya mendukung file .jpg dan .png.{" "}
          <span className="text-black">Maksimal {maxUpload} foto.</span>
        </p>
      )}
    </div>
  );
};

export default PhotoUploaderContainer;
