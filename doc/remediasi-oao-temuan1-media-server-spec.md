# Spesifikasi Remediasi Server-Side — OAO Temuan 1 (Stored XSS on Upload Document)

**Untuk:** Tim backend media-server (`api-media-fulusme.fulusme.id`)
**Referensi:** Laporan IT Assessment PT Veda Praxis (VAPT, 18–22 Mei 2026) & Tanggapan PT Langit Digital 78 (30 Juni 2026), Bab 3.1
**Risiko:** HIGH — OWASP Top 10 2021 A03 (Injection), CWE-79 — SLA 14 hari kalender
**Endpoint terdampak:** `POST /api/v1/media/upload-fulusme` + endpoint serving file (`/uploads/...`)

## Konteks

Pentest membuktikan file PDF ber-payload JavaScript dapat diunggah dan dirender **inline** oleh browser, sehingga skrip tereksekusi di origin media-server (Stored XSS). Aplikasi web (repo ini) sudah menerapkan mitigasi sisi FE/BFF:

1. Validasi magic-number client-side sebelum upload (`app/helper/fileValidation.ts`).
2. Proxy `GET /api/media/preview?url=...` yang memaksa `Content-Disposition: attachment` sehingga dokumen tidak pernah dirender inline lewat aplikasi web.

**Namun mitigasi FE dapat dilewati** dengan mengunggah langsung ke endpoint upload atau membuka URL file langsung di media-server. Validasi otoritatif WAJIB di server. Item berikut adalah tanggung jawab media-server (poin 1, 2, 4 pada rencana remediasi Bab 3.1):

## 1. Validasi tipe file berbasis magic number (WAJIB)

Pada `POST /api/v1/media/upload-fulusme`:

- Tolak file bila byte awal (signature) tidak cocok dengan ekstensi/MIME yang diklaim. Signature minimum yang perlu dikenali:
  - PDF: `25 50 44 46` (`%PDF`)
  - PNG: `89 50 4E 47`; JPEG: `FF D8 FF`; GIF: `47 49 46 38`; WEBP: `52 49 46 46 .. .. .. .. 57 45 42 50`
  - DOC (OLE2): `D0 CF 11 E0 A1 B1 1A E1`; DOCX (ZIP): `50 4B 03 04`
  - MP4/HEIC/HEIF: box `66 74 79 70` (`ftyp`) di offset 4
- **Selalu tolak** konten aktif apa pun ekstensinya: HTML (`<!doctype`, `<html`, `<script`), SVG (`<svg`), XML (`<?xml`).
- Jangan percaya header `Content-Type` dari client maupun ekstensi nama file — keduanya dikendalikan penyerang.
- Terapkan allowlist ekstensi: `pdf, doc, docx, png, jpg, jpeg, gif, webp, mp4, heic, heif`. Ekstensi lain ditolak.
- Simpan file dengan nama yang digenerate server (UUID) — jangan pakai nama asli dari client di path penyimpanan (nama asli cukup disimpan sebagai metadata).

## 2. Sanitasi konten PDF (WAJIB)

Untuk file PDF yang lolos validasi:

- Parse dengan pustaka safe PDF parser (mis. `pdf-lib`/`mutool clean`/qpdf) dan **hapus atau tolak** objek berbahaya:
  - `/JavaScript` dan `/JS` (embedded script)
  - `/OpenAction` dan `/AA` (auto-action saat dokumen dibuka)
  - `/Launch`, `/EmbeddedFile`, `/RichMedia`
- Alternatif yang lebih sederhana dan sama efektifnya: **rekonstruksi** PDF (render ulang halaman ke PDF baru), sehingga hanya konten visual yang dipertahankan.
- Bila sanitasi gagal/parser error → tolak upload (fail-closed).

## 3. Header respons saat serving file (WAJIB)

Pada endpoint yang menyajikan file upload (`/uploads/...`):

```
Content-Disposition: attachment; filename="<nama-tersanitasi>"
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; sandbox
Cache-Control: private, no-store
```

- Jangan sajikan file upload dengan `Content-Type` yang bisa dirender aktif oleh browser (`text/html`, `image/svg+xml`, dsb). Untuk dokumen, `application/octet-stream` paling aman.
- Idealnya file upload disajikan dari **domain/origin terpisah** dari domain aplikasi (sudah terpenuhi: `api-media-fulusme.*` ≠ `fulusme.id`) — pertahankan pemisahan ini.

## 4. Rekomendasi tambahan (SANGAT DISARANKAN)

- Batasi ukuran file di server (FE membatasi 10 MB; server harus menegakkan hal yang sama).
- Rate-limit endpoint upload per user/IP.
- Endpoint upload saat ini menerima request **tanpa autentikasi efektif dari sisi file serving** — file dapat diakses publik via URL langsung. Evaluasi penggunaan signed URL berumur pendek (endpoint `GET /api/v1/media/{id}/signed` sudah ada) untuk semua akses dokumen sensitif (KTP/NPWP), dan tutup akses direct-path bila memungkinkan.
- Audit endpoint upload lain selain `/media/upload-fulusme` dengan standar validasi yang sama (rekomendasi Bab 6 poin 1 dokumen tanggapan).

## Kriteria selesai (acceptance)

1. Upload file HTML/SVG yang di-rename `.pdf` → ditolak (4xx).
2. Upload PDF berisi `/OpenAction` + `/JavaScript` → ditolak, atau tersimpan tanpa objek script.
3. `curl -I https://api-media-fulusme.fulusme.id/uploads/.../file.pdf` → respons memuat `Content-Disposition: attachment` dan `X-Content-Type-Options: nosniff`.
4. Membuka URL file langsung di browser → file terunduh, tidak dirender inline, tidak ada dialog/script yang tereksekusi.
