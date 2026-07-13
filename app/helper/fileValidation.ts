/**
 * Validasi isi file berbasis magic-number (signature byte awal file).
 *
 * Remediasi OAO Temuan 1 (Stored XSS on Upload Document) — melengkapi cek
 * ekstensi + `file.type` yang keduanya mudah dipalsukan (mis. file HTML jahat
 * dinamai `dokumen.pdf`). Dengan membaca byte awal file, konten yang tidak
 * cocok dengan ekstensinya ditolak sebelum terkirim ke media-server.
 *
 * CATATAN: karena berjalan di browser, ini hanya lapisan defense-in-depth /
 * UX untuk pengguna jujur. Penyerang tetap bisa upload langsung ke
 * media-server, sehingga validasi otoritatif WAJIB ada di sisi server
 * (lihat doc/remediasi-oao-temuan1-media-server-spec.md).
 */

export type FileKind =
  | "pdf"
  | "png"
  | "jpg"
  | "gif"
  | "webp"
  | "ole2" // .doc lama (container OLE2)
  | "zip" // .docx/.xlsx/.pptx (container ZIP)
  | "isobmff"; // .mp4 / .heic / .heif (box "ftyp" di offset 4)

export type FileValidationCode =
  | "empty" // file kosong
  | "unreadable" // gagal dibaca
  | "unsafe_file" // konten aktif / skrip berbahaya terdeteksi
  | "type_mismatch"; // isi file tidak cocok dengan ekstensi

export interface FileValidationResult {
  ok: boolean;
  message?: string;
  code?: FileValidationCode;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Deteksi jenis file dari signature byte awal. */
function sniffKind(head: Uint8Array): FileKind | null {
  const hex = bytesToHex(head.slice(0, 12));

  if (hex.startsWith("25504446")) return "pdf"; // %PDF
  if (hex.startsWith("89504e47")) return "png"; // \x89PNG
  if (hex.startsWith("ffd8ff")) return "jpg"; // JPEG
  if (hex.startsWith("47494638")) return "gif"; // GIF8
  if (hex.startsWith("52494646") && hex.slice(16, 24) === "57454250")
    return "webp"; // RIFF....WEBP
  if (hex.startsWith("d0cf11e0a1b11ae1")) return "ole2"; // OLE2 (.doc)
  if (hex.startsWith("504b0304")) return "zip"; // PK\x03\x04 (.docx)
  if (hex.slice(8, 16) === "66747970") return "isobmff"; // ....ftyp (.mp4/.heic)

  return null;
}

/**
 * Deteksi konten aktif yang bisa dirender/dieksekusi browser (HTML/SVG/XML/
 * script). File seperti ini SELALU ditolak apa pun ekstensinya — inilah
 * payload utama Stored XSS via upload.
 */
function looksLikeActiveContent(head: Uint8Array): boolean {
  const text = new TextDecoder("utf-8", { fatal: false })
    .decode(head)
    .replace(/^﻿/, "")
    .trimStart()
    .toLowerCase();

  return (
    text.startsWith("<!doctype") ||
    text.startsWith("<html") ||
    text.startsWith("<head") ||
    text.startsWith("<body") ||
    text.startsWith("<script") ||
    text.startsWith("<svg") ||
    text.startsWith("<?xml") ||
    text.includes("<script")
  );
}

/**
 * Deep-scan isi file (seluruh byte, bukan hanya header) untuk pola berbahaya.
 *
 * Setara dengan scanning regex di aplikasi mobile: PDF yang berisi JavaScript
 * embedded / auto-action, atau gambar yang disisipi <?php / <script (polyglot),
 * ditolak walau signature-nya valid.
 *
 * Batasan (sama seperti di mobile): ini pencocokan pola, bukan parser PDF penuh,
 * sehingga nama yang di-obfuscate via hex-escape (mis. `/J#61vaScript`) masih
 * bisa lolos. Karena itu tetap butuh validasi otoritatif di media-server.
 */

/** Decode byte apa adanya (1 byte = 1 char) agar regex bisa mencari keyword. */
function decodeLatin1(bytes: Uint8Array): string {
  return new TextDecoder("iso-8859-1").decode(bytes);
}

/** PDF berbahaya: mengandung JavaScript embedded / aksi otomatis / launch. */
function looksLikeDangerousPdf(bytes: Uint8Array): boolean {
  const content = decodeLatin1(bytes);
  const dangerousPatterns = [
    /\/JS\b/,
    /\/JavaScript\b/,
    /\/OpenAction\b/,
    /\/AA\b/, // Additional Actions (auto-run saat buka/tutup/halaman)
    /\/Launch\b/, // menjalankan program eksternal
    /\/EmbeddedFile\b/, // file terlampir di dalam PDF
    /\/RichMedia\b/, // konten Flash/media aktif
  ];
  return dangerousPatterns.some((p) => p.test(content));
}

/** Gambar berbahaya: polyglot yang menyisipkan script/PHP di dalam gambar. */
function looksLikeDangerousImage(bytes: Uint8Array): boolean {
  const content = decodeLatin1(bytes);
  const dangerousPatterns = [
    /<\?php/i,
    /<script/i,
    /\beval\s*\(/i,
    /\bsystem\s*\(/i,
  ];
  return dangerousPatterns.some((p) => p.test(content));
}

/** Kind yang dianggap sah untuk tiap ekstensi yang dipakai fitur upload. */
const EXT_TO_KINDS: Record<string, FileKind[]> = {
  pdf: ["pdf"],
  png: ["png"],
  jpg: ["jpg"],
  jpeg: ["jpg"],
  gif: ["gif"],
  webp: ["webp"],
  // .doc & .docx tidak selalu bisa dibedakan dari signature saja,
  // jadi kedua container diterima untuk kategori dokumen Word.
  doc: ["ole2", "zip"],
  docx: ["ole2", "zip"],
  mp4: ["isobmff"],
  heic: ["isobmff"],
  heif: ["isobmff"],
};

/**
 * Validasi file sebelum upload:
 * 1. Konten HTML/SVG/script ditolak apa pun ekstensinya.
 * 2. Ekstensi yang dikenal harus cocok dengan magic-number isinya.
 * 3. Ekstensi yang tidak dikenal dibiarkan lolos (agar tidak mematikan fitur
 *    yang sudah ada) selama bukan konten aktif — penyaringan finalnya tetap
 *    tanggung jawab media-server.
 */
export async function validateUploadFile(
  file: File,
): Promise<FileValidationResult> {
  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return {
      ok: false,
      message: "File tidak dapat dibaca.",
      code: "unreadable",
    };
  }

  if (bytes.length === 0) {
    return {
      ok: false,
      message: "File kosong tidak dapat diunggah.",
      code: "empty",
    };
  }

  const head = bytes.subarray(0, 512);

  if (looksLikeActiveContent(head)) {
    return {
      ok: false,
      message:
        "File ditolak karena isinya terdeteksi mengandung konten aktif (HTML/skrip) yang berpotensi berbahaya, bukan dokumen biasa.",
      code: "unsafe_file",
    };
  }

  const name = file.name ?? "";
  const ext = name.includes(".") ? name.split(".").pop()?.toLowerCase() : null;
  const allowedKinds = ext ? EXT_TO_KINDS[ext] : undefined;

  if (allowedKinds) {
    const kind = sniffKind(head);
    if (!kind || !allowedKinds.includes(kind)) {
      return {
        ok: false,
        message: `Isi file tidak sesuai dengan ekstensi .${ext}. Silakan unggah file ${ext?.toUpperCase()} yang valid.`,
        code: "type_mismatch",
      };
    }
  }

  // Deep-scan seluruh isi file untuk pola berbahaya (setara scanning di mobile).
  if (
    (ext === "pdf" || sniffKind(head) === "pdf") &&
    looksLikeDangerousPdf(bytes)
  ) {
    return {
      ok: false,
      message:
        "File PDF ditolak karena mengandung JavaScript atau aksi otomatis (auto-run) yang berpotensi berbahaya.",
      code: "unsafe_file",
    };
  }

  const isImageExt =
    ext === "png" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "gif" ||
    ext === "webp";
  if (isImageExt && looksLikeDangerousImage(bytes)) {
    return {
      ok: false,
      message:
        "File gambar ditolak karena di dalamnya tersisip skrip (script/PHP) yang berpotensi berbahaya.",
      code: "unsafe_file",
    };
  }

  return { ok: true };
}
