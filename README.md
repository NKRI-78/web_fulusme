# FuLusme — Web Crowdfunding Sukuk

FuLusme adalah platform crowdfunding investasi yang mempertemukan **Pemodal** (investor) dengan **Penerbit** (pelaku usaha). Melalui platform ini, pengguna dapat menjelajahi proyek yang tersedia, melakukan proses verifikasi identitas (KYC), menandatangani akad investasi secara digital, melakukan pembayaran, serta memantau portofolio dan riwayat transaksi mereka.

## Deskripsi

Platform ini melayani dua peran pengguna utama:

- **Pemodal (Investor)** — individu atau perusahaan yang ingin berinvestasi pada proyek. Mendaftar melalui alur onboarding yang mencakup pengisian data diri/perusahaan, unggah dokumen pendukung, verifikasi wajah/identitas via kamera, hingga tanda tangan digital pada akad investasi.
- **Penerbit (Issuer)** — pelaku usaha yang mengajukan dan menerbitkan proyek untuk didanai oleh para pemodal, lengkap dengan proses pengajuan dan kelengkapan dokumen.

Setelah proses investasi berjalan, pengguna dapat memantau portofolio, riwayat transaksi, status pembayaran, serta menerima notifikasi/pengumuman (broadcast) terkait proyek dan akun mereka.

## Teknologi

- **Framework**: Next.js (App Router) dengan React & TypeScript
- **Autentikasi**: NextAuth, verifikasi captcha (Google reCAPTCHA)
- **Manajemen state**: Redux Toolkit
- **Komunikasi data**: Axios (REST API), Socket.IO (notifikasi real-time)
- **Formulir & validasi**: React Hook Form dengan Zod
- **Tampilan/UI**: Tailwind CSS, Headless UI, Framer Motion, Swiper, SweetAlert2
- **Dokumen & verifikasi**: PDF viewer/generator, pratinjau dokumen Word, tanda tangan digital (signature canvas), OCR untuk pemindaian dokumen identitas, unggah & kompresi gambar
- **Visualisasi data**: Chart.js untuk statistik dashboard dan portofolio
- **Peta**: Google Maps
- **Lainnya**: OTP input untuk verifikasi akun, form bertahap (multi-step) untuk proses onboarding, countdown timer, tabel data interaktif

## Peta Halaman (Routes)

### Umum

| Halaman                    | Deskripsi                   |
| -------------------------- | --------------------------- |
| `/`                        | Beranda                     |
| `/about-us`                | Tentang FuLusme             |
| `/privacy-policy`          | Kebijakan privasi           |
| `/terms-conditions`        | Syarat & ketentuan          |
| `/informasi`               | Daftar pengumuman/broadcast |
| `/informasi/[broadcastId]` | Detail pengumuman           |
| `/viewer`                  | Pratinjau berkas/dokumen    |

### Autentikasi & Akun

| Halaman                        | Deskripsi                                     |
| ------------------------------ | --------------------------------------------- |
| `/auth/login`                  | Masuk ke akun                                 |
| `/auth/register`               | Pendaftaran akun baru (dengan verifikasi OTP) |
| `/auth/forgot-password`        | Permintaan reset kata sandi                   |
| `/auth/[slug]/change-password` | Ubah kata sandi                               |
| `/profile`                     | Profil pengguna                               |

### Pendaftaran Pemodal & Penerbit

| Halaman                         | Deskripsi                                   |
| ------------------------------- | ------------------------------------------- |
| `/form-pemodal`                 | Formulir pendaftaran pemodal perorangan     |
| `/form-pemodal-perusahaan`      | Formulir pendaftaran pemodal berbadan usaha |
| `/form-data-pemodal-perusahaan` | Data tambahan pemodal berbadan usaha        |
| `/form-penerbit`                | Formulir pendaftaran penerbit (multi-tahap) |
| `/dokumen-pelengkap`            | Unggah dokumen kelengkapan penerbit         |
| `/create-project`               | Pengajuan proyek sukuk baru oleh penerbit   |
| `/form-signature`               | Tanda tangan digital pada akad investasi    |
| `/take-picture`                 | Verifikasi wajah/identitas melalui kamera   |

### Investasi & Proyek

| Halaman              | Deskripsi                                                               |
| -------------------- | ----------------------------------------------------------------------- |
| `/sukuk/[projectId]` | Detail proyek sukuk                                                     |
| `/business-list`     | Daftar bisnis/penerbit _(dalam pengembangan)_                           |
| `/pasar-sekunder`    | Pasar sekunder — jual-beli kepemilikan investasi _(dalam pengembangan)_ |

### Pembayaran & Transaksi

| Halaman                | Deskripsi                             |
| ---------------------- | ------------------------------------- |
| `/payment-method/[id]` | Pemilihan metode pembayaran           |
| `/payment-manual/[id]` | Pembayaran manual via transfer bank   |
| `/waiting-payment`     | Status menunggu konfirmasi pembayaran |
| `/transaction`         | Riwayat transaksi                     |
| `/inbox`               | Kotak masuk notifikasi                |

### Dashboard

| Halaman                           | Deskripsi                           |
| --------------------------------- | ----------------------------------- |
| `/dashboard/main`                 | Ringkasan utama dashboard           |
| `/dashboard/portfolio`            | Portofolio investasi pemodal        |
| `/dashboard/investor-transaction` | Riwayat transaksi pemodal           |
| `/dashboard/emiten-transaction`   | Riwayat transaksi penerbit (emiten) |
