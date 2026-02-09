"use client";

import FormButton from "@/app/components/inputFormPemodalPerusahaan/component/FormButton";
import SectionPoint from "@/app/components/inputFormPemodalPerusahaan/component/SectionPoint";
import { Camera, CameraOff, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  photoResult: (result: File | null) => void;
  errorText?: string;
  defaultPhoto?: string;
  disabled?: boolean;
}

const ContainerSelfie: React.FC<Props> = ({
  photoResult,
  errorText,
  defaultPhoto,
  disabled = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(defaultPhoto || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  //* check if device platform supports camera
  useEffect(() => {
    const checkCameraSupport = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("Device tidak mendukung kamera");
        setErrorMessage("Device tidak mendukung kamera");
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(
          (device) => device.kind === "videoinput"
        );

        if (!hasCamera) {
          console.log("Tidak ada kamera yang terdeteksi");
          setErrorMessage("Tidak ada kamera yang terdeteksi");
        } else {
          console.log("Kamera tersedia");
        }
      } catch (err) {
        console.error("Gagal memeriksa kamera:", err);
      }
    };

    checkCameraSupport();
  }, []);

  //* start camera
  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(newStream);
      setErrorMessage("");
      setIsCameraActive(true);
    } catch (err) {
      if (err instanceof DOMException) {
        console.log(err);
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          setErrorMessage(
            "Akses kamera ditolak. Silakan aktifkan izin kamera di pengaturan browser."
          );
        } else {
          setErrorMessage("Terjadi kesalahan saat mengakses kamera.");
        }
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui.");
      }
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [isCameraActive, stream]);

  //* take photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setPhoto(imageData);

      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `selfie-${new Date().toISOString()}.png`;
          const file = new File([blob], fileName, { type: "image/png" });
          photoResult(file);
          console.log(file.name);
        }
      }, "image/png");

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  //* re-take photo
  const retakePhoto = () => {
    setPhoto(null);
    photoResult(null);
    startCamera();
  };

  // *reset photo
  const resetPhoto = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setPhoto(null);
    photoResult(null);
    setIsCameraActive(false);
    setErrorMessage("");
    setStream(null);
  };

  useEffect(() => {
    if (defaultPhoto) {
      setPhoto(defaultPhoto);
    }
  }, [defaultPhoto]);

  return (
    <div
      className={
        isCameraActive
          ? "flex flex-col h-full bg-slate-50 px-4 pb-4 pt-2 rounded-md"
          : "flex flex-col h-[240px] md:h-[350px] bg-slate-50 px-4 pb-4 pt-2 rounded-md"
      }
    >
      <SectionPoint text="Foto Selfie" className="mb-2" />

      <div
        onClick={() => {
          if (disabled) return;
          if (!isCameraActive) {
            startCamera();
          }
        }}
        className={[
          "flex-1 flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-black overflow-hidden",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
      >
        {photo ? (
          <div className="w-full relative flex flex-col items-center">
            <img
              alt="Foto Selfie"
              src={photo}
              className="block w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={resetPhoto}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <FormButton
              type="outlined"
              className="mt-2 mx-auto"
              onClick={retakePhoto}
            >
              Ambil Ulang
            </FormButton>
          </div>
        ) : isCameraActive ? (
          <div className="flex flex-col items-center w-full mb-2">
            <video
              ref={videoRef}
              style={{ transform: "scaleX(-1)" }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <FormButton type="filled" className="mt-2" onClick={takePhoto}>
              Ambil Foto
            </FormButton>
          </div>
        ) : errorMessage ? (
          <>
            <CameraOff className="w-12 h-12 text-red-400" />
            <p className="text-red-500 text-xs text-center">{errorMessage}</p>
          </>
        ) : (
          <>
            <Camera className="w-12 h-12 text-gray-400" />
            <p className="text-gray-500 text-xs text-center">
              Klik area ini untuk mengunggah foto selfie
            </p>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>

      {errorText && <p className="text-red-500 text-xs mt-2">{errorText}</p>}
    </div>
  );
};

export default ContainerSelfie;
