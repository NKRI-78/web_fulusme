import z from "zod";

export const alamatSchema = z.object({
  name: z.string().optional(),

  province_name: z
    .string({
      required_error: "Provinsi wajib diisi",
      invalid_type_error: "Provinsi harus berupa teks",
    })
    .min(1, "Provinsi wajib diisi"),

  city_name: z
    .string({
      required_error: "Kota wajib diisi",
      invalid_type_error: "Kota harus berupa teks",
    })
    .min(1, "Kota wajib diisi"),

  district_name: z
    .string({
      required_error: "Kecamatan wajib diisi",
      invalid_type_error: "Kecamatan harus berupa teks",
    })
    .min(1, "Kecamatan wajib diisi"),

  subdistrict_name: z
    .string({
      required_error: "Kelurahan wajib diisi",
      invalid_type_error: "Kelurahan harus berupa teks",
    })
    .min(1, "Kelurahan wajib diisi"),

  postal_code: z
    .string({
      required_error: "Kode pos wajib diisi",
      invalid_type_error: "Kode pos harus berupa teks",
    })
    .min(1, "Kode pos wajib diisi"),

  detail: z
    .string({
      required_error: "Detail alamat wajib diisi",
      invalid_type_error: "Detail alamat harus berupa teks",
    })
    .min(1, "Detail alamat wajib diisi"),
});

export interface ProjectTypeInterface {
  id: string;
  name: string;
}

const MIN_DANA =
  process.env.NODE_ENV === "production" ? 100_000_000 : 1_000_000;

const mapsResultSchema = z.object({
  lat: z.coerce.number().min(-90, "Latitude wajib ada"),
  lng: z.coerce.number().min(-180, "Longitude wajib ada"),
  url: z.string().url("URL lokasi tidak valid"),
  address: z.string().min(1, "Alamat wajib diisi"),
  components: z.record(z.string().optional()),
});

export const createProjectPenerbitSchema = z
  .object({
    namaProyek: z.string().min(1, "Nama Proyek tidak boleh kosong"),
    deskripsiProyek: z.string().min(1, "Deskripsi Proyek tidak boleh kosong"),
    jenisProyek: z.string().min(1, "Jenis Proyek wajib dipilih"),
    tenor: z.string().min(1, "Tenor Pinjaman wajib dipilih"),

    tanggalMulaiProyek: z.string().min(1, "Tanggal Mulai Proyek wajib dipilih"),
    tanggalSelesaiProyek: z
      .string()
      .min(1, "Tanggal Selesai Proyek wajib dipilih"),

    jaminanKolateral: z
      .array(z.string())
      .min(1, "Jaminan Kolateral wajib dipilih"),

    persentaseKeuntungan: z.coerce
      .number({
        required_error: "Persentase Keuntungan wajib diisi",
        invalid_type_error: "Persentase Keuntungan harus berupa angka",
      })
      .min(10, "Minimal 10%")
      .max(100, "Maksimal 100%"),

    danaYangDibutuhkan: z.coerce
      .number({
        required_error: "Modal Proyek wajib diisi",
        invalid_type_error: "Modal Proyek harus berupa angka",
      })
      .min(
        MIN_DANA,
        `Minimal Rp${process.env.NODE_ENV === "production" ? "100.000.000" : "1.000.000"}`,
      )
      .max(10_000_000_000, "Maksimal Rp10.000.000.000"),

    modalProyek: z.coerce.number({
      required_error: "Modal Proyek wajib diisi",
      invalid_type_error: "Modal Proyek harus berupa angka",
    }),

    fotoProyek: z
      .array(z.string().url("Format URL foto tidak valid"))
      .min(1, "Foto Proyek wajib diupload minimal 1 foto"),

    instansiProyek: z
      .string()
      .min(1, "Instansi Pemberi Proyek tidak boleh kosong"),
    jenisInstansiProyek: z
      .string()
      .min(1, "Jenis Instansi Proyek tidak boleh kosong"),

    websiteInstansiProyek: z.string().url("Url Website instansi tidak valid"),

    fileSPK: z.string().min(1, "File SPK wajib diupload"),
    fileLOA: z.string().min(1, "File LOA wajib diupload"),
    dokumenKontrak: z.string().min(1, "Dokumen Kontrak wajib diupload"),
    rekeningKoran: z.string().min(1, "Rekening Koran wajib diupload"),
    laporanKeuangan: z.string().min(1, "Laporan Keuangan wajib diupload"),
    prospektus: z.string().optional(),

    lokasiProyek: mapsResultSchema.nullable(),

    address: z.array(alamatSchema).min(1, "Minimal 1 alamat harus diisi"),
  })
  .refine((data) => data.lokasiProyek !== null, {
    message: "Lokasi Proyek wajib diisi",
    path: ["lokasiProyek"],
  })
  .superRefine((data, ctx) => {
    // validasi modal proyek < dana
    if (data.modalProyek < data.danaYangDibutuhkan) {
      ctx.addIssue({
        code: "custom",
        path: ["modalProyek"],
        message: `Modal Proyek minimal harus sebesar Dana yang Dibutuhkan (${data.danaYangDibutuhkan.toLocaleString(
          "id-ID",
        )})`,
      });
    }

    // validasi tanggal selesai >= tanggal mulai
    if (data.tanggalMulaiProyek && data.tanggalSelesaiProyek) {
      const start = new Date(data.tanggalMulaiProyek);
      const end = new Date(data.tanggalSelesaiProyek);

      if (end < start) {
        ctx.addIssue({
          code: "custom",
          path: ["tanggalSelesaiProyek"],
          message:
            "Tanggal Selesai Proyek tidak boleh lebih awal dari Tanggal Mulai Proyek",
        });
      }
    }
  });

export const defaultValues: CreateProjectFormSchema = {
  namaProyek: "",
  deskripsiProyek: "",
  jenisProyek: "",
  tenor: "",
  tanggalMulaiProyek: "",
  tanggalSelesaiProyek: "",
  jaminanKolateral: [],
  danaYangDibutuhkan: 0,
  modalProyek: 0,
  persentaseKeuntungan: 0,
  fotoProyek: [],
  instansiProyek: "",
  jenisInstansiProyek: "",
  websiteInstansiProyek: "",
  fileSPK: "",
  fileLOA: "",
  dokumenKontrak: "",
  rekeningKoran: "",
  laporanKeuangan: "",
  prospektus: "",
  lokasiProyek: null,
  address: [
    {
      name: "Pemberi Proyek",
      province_name: "",
      city_name: "",
      district_name: "",
      subdistrict_name: "",
      postal_code: "",
      detail: "",
    },
  ],
};

export type CreateProjectFormSchema = z.infer<
  typeof createProjectPenerbitSchema
>;
