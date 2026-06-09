"use client";

import { useRef, useState } from "react";

export default function TakePicturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // kamera depan
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {}
  };

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
    }
  };

  return (
    <div className="flex flex-col items-center py-28">
      <h1 className="text-xl font-bold mb-4">Selfie dengan Kamera Depan</h1>

      {!photo && (
        <>
          <video
            ref={videoRef}
            className="rounded-lg border mb-4"
            style={{ transform: "scaleX(-1)" }}
            autoPlay
            playsInline
          />
          <div className="flex gap-2">
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Aktifkan Kamera
            </button>
            <button
              onClick={takePhoto}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Ambil Foto
            </button>
          </div>
        </>
      )}

      {photo && (
        <div className="flex flex-col items-center">
          <img src={photo} alt="Selfie" className="rounded-lg border mb-4" />
          <button
            onClick={() => setPhoto(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Ambil Lagi
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
