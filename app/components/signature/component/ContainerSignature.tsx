"use client";

import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadMediaService } from "@/app/helper/mediaService";

function getSignatureDataUrlWithWhiteBackground(
  canvas: HTMLCanvasElement,
): string {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  ctx.drawImage(canvas, 0, 0);

  return tempCanvas.toDataURL("image/png");
}

interface Props {
  formData: {
    signature: string;
  };

  onSignatureSave: (signature: string) => void;
}

const SIG_W = 500;
const SIG_H = 200;

const ContainerSignature: React.FC<Props> = ({ formData, onSignatureSave }) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const uploadSignature = async (dataUrl: string): Promise<string | null> => {
    const blob = await (await fetch(dataUrl)).blob();

    const file = new File([blob], "signature.png", {
      type: blob.type,
    });

    try {
      const uploadMediaResult = await uploadMediaService(file);

      const fileUrl = uploadMediaResult.data?.path;

      if (fileUrl) {
        Swal.fire({
          title: "Berhasil",
          text: "Tanda tangan berhasil diupload!",
          icon: "success",
          timer: 3000,
        });
        return fileUrl;
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
        return null;
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal",
        text: "Upload tanda tangan gagal. Silakan coba lagi.",
        icon: "error",
        timer: 3000,
      });
      return null;
    }
  };

  const handleSaveSignature = async () => {
    const canvas = signatureRef.current?.getCanvas();
    if (!canvas) return;

    if (signatureRef.current?.isEmpty()) {
      Swal.fire({
        title: "Kosong",
        text: "Silakan isi tanda tangan terlebih dahulu!",
        icon: "warning",
        timer: 2500,
      });
      return;
    }

    const dataUrl = getSignatureDataUrlWithWhiteBackground(canvas);

    const uploadedUrl = await uploadSignature(dataUrl);

    if (uploadedUrl) {
      const now = new Date();
      const signatureData = {
        url: uploadedUrl,
        timestamp: now.toISOString(),
      };

      localStorage.setItem("signature", JSON.stringify(signatureData));

      onSignatureSave(uploadedUrl);
      signatureRef.current?.off();
      setIsSignatureSaved(true);
    }
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    signatureRef.current?.on();
    setIsSignatureSaved(false);
    setIsEmpty(true);
    localStorage.removeItem("signature");
  };

  useEffect(() => {
    const storedSignature = localStorage.getItem("signature");

    if (storedSignature && signatureRef.current) {
      try {
        const { url, timestamp } = JSON.parse(storedSignature);

        if (url) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            const canvas = signatureRef.current?.getCanvas();
            const ctx = canvas?.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            signatureRef.current?.off();
            setIsSignatureSaved(true);
            console.log("Tanda tangan tersimpan pada:", timestamp);
          };
        }
      } catch (err) {
        console.error("Gagal parsing signature dari localStorage:", err);
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div></div>
      {/* <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md p-4 leading-relaxed">
        <p>
          Keputusan terkait investasi sepenuhnya ada di tangan Anda. Kami tidak
          bertanggung jawab atas kerugian atas investasi ini.
        </p>
        <p className="mt-2">
          Pemodal mengerti dan memahami bahwa pembagian dividen kepada para
          pemegang Efek tidak bersifat lifetime karena Penerbit merupakan badan
          usaha berbadan hukum berhak melakukan Buyback sebagaimana diatur dalam
          akta anggaran dasar Penerbit dan peraturan perundang-undangan yang
          berlaku.
        </p>
      </div> */}

      <div className="rounded-md border border-gray-300 shadow-sm bg-white p-3">
        <div
          className="rounded-md border border-dashed border-gray-400 flex items-center justify-center w-full max-w-xl mx-auto"
          style={{ height: 200 }}
        >
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            onEnd={() => {
              if (signatureRef.current) {
                setIsEmpty(signatureRef.current.isEmpty());
              }
            }}
            canvasProps={{
              className: "sigCanvas w-full h-full block bg-white rounded-md",
            }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Silakan tanda tangani area di atas
        </p>
        <div className="flex gap-3 mt-4 justify-center">
          <button
            type="button"
            onClick={handleClearSignature}
            disabled={isEmpty}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isEmpty
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isSignatureSaved ? "Hapus" : "Ulang"}
          </button>

          <button
            type="button"
            onClick={handleSaveSignature}
            disabled={isSignatureSaved}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isSignatureSaved
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Simpan Tanda Tangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerSignature;
