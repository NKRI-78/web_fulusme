import { z } from "zod";

export const formDokumenPelengkapPenerbitSchema = z.object({
  fotoKantorKaryawan: z
    .array(z.string())
    .min(1, "Foto Kantor & Karyawan wajib diupload minimal 1 foto."),
  fotoKegiatanUsaha: z
    .array(z.string())
    .min(1, "Foto Kegiatan Usaha wajib diupload minimal 1 foto."),
  videoProfilPerusahaan: z
    .string()
    .min(1, "Video Profil Prusahaan wajib diupload."),
  suratKeteranganDomisili: z
    .string()
    .min(1, "Surat Keterangan Domisili wajib diupload."),
  dokumenPerizinanLainnya: z
    .string()
    .min(1, "Surat Pernyataan APU-PPT wajib diupload."),
  shortCvManajemen: z.string().min(1, "Short CV Manajemen wajib diupload."),
  daftarPiutang: z.string().min(1, "Daftar Piutang wajib diupload."),
  listDataSupplier: z.string().min(1, "List Data Supplier wajib diupload."),
  listPekerjaan2TahunTerakhir: z
    .string()
    .min(1, "List Pekerjaan 2 Tahun Terakhir wajib diupload."),
  laporanPajakTahunan: z
    .string()
    .min(1, "Laporan Pajak Tahunan wajib diupload."),
  rab: z.string().min(1, "RAB wajib diupload."),
  cashflowProject: z.string().min(1, "Cashflow Project wajib diupload."),
  timelinePekerjaan: z.string().min(1, "Timeline Pekerjaan wajib diupload."),
  projectSummary: z.string().min(1, "Project Summary wajib diupload."),
  proyeksiPendapatan: z.string().min(1, "Proyeksi Pendapatan wajib diupload."),
});

export type FormDokumenPelengkapPenerbitSchema = z.infer<
  typeof formDokumenPelengkapPenerbitSchema
>;

export const defaultValues: FormDokumenPelengkapPenerbitSchema = {
  fotoKantorKaryawan: [],
  fotoKegiatanUsaha: [],
  videoProfilPerusahaan: "",
  suratKeteranganDomisili: "",
  dokumenPerizinanLainnya: "",
  shortCvManajemen: "",
  daftarPiutang: "",
  listDataSupplier: "",
  listPekerjaan2TahunTerakhir: "",
  laporanPajakTahunan: "",
  rab: "",
  cashflowProject: "",
  timelinePekerjaan: "",
  projectSummary: "",
  proyeksiPendapatan: "",
};
