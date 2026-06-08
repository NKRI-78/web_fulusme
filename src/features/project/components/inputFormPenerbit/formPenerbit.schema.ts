import { z } from "zod";

const baseManajemenSchema = z.object({
  id: z.string().optional(),
  nama: z
    .string({ required_error: "Nama wajib diisi" })
    .trim()
    .min(1, "Nama wajib diisi"),
  noKTP: z
    .string({ required_error: "No KTP harus tepat 16 digit angka" })
    .trim()
    .regex(/^\d{16}$/, "No KTP harus tepat 16 digit angka"),
  fileKTP: z
    .string({ required_error: "File KTP wajib diunggah" })
    .trim()
    .min(1, "File KTP wajib diunggah"),
  fileNPWP: z
    .string({ required_error: "File NPWP wajib diunggah" })
    .trim()
    .min(1, "File NPWP wajib diunggah"),
});

const direkturItemSchema = baseManajemenSchema.extend({
  jabatan: z.enum(["direktur-utama", "direktur"], {
    required_error: "Jabatan wajib dipilih",
  }),
});

const komisarisItemSchema = baseManajemenSchema.extend({
  jabatan: z.enum(["komisaris-utama", "komisaris"], {
    required_error: "Jabatan wajib dipilih",
  }),
});

export const FormPenerbitSchema = z.object({
  laporanKeuangan: z
    .string({ required_error: "Laporan Keuangan wajib diisi" })
    .trim()
    .min(1, "Laporan Keuangan wajib diisi"),
  rekeningKoran: z
    .string({ required_error: "Rekening Koran wajib diisi" })
    .trim()
    .min(1, "Rekening Koran wajib diisi"),

  company_nib_path: z
    .string({ required_error: "Dokumen NIB wajib diunggah" })
    .trim()
    .min(1, { message: "Dokumen NIB wajib diunggah" }),
  akta_pendirian: z
    .string({ required_error: "Akte pendirian wajib diunggah" })
    .trim()
    .min(1, { message: "Akte pendirian wajib diunggah" }),
  sk_kumham_path: z
    .string({ required_error: "SK Kumham wajib diunggah" })
    .trim()
    .min(1, { message: "SK Kumham wajib diunggah" }),
  akta_perubahan_terahkir_path: z
    .string({ required_error: "Akte perubahan terakhir wajib diunggah" })
    .trim()
    .min(1, { message: "Akte perubahan terakhir wajib diunggah" }),
  sk_kumham_terahkir: z
    .string({ required_error: "SK Kumham terakhir wajib diunggah" })
    .trim()
    .min(1, { message: "SK Kumham terakhir wajib diunggah" }),
  siup: z
    .string({
      required_error: "Surat Izin Usaha Perdagangan wajib diunggah",
    })
    .trim()
    .min(1, { message: "Surat Izin Usaha Perdagangan wajib diunggah" }),
  tdp: z
    .string({
      required_error: "Tanda Daftar Perusahaan wajib diunggah",
    })
    .trim()
    .min(1, { message: "Tanda Daftar Perusahaan wajib diunggah" }),
  fileNpwp: z
    .string({ required_error: "NPWP wajib diunggah" })
    .trim()
    .min(1, { message: "NPWP wajib diunggah" }),

  direktur: z
    .array(direkturItemSchema, {
      required_error: "Direktur wajib ditambahkan",
    })
    .min(1, "Direktur wajib ditambahkan")
    .max(3, "Maksimal 3 Direktur")
    .refine(
      (arr) => arr.filter((x) => x.jabatan === "direktur-utama").length <= 1,
      { message: "Hanya boleh ada 1 Direktur Utama" }
    ),

  komisaris: z
    .array(komisarisItemSchema, {
      required_error: "Komisaris wajib ditambahkan",
    })
    .min(1, "Komisaris wajib ditambahkan")
    .max(3, "Maksimal 3 Komisaris")
    .refine(
      (arr) => arr.filter((x) => x.jabatan === "komisaris-utama").length <= 1,
      { message: "Hanya boleh ada 1 Komisaris Utama" }
    ),

  total_employees: z
    .string({ required_error: "Jumlah karyawan wajib diisi" })
    .trim()
    .min(1, "Jumlah karyawan wajib diisi")
    .refine((val) => /^\d+$/.test(val), {
      message: "Jumlah karyawan harus berupa angka",
    })
    .refine((val) => Number(val) >= 1, {
      message: "Jumlah karyawan minimal 1 orang",
    }),

  agree: z
    .boolean({ required_error: "Persetujuan wajib dicentang" })
    .refine((v) => v, { message: "Silakan centang persetujuan untuk lanjut." }),
});

export type FormPenerbitValues = z.infer<typeof FormPenerbitSchema>;

export const MAX_DIREKTUR = 3;
export const MAX_KOMISARIS = 3;
