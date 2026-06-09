"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js";

type NpwpProps = {
  /** Dipakai parent utk reset field Zod/RHF di awal proses */
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  /** Dipanggil saat NPWP terdeteksi (raw atau terformat) */
  onDetected?: (npwp: string) => void;
  /** Opsional: kalau gagal, parent bisa tampilkan error sendiri */
  onFail?: (reason?: string) => void;
};

export default function NPWPOCR({ onUpload, onDetected, onFail }: NpwpProps) {
  const [progress, setProgress] = useState(0);
  const [npwp, setNpwp] = useState<string | null>(null);
  const [debugText, setDebugText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- START: reset UI lokal
    setProgress(0);
    setNpwp(null);
    setError(null);
    setDebugText("");

    // Beri kesempatan parent utk reset field Zod/RHF (clearErrors, setError manual, dst)
    try {
      await onUpload(e);
    } catch (err) {
    } finally {
      // kosongkan value input file agar bisa upload file yang sama lagi
      e.target.value = "";
    }

    // Buat canvas dasar (sedikit upscale biar tajam)
    const img = await createImageBitmap(file);
    const base = document.createElement("canvas");
    const bctx = base.getContext("2d")!;
    const maxW = 2000;
    const scale = Math.min(maxW / img.width, 2);
    base.width = Math.round(img.width * scale);
    base.height = Math.round(img.height * scale);
    bctx.drawImage(img, 0, 0, base.width, base.height);

    // Helper: rotate + optional invert
    function makeVariant(
      src: HTMLCanvasElement,
      angle: number,
      invert = false,
    ) {
      const rad = (angle * Math.PI) / 180;
      const out = document.createElement("canvas");
      out.width = src.width;
      out.height = src.height;
      const ctx = out.getContext("2d")!;
      ctx.translate(out.width / 2, out.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(src, -out.width / 2, -out.height / 2);
      if (invert) {
        const id = ctx.getImageData(0, 0, out.width, out.height);
        const d = id.data;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = 255 - d[i];
          d[i + 1] = 255 - d[i + 1];
          d[i + 2] = 255 - d[i + 2];
        }
        ctx.putImageData(id, 0, 0);
      }
      return out;
    }

    // Varian rotasi & invert
    const angles = [-12, -6, 0, 6, 12];
    const variants: { canvas: HTMLCanvasElement; label: string }[] = [];
    for (const a of angles) {
      variants.push({ canvas: makeVariant(base, a, false), label: `rot${a}` });
      variants.push({
        canvas: makeVariant(base, a, true),
        label: `rot${a}-inv`,
      });
    }

    async function ocrOnce(c: HTMLCanvasElement) {
      const { data } = await Tesseract.recognize(c as any, "eng", {
        ...({
          tessedit_char_whitelist: "0123456789.-\u2013", // + en-dash
          tessedit_pageseg_mode: "7", // single line
          user_defined_dpi: "300",
        } as any),
        logger: (m: any) => {
          if (
            m.status === "recognizing text" &&
            typeof m.progress === "number"
          ) {
            setProgress((p) =>
              Math.min(99, Math.max(p, Math.round(m.progress * 100))),
            );
          }
        },
      } as any);
      return data.text || "";
    }

    // OCR semua varian → pilih teks terbaik
    let bestText = "";
    let bestScore = -1;
    let logAll = "";
    try {
      for (const v of variants) {
        const txt = await ocrOnce(v.canvas);
        logAll += `\n[${v.label}]\n${txt}\n`;
        const digits = (txt.match(/\d/g) || []).length;
        const seps = (txt.match(/[.\-–]/g) || []).length;
        const score = digits * 2 + seps;
        if (score > bestScore) {
          bestScore = score;
          bestText = txt;
        }
      }
    } catch (err) {
      setProgress(100);
      setError("OCR gagal diproses.");
      onFail?.("ocr-error");
      return;
    }

    setProgress(100);
    setDebugText(logAll.trim());
  }

  return (
    <div className="max-w-2xl space-y-4 my-3">
      <h1 className="text-lg font-semibold">NPWP FILE</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {progress > 0 && progress < 100 && (
        <div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 rounded"
              style={{ width: `${progress}%`, background: "#0ea5e9" }} // ← fixed backtick
            />
          </div>
          <p className="text-sm mt-1">Progress: {progress}%</p>
        </div>
      )}

      {/* tampilkan hanya saat selesai */}
      {/* {progress === 100 && (
        <>
          <div className="border p-3 rounded text-sm">
            <b>NPWP:</b>{" "}
            {npwp ? (
              <span className="text-green-600">{npwp}</span>
            ) : (
              <span className="text-red-600">
                {error ?? "NPWP belum terdeteksi."}
              </span>
            )}
          </div>

          <details className="border p-3 rounded text-xs whitespace-pre-wrap">
            <summary className="cursor-pointer">
              🔍 OCR Debug (semua varian)
            </summary>
            {debugText}
          </details>
        </>
      )} */}
    </div>
  );
}
