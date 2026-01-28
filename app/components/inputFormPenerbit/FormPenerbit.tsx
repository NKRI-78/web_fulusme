"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useWatch,
  Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import axios from "axios";

import SectionTitle from "./_component/SectionTitle";
import SectionPoint from "./_component/SectionPoint";
import JobStructureForm from "./_component/JobStructureForm";
import AddButton from "./_component/AddButton";
import FormButton from "./_component/FormButton";
import UpdateRing from "./_component/UpdateRing";

import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
// import { IFormPublisher } from "@/app/interface/IFormPublisher";
import { getUser } from "@/app/lib/auth";

import {
  MAX_DIREKTUR,
  MAX_KOMISARIS,
  FormPenerbitSchema,
  FormPenerbitValues,
} from "./formPenerbit.schema";
import FileUpload from "@/app/helper/FileUpload";
import { ProfileUpdate } from "@/app/(defaults)/form-penerbit/IProfileUpdate";
import {
  FORM_INDEX_CACHE_KEY,
  FORM_PENERBIT_1_CACHE_KEY,
  FORM_PENERBIT_2_CACHE_KEY,
  FORM_PIC_CACHE_KEY,
} from "@/app/(defaults)/form-penerbit/form-cache-key";
import { UpdateFieldValue } from "@/app/(defaults)/form-penerbit/PenerbitParent";
import { IFormPublisher } from "./IFormPublisher";
import FileInput from "./_component/FileInput";
import Subtitle from "./_component/SectionSubtitle";

type Props = {
  profile: ProfileUpdate | null;
  isUpdate: boolean;
  onBack: () => void;
  onSubmidCallback: () => void;
  onUpdateCallback: (val: UpdateFieldValue) => void;
};

const emptyDirektur = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  nama: "",
  jabatan: "direktur" as const,
  noKTP: "",
  fileKTP: "",
  fileNPWP: "",
});

const emptyKomisaris = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  nama: "",
  jabatan: "komisaris" as const,
  noKTP: "",
  fileKTP: "",
  fileNPWP: "",
});

const defaultFormValues: FormPenerbitValues = {
  company_nib_path: "",
  akta_pendirian: "",
  sk_kumham_path: "",
  akta_perubahan_terahkir_path: "",
  sk_kumham_terahkir: "",
  fileNpwp: "",
  siup: "",
  tdp: "",
  laporanKeuangan: "",
  rekeningKoran: "",
  direktur: [emptyDirektur()],
  komisaris: [emptyKomisaris()],
  total_employees: "",
  agree: false,
};

const FormPenerbit: React.FC<Props> = ({
  onBack,
  profile,
  isUpdate,
  onSubmidCallback,
  onUpdateCallback,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormPenerbitValues>({
    resolver: zodResolver(FormPenerbitSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const formKey = profile?.form_key;

  const clearDraft = () => {
    localStorage.removeItem(FORM_INDEX_CACHE_KEY);
    localStorage.removeItem(FORM_PIC_CACHE_KEY);
    localStorage.removeItem(FORM_PENERBIT_1_CACHE_KEY);
    localStorage.removeItem(FORM_PENERBIT_2_CACHE_KEY);
    setIsClearing(true);
    reset(defaultFormValues);
    setTimeout(() => setIsClearing(false), 500);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = methods;

  const direkturFA = useFieldArray({
    control,
    name: "direktur",
    keyName: "_id",
  });
  const komisarisFA = useFieldArray({
    control,
    name: "komisaris",
    keyName: "_id",
  });

  const direkturValues = useWatch({ control, name: "direktur" }) ?? [];
  const komisarisValues = useWatch({ control, name: "komisaris" }) ?? [];

  const hasDirekturUtama = useMemo(
    () => direkturValues.some((d: any) => d.jabatan === "direktur-utama"),
    [direkturValues]
  );
  const hasKomisarisUtama = useMemo(
    () => komisarisValues.some((k: any) => k.jabatan === "komisaris-utama"),
    [komisarisValues]
  );

  useEffect(() => {
    if (isUpdate && profile?.company) {
      const c = profile.company;
      reset({
        sk_kumham_terahkir: c.sk_kumham_terahkir,

        // siup
        siup: c.siup,
        // tdp
        tdp: c.tdp,

        fileNpwp: c.npwp_path,
        company_nib_path: c.nib_path,
        akta_pendirian: c.akta_pendirian,
        sk_kumham_path: c.sk_kumham_path,
        akta_perubahan_terahkir_path: c.akta_perubahan_terahkir,
        total_employees: `${c.total_employees}`,
        laporanKeuangan: c.laporan_keuangan_path ?? "",
        rekeningKoran: c.rekening_koran ?? "",
        direktur: c.directors?.map((d) => ({
          id: String(d.id),
          nama: d.name ?? "",
          jabatan:
            d.position === "Direktur Utama" ? "direktur-utama" : "direktur",
          noKTP: d.ktp ?? "",
          fileKTP: d.ktp_path ?? "",
          fileNPWP: d.npwp_path ?? "",
        })) || [emptyDirektur()],
        komisaris: c.komisaris?.map((k) => ({
          id: String(k.id),
          nama: k.name ?? "",
          jabatan:
            k.position === "Komisaris Utama" ? "komisaris-utama" : "komisaris",
          noKTP: k.ktp ?? "",
          fileKTP: k.ktp_path ?? "",
          fileNPWP: k.npwp_path ?? "",
        })) || [emptyKomisaris()],
        agree: false,
      });
      console.log("Prefilled form from profile (update mode)");
    }
  }, [isUpdate, profile]);

  const handleRegisterCompany = async (
    penerbitFormCache: FormPenerbitValues
  ) => {
    setLoading(true);
    try {
      const draft = localStorage.getItem(FORM_PENERBIT_1_CACHE_KEY);
      console.log(draft);
      const userData = getUser();

      if (!draft || !userData) return;

      const publisherFormCache: IFormPublisher = JSON.parse(draft);

      console.log(publisherFormCache);

      const payload = {
        role: "2",
        company_name: publisherFormCache.company_name,
        company_nib: "-",
        company_nib_path: penerbitFormCache.company_nib_path,
        akta_pendirian: penerbitFormCache.akta_pendirian,
        akta_pendirian_path: penerbitFormCache.akta_pendirian,
        akta_perubahan_terahkir: penerbitFormCache.akta_perubahan_terahkir_path,
        akta_perubahan_terahkir_path:
          penerbitFormCache.akta_perubahan_terahkir_path,
        sk_kumham: penerbitFormCache.sk_kumham_path,
        sk_kumham_path: penerbitFormCache.sk_kumham_path,
        sk_kumham_terahkir: penerbitFormCache.sk_kumham_terahkir,
        // npwp: "-",
        npwp_path: penerbitFormCache.fileNpwp,
        didirikan: publisherFormCache.establishedYear,
        site: publisherFormCache.webCompany,
        email: publisherFormCache.emailCompany,
        phone:
          publisherFormCache.noPhoneCompany.kode +
          publisherFormCache.noPhoneCompany.nomor,
        bank_name: publisherFormCache.namaBank,
        bank_account: publisherFormCache.nomorRekening,
        bank_owner: publisherFormCache.namaPemilik,
        siup: penerbitFormCache.siup,
        tdp: penerbitFormCache.tdp,
        jenis_usaha: publisherFormCache.jenis_usaha,
        jenis_perusahaan: publisherFormCache.companyType,
        status_kantor: publisherFormCache.statusCompanys,
        total_employees: String(penerbitFormCache.total_employees),
        laporan_keuangan_path: penerbitFormCache.laporanKeuangan,
        address: publisherFormCache.address,
        rekening_koran_path: penerbitFormCache.rekeningKoran,
        directors:
          penerbitFormCache.direktur.length === 1
            ? penerbitFormCache.direktur.map((dir) => ({
                title: "Direktur",
                name: dir.nama,
                position: "Direktur",
                ktp: dir.noKTP,
                ktp_path: dir.fileKTP,
                npwp: "-",
                npwp_path: dir.fileNPWP,
              }))
            : penerbitFormCache.direktur.map((dir) => ({
                title:
                  dir.jabatan === "direktur-utama"
                    ? "Direktur Utama"
                    : "Direktur",
                name: dir.nama,
                position:
                  dir.jabatan === "direktur-utama"
                    ? "Direktur Utama"
                    : "Direktur",
                ktp: dir.noKTP,
                ktp_path: dir.fileKTP,
                npwp: "-",
                npwp_path: dir.fileNPWP,
              })),
        komisaris: penerbitFormCache.komisaris.map((kom) => ({
          title:
            kom.jabatan === "komisaris-utama" ? "Komisaris Utama" : "Komisaris",
          name: kom.nama,
          position:
            kom.jabatan === "komisaris-utama" ? "Komisaris Utama" : "Komisaris",
          ktp: kom.noKTP,
          ktp_path: kom.fileKTP,
          npwp: "-",
          npwp_path: kom.fileNPWP,
        })),
      };

      const res = await axios.post(
        `${API_BACKEND}/api/v1/auth/assign/role`,
        payload,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      console.log(res);

      clearDraft();

      await Swal.fire({
        title: "Berhasil",
        text: "Data berhasil dikirim",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      onSubmidCallback();
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Kirim data gagal",
        text:
          error?.response?.data?.message ??
          "Terjadi kesalahan saat mengisi data.",
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRegister = async (values: FormPenerbitValues) => {
    setLoading(true);

    const isKTP = profile?.form_key?.endsWith("upload-ktp") ?? false;
    const isNPWP = profile?.form_key?.endsWith("upload-npwp") ?? false;
    const isSusunanManajemen = isKTP || isNPWP;
    const isDirekturForm = profile?.form_key?.includes("direktur") ?? false;

    let idManajemen = "-";
    let valManajemen = "-";

    if (isSusunanManajemen) {
      if (isDirekturForm) {
        const idx = Number(profile?.form_key?.[0] ?? 0);
        const row = values.direktur[idx];
        if (row) {
          idManajemen = row.id ?? String(idx);
          valManajemen = isKTP ? row.fileKTP : row.fileNPWP;
        }
      } else {
        const idx = Number(profile?.form_key?.[0] ?? 0);
        const row = values.komisaris[idx];
        if (row) {
          idManajemen = row.id ?? String(idx);
          valManajemen = isKTP ? row.fileKTP : row.fileNPWP;
        }
      }
    }

    const swalResult = await Swal.fire({
      icon: "question",
      title: "Konfirmasi Perubahan Data",
      text: "Apakah Anda yakin dengan data yang Anda inputkan sudah benar? mohon cek kembali jika masih ragu.",
      confirmButtonText: "Sudah Benar",
      cancelButtonText: "Cek Kembali",
      confirmButtonColor: "#13733b",
      cancelButtonColor: "#eaeaea",
    });

    if (swalResult.isConfirmed) {
      onUpdateCallback({
        val: getUpdateFieldValueBasedFormKey(values),
        val_array: isSusunanManajemen
          ? [
              {
                id: idManajemen,
                val: valManajemen,
                type: isKTP ? "ktp" : "npwp",
              },
            ]
          : [],
      });
    }

    setLoading(false);
  };

  const onSubmit = handleSubmit(async (values, e) => {
    if (isUpdate) return handleUpdateRegister(values);
    return handleRegisterCompany(values);
  });

  useEffect(() => {
    const draft = localStorage.getItem(FORM_PENERBIT_2_CACHE_KEY);
    if (draft) {
      reset(JSON.parse(draft));
    }
    setIsReady(true);
  }, [reset]);

  const values = watch();
  useEffect(() => {
    if (!isReady || isClearing) return; // 🚩 skip save kalau sedang clear
    const timeout = setTimeout(() => {
      localStorage.setItem(FORM_PENERBIT_2_CACHE_KEY, JSON.stringify(values));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [values, isReady, isClearing]);

  const canAddDirektur = direkturFA.fields.length < MAX_DIREKTUR;
  const canAddKomisaris = komisarisFA.fields.length < MAX_KOMISARIS;

  const { setError, clearErrors } = methods;

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: Path<FormPenerbitValues>
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

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", "capbridge");
    formData.append("media", file);

    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
        formData
      );

      const fileUrl = res.data?.data?.path;

      if (fileUrl) {
        setValue(field, fileUrl, { shouldValidate: true });
      } else {
        alert(`Upload ${field} gagal!`);
      }
    } catch (error) {
      alert(`Upload ${field} error!`);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    setValue("total_employees", numeric);
  };

  const agree = watch(`agree`);

  const getUpdateFieldValueBasedFormKey = (
    values: FormPenerbitValues
  ): string => {
    if (!formKey) return "-";

    switch (formKey) {
      case "sk-kumham-terakhir":
        return values.sk_kumham_terahkir;
      case "siup":
        return values.siup;
      case "tdp":
        return values.tdp;
      case "nib":
        return values.company_nib_path;
      case "npwp":
        return values.fileNpwp;
      case "akta-pendirian-perusahaan":
        return values.akta_pendirian;
      case "sk-kumham-pendirian":
        return values.sk_kumham_path;
      case "akta-perubahan-terakhir":
        return values.akta_perubahan_terahkir_path;
      case "laporan-keuangan":
        return values.laporanKeuangan;
      case "rekening-koran":
        return values.rekeningKoran;
      default:
        return "-";
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="px-6 md:px-24 bg-white">
        <div className="w-full text-black grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
          <section className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <UpdateRing identity={"sk-kumham-terakhir"} formKey={formKey}>
                {/* <FileUpload
                  label="SK Kumham Terakhir"
                  fileUrl={watch("sk_kumham_terahkir")}
                  onUpload={(e) => handleUploadFile(e, "sk_kumham_terahkir")}
                  error={errors?.sk_kumham_terahkir?.message}
                /> */}
                <div>
                  <SectionPoint text="SK Kumham Terakhir" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="SK Kumham Terakhir"
                    accept=".pdf"
                    fileUrl={watch("sk_kumham_terahkir")}
                    onChange={(fileUrl) => {
                      setValue("sk_kumham_terahkir", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.sk_kumham_terahkir?.message}
                  />
                </div>
              </UpdateRing>
              <UpdateRing identity={"siup"} formKey={formKey}>
                {/* <FileUpload
                  label="Surat Izin Usaha Perdagangan (SIUP)"
                  fileUrl={watch("siup")}
                  onUpload={(e) => handleUploadFile(e, "siup")}
                  error={errors?.siup?.message}
                /> */}
                <div>
                  <SectionPoint text="Surat Izin Usaha Perdagangan (SIUP)" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="SIUP"
                    accept=".pdf"
                    fileUrl={watch("siup")}
                    onChange={(fileUrl) => {
                      setValue("siup", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.siup?.message}
                  />
                </div>
              </UpdateRing>
              <UpdateRing identity={"tdp"} formKey={formKey}>
                {/* <FileUpload
                  label="Tanda Daftar Perusahaan (TDP)"
                  fileUrl={watch("tdp")}
                  onUpload={(e) => handleUploadFile(e, "tdp")}
                  error={errors?.tdp?.message}
                /> */}
                <div>
                  <SectionPoint text="Tanda Daftar Perusahaan (TDP)" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="TDP"
                    accept=".pdf"
                    fileUrl={watch("tdp")}
                    onChange={(fileUrl) => {
                      setValue("tdp", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.tdp?.message}
                  />
                </div>
              </UpdateRing>
              <UpdateRing identity={"npwp"} formKey={formKey}>
                {/* <FileUpload
                  label="NPWP"
                  fileUrl={watch("fileNpwp")}
                  onUpload={(e) => handleUploadFile(e, "fileNpwp")}
                  error={errors?.fileNpwp?.message}
                /> */}
                <div>
                  <SectionPoint text="NPWP" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="NPWP"
                    accept=".pdf"
                    fileUrl={watch("fileNpwp")}
                    onChange={(fileUrl) => {
                      setValue("fileNpwp", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.fileNpwp?.message}
                  />
                </div>
              </UpdateRing>

              <UpdateRing identity={"nib"} formKey={formKey}>
                {/* <FileUpload
                  label="Nomor Induk Berusaha (NIB)"
                  fileUrl={watch("company_nib_path")}
                  onUpload={(e) => handleUploadFile(e, "company_nib_path")}
                  error={errors?.company_nib_path?.message}
                /> */}
                <div>
                  <SectionPoint text="Nomor Induk Berusaha (NIB)" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="NIB"
                    accept=".pdf"
                    fileUrl={watch("company_nib_path")}
                    onChange={(fileUrl) => {
                      setValue("company_nib_path", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.company_nib_path?.message}
                  />
                </div>
              </UpdateRing>

              <UpdateRing
                identity={"akta-pendirian-perusahaan"}
                formKey={formKey}
              >
                {/* <FileUpload
                  label="Akte Pendirian Perusahaan"
                  fileUrl={watch("akta_pendirian")}
                  onUpload={(e) => handleUploadFile(e, "akta_pendirian")}
                  error={errors?.akta_pendirian?.message}
                /> */}
                <div>
                  <SectionPoint text="Akte Pendirian Perusahaan" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="Akte Pendirian Perusahaan"
                    accept=".pdf"
                    fileUrl={watch("akta_pendirian")}
                    onChange={(fileUrl) => {
                      setValue("akta_pendirian", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.akta_pendirian?.message}
                  />
                </div>
              </UpdateRing>

              <UpdateRing identity={"sk-kumham-pendirian"} formKey={formKey}>
                {/* <FileUpload
                  label="SK Kumham Pendirian"
                  fileUrl={watch("sk_kumham_path")}
                  onUpload={(e) => handleUploadFile(e, "sk_kumham_path")}
                  error={errors?.sk_kumham_path?.message}
                /> */}
                <div>
                  <SectionPoint text="SK Kumham Pendirian" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="SK Kumham Pendirian"
                    accept=".pdf"
                    fileUrl={watch("sk_kumham_path")}
                    onChange={(fileUrl) => {
                      setValue("sk_kumham_path", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.sk_kumham_path?.message}
                  />
                </div>
              </UpdateRing>

              <UpdateRing
                identity={"akta-perubahan-terakhir"}
                formKey={formKey}
              >
                {/* <FileUpload
                  label="Akte Perubahan Terakhir"
                  fileUrl={watch("akta_perubahan_terahkir_path")}
                  onUpload={(e) =>
                    handleUploadFile(e, "akta_perubahan_terahkir_path")
                  }
                  error={errors?.akta_perubahan_terahkir_path?.message}
                /> */}
                <div>
                  <SectionPoint text="Akte Perubahan Terakhir" />
                  <Subtitle
                    text="File maksimal berukuran 10mb"
                    className="mb-1"
                  />
                  <FileInput
                    fileName="Akte Perubahan Terakhir"
                    accept=".pdf"
                    fileUrl={watch("akta_perubahan_terahkir_path")}
                    onChange={(fileUrl) => {
                      setValue("akta_perubahan_terahkir_path", fileUrl, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    errorText={errors?.akta_perubahan_terahkir_path?.message}
                  />
                </div>
              </UpdateRing>
            </div>

            <div className="mt-4">
              <label className="block mb-1">
                Jumlah Karyawan<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border rounded overflow-hidden w-80">
                <input
                  {...methods.register("total_employees")}
                  type="text"
                  onChange={handleNumberChange}
                  className="px-3 py-2 outline-none flex-1"
                  placeholder="0"
                />
                <span className="px-3 py-2 border-l bg-gray-100 text-gray-500 text-sm">
                  Orang
                </span>
              </div>
              {errors.total_employees && (
                <p className="text-red-500 text-sm">
                  {errors.total_employees.message}
                </p>
              )}
            </div>

            <div className="flex gap-x-4 items-end mt-3">
              <div className="flex flex-col">
                <SectionTitle text="2. Struktur Permodalan" />
                <div className="my-1" />
                <UpdateRing identity="laporan-keuangan" formKey={formKey}>
                  {/* <FileUpload
                    label="Laporan Keuangan"
                    fileUrl={watch("laporanKeuangan")}
                    onUpload={(e) => handleUploadFile(e, "laporanKeuangan")}
                    error={errors?.laporanKeuangan?.message}
                  /> */}
                  <div>
                    <SectionPoint text="Laporan Keuangan" />
                    <Subtitle
                      text="File maksimal berukuran 10mb"
                      className="mb-1"
                    />
                    <FileInput
                      fileName="Laporan Keuangan"
                      accept=".pdf"
                      fileUrl={watch("laporanKeuangan")}
                      onChange={(fileUrl) => {
                        setValue("laporanKeuangan", fileUrl, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      errorText={errors?.laporanKeuangan?.message}
                    />
                  </div>
                </UpdateRing>
              </div>

              <div className="flex flex-col">
                <UpdateRing identity="rekening-koran" formKey={formKey}>
                  {/* <FileUpload
                    label="Rekening Koran"
                    fileUrl={watch("rekeningKoran")}
                    onUpload={(e) => handleUploadFile(e, "rekeningKoran")}
                    error={errors?.rekeningKoran?.message}
                  /> */}
                  <div>
                    <SectionPoint text="Rekening Koran" />
                    <Subtitle
                      text="File maksimal berukuran 10mb"
                      className="mb-1"
                    />
                    <FileInput
                      fileName="Rekening Koran"
                      accept=".pdf"
                      fileUrl={watch("rekeningKoran")}
                      onChange={(fileUrl) => {
                        setValue("rekeningKoran", fileUrl, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      errorText={errors?.rekeningKoran?.message}
                    />
                  </div>
                </UpdateRing>
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="w-full flex flex-col">
              <SectionTitle text="3. Susunan Manajemen" />
              <SectionPoint text="Direktur" className="mt-2" />

              {direkturFA.fields.map((field, index) => (
                <JobStructureForm
                  key={field._id}
                  namePrefix="direktur"
                  index={index}
                  isKomisaris={false}
                  hasDirekturUtama={hasDirekturUtama}
                  updateFormKey={formKey}
                  updateIdentity={`${index}-direktur`}
                  onDelete={() => direkturFA.remove(index)}
                />
              ))}

              <AddButton
                label="+ Tambah Direktur"
                errorText={(errors.direktur?.message as string) || undefined}
                message="Anda hanya dapat menambahkan maksimal 3 Direktur."
                disabled={!canAddDirektur}
                onClick={() => {
                  if (!canAddDirektur) {
                    setError("direktur", {
                      type: "max",
                      message: "Maksimal 3 Direktur",
                    });
                    return;
                  }
                  clearErrors("direktur");
                  direkturFA.append(emptyDirektur());
                }}
              />

              <SectionPoint text="Komisaris" className="mt-2" />

              {komisarisFA.fields.map((field, index) => (
                <JobStructureForm
                  key={field._id}
                  namePrefix="komisaris"
                  index={index}
                  isKomisaris
                  hasKomisarisUtama={hasKomisarisUtama}
                  updateFormKey={formKey}
                  updateIdentity={`${index}-komisaris`}
                  onDelete={() => komisarisFA.remove(index)}
                />
              ))}

              <AddButton
                label="+ Tambah Komisaris"
                errorText={(errors.komisaris?.message as string) || undefined}
                message="Anda hanya dapat menambahkan maksimal 3 Komisaris."
                disabled={!canAddKomisaris}
                onClick={() => {
                  if (!canAddKomisaris) {
                    setError("komisaris", {
                      type: "max",
                      message: "Maksimal 3 Komisaris",
                    });
                    return;
                  }
                  clearErrors("komisaris");
                  komisarisFA.append(emptyKomisaris());
                }}
              />
            </div>
            <div className="w-ful flex flex-col mt-4">
              <SectionPoint text="Pernyataan Kebenaran Data" />
              <p className="text-sm text-gray-500 my-2">
                Dengan ini saya menyatakan bahwa seluruh data yang saya berikan
                adalah benar, akurat, dan sesuai dengan kondisi saat ini...
              </p>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...methods.register("agree")}
                  className="form-checkbox"
                />
                <span className="text-sm font-medium text-gray-700">
                  Ya, saya setuju
                </span>
              </label>
              {errors.agree?.message && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.agree.message}
                </p>
              )}
            </div>

            <div className="w-full flex justify-end gap-4 mt-6">
              {!isUpdate && (
                <FormButton onClick={onBack} type="outlined">
                  Kembali
                </FormButton>
              )}
              <FormButton
                onClick={onSubmit}
                disabled={!agree || loading}
                className={!agree ? "cursor-not-allowed" : ""}
              >
                {loading ? "Memuat" : isUpdate ? "Update" : "Kirim"} Data
              </FormButton>
            </div>
          </section>
        </div>
      </div>
    </FormProvider>
  );
};

export default FormPenerbit;
