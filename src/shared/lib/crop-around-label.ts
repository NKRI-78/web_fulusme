// utils/crop-around-label.ts
export async function cropAroundLabel(
  srcCanvas: HTMLCanvasElement,
  data: any
): Promise<HTMLCanvasElement | null> {
  const words: Array<any> = data?.words ?? [];
  // cari kata mendekati "NPWP" (toleran spasi)
  const label = words.find((w) => /N\s*P\s*W\s*P/i.test(w.text ?? ""));
  if (!label || !label.bbox) return null;

  const { x0, y0, x1, y1 } = label.bbox; // bbox dari tesseract.js
  const lineH = y1 - y0;
  // ambil area kanan label cukup lebar: 12x lebar label, tinggi 3x
  const padX = (x1 - x0) * 12;
  const padY = lineH * 1.2;

  const x = Math.max(0, x1 - (x1 - x0) * 0.2); // mulai sedikit setelah label
  const y = Math.max(0, y0 - padY / 2);
  const w = Math.min(srcCanvas.width - x, padX);
  const h = Math.min(srcCanvas.height - y, lineH + padY);

  const crop = document.createElement("canvas");
  crop.width = Math.max(1, Math.floor(w));
  crop.height = Math.max(1, Math.floor(h));
  crop
    .getContext("2d")!
    .drawImage(srcCanvas, x, y, w, h, 0, 0, crop.width, crop.height);
  return crop;
}
