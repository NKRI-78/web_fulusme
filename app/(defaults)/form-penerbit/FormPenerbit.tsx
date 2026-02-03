"use client";

import {
  Controller,
  Path,
  Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import { fetchProvinces } from "@/app/lib/fetchWilayah";
import FormAlamat from "./FormAlamat";
import Swal from "sweetalert2";
import RHFSelect from "./components/TypeBussiness";
import RHFSelectGeneric from "./components/RHFSelectGeneric";
import { fetchJenisUsaha, TypeOption } from "@/app/utils/fetchJenisUsaha";
import { fetchJenisPerusahaan } from "@/app/utils/fetchJenisPerusahaan";
import { fetchStatusCompany } from "@/app/utils/fetchStatusPerushaan";
import { PhoneInput } from "./components/PhoneInput";
import { ProfileUpdate } from "./IProfileUpdate";
import { FORM_PENERBIT_1_CACHE_KEY } from "./form-cache-key";
import { uploadMediaService } from "@/app/helper/mediaService";

export const alamatSchema = z.object({
  name: z.string().optional(),
  province_name: z
    .string({ required_error: "Provinsi wajib diisi" })
    .trim()
    .min(1, "Provinsi wajib diisi"),
  city_name: z
    .string({ required_error: "Kota wajib diisi" })
    .trim()
    .min(1, "Kota wajib diisi"),
  district_name: z
    .string({ required_error: "Kecamatan wajib diisi" })
    .trim()
    .min(1, "Kecamatan wajib diisi"),
  subdistrict_name: z
    .string({ required_error: "Kelurahan wajib diisi" })
    .trim()
    .min(1, "Kelurahan wajib diisi"),
  postal_code: z
    .string({ required_error: "Kode pos wajib diisi" })
    .trim()
    .min(1, "Kode pos wajib diisi")
    .regex(/^\d{5}$/, "Kode pos harus 5 digit angka"),
  detail: z
    .string({ required_error: "Detail alamat wajib diisi" })
    .trim()
    .min(1, "Detail alamat wajib diisi"),
});

export const schema = z
  .object({
    company_name: z
      .string({ required_error: "Nama perusahaan wajib diisi" })
      .trim()
      .min(1, "Nama perusahaan wajib diisi"),

    namaBank: z
      .string({ required_error: "Nama bank wajib dipilih" })
      .trim()
      .min(1, "Nama bank wajib dipilih"),

    jenis_usaha: z
      .string({ required_error: "Jenis usaha wajib dipilih" })
      .trim()
      .min(1, "Jenis usaha wajib dipilih"),
    companyType: z
      .string({ required_error: "Tipe Perusahaan wajib dipilih" })
      .trim()
      .min(1, "Tipe Perusahaan wajib dipilih"),

    statusCompanys: z
      .string({ required_error: "Status Kantor/Tempat Usaha wajib dipilih" })
      .trim()
      .min(1, "Status Kantor/Tempat Usaha wajib dipilih"),

    establishedYear: z
      .string({ required_error: "Tahun berdiri wajib dipilih" })
      .trim()
      .min(1, "Tahun berdiri wajib dipilih")
      .refine(
        (v) =>
          /^\d{4}$/.test(v) && +v >= 1950 && +v <= new Date().getFullYear(),
        "Tahun tidak valid",
      ),

    address: z
      .array(alamatSchema, { required_error: "Alamat wajib diisi" })
      .min(1, "Minimal 1 alamat harus diisi")
      .max(2, "Maksimal hanya 2 alamat"),

    sameAsCompany: z.boolean().optional(),
    detailKorespondensi: z.string().optional(),

    nomorRekening: z
      .string({ required_error: "Nomor rekening wajib diisi" })
      .trim()
      .min(1, "Nomor rekening wajib diisi")
      .regex(/^\d+$/, "Hanya angka"),

    namaPemilik: z
      .string({ required_error: "Nama pemilik wajib diisi" })
      .trim()
      .min(1, "Nama pemilik wajib diisi"),

    noPhoneCompany: z.object({
      kode: z.string().min(1, "Kode wilayah wajib dipilih"),

      nomor: z
        .string({ required_error: "Nomor Telepon Perusahaan wajib diisi" })
        .trim(),
    }),

    webCompany: z
      .string({ required_error: "Situs Perusahaan wajib diisi" })
      .trim()
      .min(1, "Situs Perusahaan wajib diisi")
      .url("Format URL tidak valid (contoh: https://example.com)"),

    emailCompany: z
      .string({ required_error: "Email Perusahaan wajib diisi" })
      .trim()
      .min(1, "Email Perusahaan wajib diisi")
      .email("Format email tidak valid"),
  })
  .superRefine((data, ctx) => {
    if (data.namaPemilik !== data.company_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["namaPemilik"],
        message: "Nama pemilik harus sama dengan nama perusahaan",
      });
    }
  });

export type FormData = z.infer<typeof schema>;

const fetchOptions = async (url: string, parentId?: string) => {
  try {
    const response = await axios.get(
      `${API_BACKEND}/${url}${parentId ? `/${parentId}` : ""}`,
    );
    console.log(
      "URL",
      `${API_BACKEND}/${url}${parentId ? `/${parentId}` : ""}`,
    );

    return response.data?.data.map((item: any) => ({
      value: item.name,
      label: item.name,
      zip_code: item.zip_code,
    }));
  } catch (error) {
    console.error("Failed to fetch options:", error);
    return [];
  }
};

type OptionType = { value: string; label: string; zip_code: string };
type BankOption = { value: string; label: string };

type Props = {
  onNext: () => void;
  profile: ProfileUpdate | null;
  isUpdate: boolean;
};

export default function PublisherForm({ onNext, profile, isUpdate }: Props) {
  const [isReady, setIsReady] = useState(false);

  const [provinsiList, setProvinsiList] = useState<OptionType[]>([]);
  const [kotaList, setKotaList] = useState<Record<number, OptionType[]>>({});
  const [kecamatanList, setKecamatanList] = useState<
    Record<number, OptionType[]>
  >({});
  const [kelurahanList, setKelurahanList] = useState<
    Record<number, OptionType[]>
  >({});

  const [bank, setBank] = useState<Array<{ code: string; name: string }>>([]);

  const bankOptions: BankOption[] = bank.map((b) => ({
    value: b.name,
    label: b.name,
  }));

  const [optionsBussines, setOptionsBussines] = useState<TypeOption[]>([]);
  const [optionsCompanyType, setOptionsCompanyType] = useState<TypeOption[]>(
    [],
  );
  const [statusCompany, setstatusCompany] = useState<TypeOption[]>([]);

  useEffect(() => {
    fetchJenisUsaha()
      .then(setOptionsBussines)
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    fetchJenisPerusahaan()
      .then(setOptionsCompanyType)
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    fetchStatusCompany()
      .then(setstatusCompany)
      .catch((err) => console.error(err));
  }, []);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    mode: "onBlur",
    defaultValues: {
      sameAsCompany: false,
      noPhoneCompany: undefined,
      webCompany: "",
      emailCompany: "",
      namaBank: "",
      nomorRekening: "",
      namaPemilik: "",
      companyType: undefined,
      statusCompanys: undefined,
      establishedYear: "",
      address: [
        {
          name: "Company",
          province_name: "",
          city_name: "",
          district_name: "",
          subdistrict_name: "",
          postal_code: "",
          detail: "",
        },
        {
          name: "Koresponden",
          province_name: "",
          city_name: "",
          district_name: "",
          subdistrict_name: "",
          postal_code: "",
          detail: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({ control, name: "address" });

  const companyName = watch("company_name");

  useEffect(() => {
    if (companyName) {
      setValue("namaPemilik", companyName, { shouldValidate: true });
    }
  }, [companyName, setValue]);

  useEffect(() => {
    const loadProvinces = async () => {
      const provinsiList = await fetchProvinces();
      setProvinsiList(provinsiList);
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    if (isUpdate && profile !== null) {
      setValue("company_name", profile?.company.name ?? "-");
      if (profile?.company.address) {
        const mappedAddress = profile.company.address.map((addr) => ({
          province_name: addr.province_name ?? "",
          city_name: addr.city_name ?? "",
          district_name: addr.district_name ?? "",
          subdistrict_name: addr.subdistrict_name ?? "",
          postal_code: addr.postal_code ?? "",
          detail: addr.detail ?? "",
          name: addr.name ?? "",
        }));

        console.log("Address ", mappedAddress);

        setValue("address", mappedAddress);
      }
    }
  }, [isUpdate, profile]);

  function isEmptyAddress(a: any = {}) {
    return [
      "province_name",
      "city_name",
      "district_name",
      "subdistrict_name",
      "postal_code",
      "detail",
    ].every((k) => !a?.[k]);
  }

  function isSameAddress(a: any = {}, b: any = {}) {
    if (isEmptyAddress(a) || isEmptyAddress(b)) return false;

    return [
      "province_name",
      "city_name",
      "district_name",
      "subdistrict_name",
      "postal_code",
      "detail",
    ].every((k) => (a?.[k] || "") === (b?.[k] || ""));
  }

  const alamatPerusahaan = useWatch({
    control,
    name: "address.0",
  });

  const alamatKoresponden = useWatch({
    control,
    name: "address.1",
  });

  const sameAsCompany = useWatch({
    control,
    name: "sameAsCompany",
  });

  useEffect(() => {
    const sama = isSameAddress(alamatPerusahaan, alamatKoresponden);

    if (sama && !sameAsCompany) {
      setValue("sameAsCompany", true, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }

    if (!sama && sameAsCompany) {
      setValue("sameAsCompany", false, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [alamatPerusahaan, alamatKoresponden]);

  useEffect(() => {
    if (!sameAsCompany) return;

    setValue(
      "address.1",
      {
        ...alamatPerusahaan,
        name: "Koresponden",
      },
      {
        shouldValidate: false,
        shouldDirty: true,
      },
    );
  }, [alamatPerusahaan, sameAsCompany, setValue]);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const response = await axios.get(
          `https://api.gateway.langitdigital78.com/v1/bank`,
        );
        setBank(response.data.data.beneficiary_banks);
      } catch (error) {
        console.error("Gagal ambil bank:", error);
      }
    };

    fetchBank();
  }, []);

  useEffect(() => {
    const draft = localStorage.getItem(FORM_PENERBIT_1_CACHE_KEY);
    if (draft) {
      reset(JSON.parse(draft));
    }
    setIsReady(true);
  }, [reset]);

  const values = watch();
  useEffect(() => {
    if (!isReady) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(FORM_PENERBIT_1_CACHE_KEY, JSON.stringify(values));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [values, isReady]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Data, ", data);
      onNext();
    } catch (err) {
      console.error(err);
      alert("Gagal submit");
    }
  };

  if (!isReady) {
    return <p>Loading...</p>;
  }

  const showErrorToasts = () => {
    Object.values(errors).forEach((err) => {
      if (!err?.message) return;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    });
  };

  const onlyDigits: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue("nomorRekening", e.target.value.replace(/\D/g, ""), {
      shouldValidate: true,
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: Path<FormData>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      Swal.fire({
        title: "Ukuran File Terlalu Besar",
        text: `Maksimal ukuran file adalah ${maxSizeInMB}MB.`,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const uploadMediaResult = await uploadMediaService(file);

      let fileUrl = "-";

      if (uploadMediaResult.ok && uploadMediaResult.data) {
        fileUrl = uploadMediaResult.data.path;
      }

      const uploadMessages = {
        company_nib_path: "Upload NIB Perusahaan berhasil!",
        akta_pendirian: "Upload Akta Pendirian berhasil!",
        sk_kumham_path: "Upload SK KUMHAM berhasil!",
        akta_perubahan_terahkir_path:
          "Upload Akta Perubahan Terakhir berhasil!",
        sk_kumham_terahkir: "Upload SK KUMHAM Terakhir berhasil!",
        siup: "Upload Surat Izin Usaha Perdagangan berhasil!",
        tdp: "Upload Tanda Daftar Perusahaan berhasil!",
        fileNpwp: "Upload NPWP berhasil!",
      } as const;

      if (fileUrl) {
        setValue(field, fileUrl, { shouldValidate: true });
        if (field in uploadMessages) {
          const message = uploadMessages[field as keyof typeof uploadMessages];
          Swal.fire({
            title: "Berhasil",
            text: message,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      } else {
        alert(`Upload ${field} gagal!`);
      }
    } catch (error) {
      alert(`Upload ${field} error!`);
    }
  };

  return (
    <section className="bg-white text-black items-center px-3 md:px-10">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error("VALIDATION ERRORS:", errors);
        })}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Isi Data Sebagai Penerbit</h2>
          <p className="text-sm text-gray-600">
            Untuk memastikan kelancaran proses verifikasi dan layanan yang
            optimal, lengkapi data secara jujur, benar, dan akurat.
          </p>

          <h3 className="font-semibold text-black">1. Informasi Penerbit</h3>

          <div>
            <label className="block mb-1 text-black">
              Nama Perusahaan<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("company_name")}
              className="w-full border px-3 py-2 rounded"
              placeholder="Masukkan Nama Perusahaan"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm">
                {errors.company_name.message}
              </p>
            )}
          </div>
          <label className="block font-medium">
            Tahun Berdiri <span className="text-red-500">*</span>
          </label>
          <RHFSelectGeneric<FormData, "establishedYear">
            name="establishedYear"
            control={control}
            options={yearOptions}
          />
          {errors.establishedYear && (
            <p className="text-sm text-red-600">
              {errors.establishedYear.message}
            </p>
          )}
          <RHFSelect<FormData, "jenis_usaha">
            name="jenis_usaha"
            control={control}
            options={optionsBussines}
          />

          <label className="block font-medium">
            Tipe Perusahaan <span className="text-red-500">*</span>
          </label>
          <RHFSelectGeneric<FormData, "companyType">
            name="companyType"
            control={control}
            options={optionsCompanyType}
          />
          {errors.companyType && (
            <p className="text-sm text-red-600">{errors.companyType.message}</p>
          )}

          <label className="block font-medium">
            Status Kantor/Tempat Usaha <span className="text-red-500">*</span>
          </label>
          <RHFSelectGeneric<FormData, "statusCompanys">
            name="statusCompanys"
            control={control}
            options={statusCompany}
          />
          {errors.statusCompanys && (
            <p className="text-sm text-red-600">
              {errors.statusCompanys.message}
            </p>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nomor Telepon Perusahaan{" "}
              <span className="text-red-500 ml-1">*</span>
            </label>
            {/* <input
              {...register("noPhoneCompany")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={phoneNumber}
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Nomor Telepon Perusahaan"
            /> */}
            <Controller
              control={control}
              name="noPhoneCompany"
              render={({ field }) => {
                return (
                  <PhoneInput
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                );
              }}
            />

            {errors.noPhoneCompany && (
              <p className="text-red-500 text-sm mt-1">
                {errors.noPhoneCompany.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Situs Perusahaan <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("webCompany")}
              type="text"
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Situs Perusahaan"
            />
            {errors.webCompany && (
              <p className="text-red-500 text-sm mt-1">
                {errors.webCompany.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Email Perusahaan <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("emailCompany")}
              type="text"
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Email Perusahaan"
            />
            {errors.emailCompany && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailCompany.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((item, index) => (
            <FormAlamat
              key={item.id}
              index={index}
              control={control}
              setValue={setValue}
              watch={watch}
              register={register}
              provinsiList={provinsiList}
              kotaList={kotaList}
              setKotaList={setKotaList}
              kecamatanList={kecamatanList}
              setKecamatanList={setKecamatanList}
              kelurahanList={kelurahanList}
              setKelurahanList={setKelurahanList}
              fetchOptions={fetchOptions}
              errors={errors}
              sameAsCompany={watch("sameAsCompany") ?? false}
            />
          ))}

          <div>
            <label className="block font-medium">
              Nama Bank <span className="text-red-500">*</span>
            </label>
            <RHFSelectGeneric<FormData, "namaBank">
              name="namaBank"
              control={control}
              options={bankOptions}
            />
            {errors.namaBank && (
              <p className="text-sm text-red-600">{errors.namaBank.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nomor Rekening Perusahaan{" "}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("nomorRekening")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={onlyDigits}
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Nomor Rekening"
            />
            {errors.nomorRekening && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nomorRekening.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nama Rekening <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("namaPemilik")}
              disabled
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Nama Pemilik Rekening"
              readOnly
            />
            {errors.namaPemilik && (
              <p className="text-red-500 text-sm mt-1">
                {errors.namaPemilik.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 rounded-md font-semibold text-sm transition-all duration-200 active:scale-[0.98] bg-[#3C2B90] text-white hover:bg-[#2e2176] disabled:opacity-50 disabled:cursor-not-allowed "
            >
              {isSubmitting ? "Loading..." : "Lanjutkan"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
