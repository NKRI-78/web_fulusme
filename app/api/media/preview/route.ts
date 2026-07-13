import { NextRequest, NextResponse } from "next/server";
import { API_BACKEND_MEDIA, MEDIA_ALLOWED_HOSTS } from "@/app/utils/constant";

/**
 * Remediasi OAO Temuan 1 — Stored XSS via Upload Document (defense-in-depth).
 *
 * Route Handler ini mem-proxy dokumen dari media-server melalui Next.js dan
 * MEMAKSA header respons agar file diunduh (attachment) dan tidak pernah
 * dirender inline oleh viewer browser (Chrome PDFium, dll) — sehingga
 * JavaScript yang mungkin tertanam di PDF (/OpenAction, /AA, /JavaScript)
 * tidak pernah mendapat kesempatan dieksekusi.
 *
 * Catatan: ini TIDAK menggantikan validasi MIME/magic-number & sanitasi PDF
 * di sisi media-server (tanggung jawab tim backend — lihat
 * doc/remediasi-oao-temuan1-media-server-spec.md). Ini lapisan pertahanan
 * tambahan di sisi FE/BFF.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Host media-server yang diizinkan (cegah SSRF / open proxy).
 * Utama: NEXT_PUBLIC_MEDIA_ALLOWED_HOSTS (dipisah koma) — mendukung lebih
 * dari satu domain (mis. fulusme.id dan langitdigital78.com).
 * Fallback: host dari NEXT_PUBLIC_API_BACKEND_MEDIA.
 */
function getAllowedHosts(): string[] {
  if (MEDIA_ALLOWED_HOSTS.length > 0) return MEDIA_ALLOWED_HOSTS;

  if (API_BACKEND_MEDIA) {
    try {
      return [new URL(API_BACKEND_MEDIA).host];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Sanitasi nama file sebelum diinterpolasi ke header Content-Disposition.
 * Membuang path, kutip, backslash, dan karakter kontrol (termasuk CRLF)
 * untuk mencegah header injection.
 */
function sanitizeFilename(pathname: string): string {
  let base: string;
  try {
    base = decodeURIComponent(pathname.split("/").pop() ?? "");
  } catch {
    base = pathname.split("/").pop() ?? "";
  }

  const cleaned = base
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 31 && code !== 127 && ch !== '"' && ch !== "\\";
    })
    .join("")
    .trim();

  return cleaned.length > 0 ? cleaned : "dokumen";
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json(
      { error: "Parameter 'url' wajib diisi." },
      { status: 400 },
    );
  }

  const allowedHosts = getAllowedHosts();
  if (allowedHosts.length === 0) {
    return NextResponse.json(
      { error: "Konfigurasi media-server tidak tersedia." },
      { status: 500 },
    );
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  // Hanya izinkan http(s) dan host media-server yang di-allowlist.
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return NextResponse.json(
      { error: "Protokol tidak diizinkan." },
      { status: 400 },
    );
  }
  if (!allowedHosts.includes(target.host)) {
    return NextResponse.json(
      { error: "Host tidak diizinkan." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    // URL dokumen bersifat publik di media-server; tidak perlu credential.
    upstream = await fetch(target.toString(), {
      cache: "no-store",
      redirect: "error", // cegah redirect keluar dari host allowlist
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil dokumen dari media-server." },
      { status: 502 },
    );
  }

  if (upstream.status === 401 || upstream.status === 403) {
    return NextResponse.json(
      { error: "Tidak diizinkan mengakses dokumen." },
      { status: upstream.status },
    );
  }
  if (upstream.status === 404) {
    return NextResponse.json(
      { error: "Dokumen tidak ditemukan." },
      { status: 404 },
    );
  }
  if (!upstream.ok || !upstream.body) {
    // Jangan teruskan body error upstream mentah ke client.
    return NextResponse.json(
      { error: "Media-server mengembalikan galat." },
      { status: 502 },
    );
  }

  const filename = sanitizeFilename(target.pathname);

  const headers = new Headers();
  // Override header upstream apa pun: paksa unduh, jangan render inline.
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", "default-src 'none'");
  headers.set("Cache-Control", "private, no-store");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(upstream.body, { status: 200, headers });
}
