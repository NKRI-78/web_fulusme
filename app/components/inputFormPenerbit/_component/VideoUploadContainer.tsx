import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FolderUp, X, Video as VideoIcon } from "lucide-react";
import SectionPoint from "./SectionPoint";
import { uploadMediaService } from "@/app/helper/mediaService";

interface VideoUploaderContainerProps {
  fileOnChange: (videoUrl: string) => void;
  videoPath?: string;
  errorText?: string;
  label?: string;
}

const VideoUploaderContainer: React.FC<VideoUploaderContainerProps> = ({
  fileOnChange,
  videoPath,
  errorText,
  label,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");

  const allowedType = "video/mp4";
  const maxSize = 200 * 1024 * 1024;

  const disabled = isUploading || !!videoUrl;

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const uploadMediaResult = await uploadMediaService(
        file,
        (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          }
        },
      );

      const photoUrl = uploadMediaResult.data?.path;
      if (!photoUrl) return null;
      return photoUrl;
    } catch (error) {
      console.error("Upload gagal:", error);
      Swal.fire({
        title: "Upload gagal",
        text: "Terjadi kesalahan saat mengunggah video.",
        icon: "error",
      });
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.type !== allowedType) {
      Swal.fire({
        title: "Format tidak didukung",
        text: "Hanya mendukung format .mp4",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        title: "Ukuran file terlalu besar",
        text: "Maksimal ukuran video adalah 300MB",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    setProgress(0);

    const url = await uploadFile(file);

    if (url) {
      setVideoUrl(url);
      fileOnChange(url);
    }

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

  const removeVideo = () => {
    setVideoUrl(null);
    setFileName("");
    setProgress(0);
    fileOnChange("");
  };

  useEffect(() => {
    if (videoPath) {
      setVideoUrl(videoPath);
    }
  }, [videoPath]);

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
        {!videoUrl && !isUploading && (
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

        {isUploading && (
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700 text-left mb-1">
              {fileName}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Mengunggah... {progress}%
            </p>
          </div>
        )}

        {videoUrl && !isUploading && (
          <div className="relative group border rounded-md overflow-hidden w-full max-w-md">
            <video
              src={videoUrl}
              controls
              className="w-full h-48 object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeVideo();
              }}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        accept=".mp4"
        hidden
        ref={inputRef}
        onChange={handleInputChange}
      />

      {errorText ? (
        <p className="text-red-500 text-xs mt-1">{errorText}</p>
      ) : (
        <p className="text-xs text-gray-500 mt-1">
          Hanya mendukung file <span className="text-black">.mp4</span>.
          Maksimal <span className="text-black">1 video (300MB)</span>.
        </p>
      )}
    </div>
  );
};

export default VideoUploaderContainer;
