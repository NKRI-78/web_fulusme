"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

import ComponentDataPribadi from "./informasiPribadi/DataPribadi";
import ComponentDataPekerjaan from "./informasiPekerjaan/DataPekerjaan";
import { API_BACKEND, IS_DEV, IS_PROD } from "@/app/utils/constant";
import FileViewerModal from "@/app/(defaults)/viewer/components/FilePreviewModalV2";
import { setCookie } from "@/app/helper/cookie";
import { getUser } from "@/app/lib/auth";
import { AuthDataResponse } from "@/app/interfaces/auth/auth";
import Tooltip from "../Tooltip";

export const pemodalKeys: string[] = ["ktp-upload", "npwp-upload"];

const FormPemodal: React.FC = () => {
  type OptionType = { value: string; label: string } | null;
  type DataProfile = {
    id: string;
    fullname: string;
    avatar: string;
    last_education: string;
    gender: string;
    status_marital: string;
    address_detail: string;
    occupation: string;
    province_name: string;
    city_name: string;
    district_name: string;
    subdistrict_name: string;
    postal_code: string;
    nama_ahli_waris: string;
    phone_ahli_waris: string;
    slip_gaji: string;
    investor: {
      bank: {
        no: string;
        bank_name: string;
        bank_owner: string;
        bank_branch: string;
        rek_koran_path: string;
        created_at: string;
      };
      ktp: {
        name: string;
        nik: string;
        place_datebirth: string;
        path: string;
        created_at: string;
      };
      job: {
        province_name: string;
        city_name: string;
        district_name: string;
        subdistrict_name: string;
        postal_code: string;
        company_name: string;
        company_address: string;
        monthly_income: string;
        npwp_path: string;
        position: string;
        npwp: string;
        annual_income: string;
      };
      risk: {
        goal: string;
        tolerance: string;
        experience: string;
        capital_market_knowledge: string;
      };
      profile_security_account: {
        account_name: string;
        account: string;
        account_sub_no: string;
        account_bank: string;
      };
    };
    form: string;
  };
  const router = useRouter();
  const [user, setUser] = useState<AuthDataResponse | null>(null);
  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("update") === "true";
  const form = searchParams.get("form");
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userCookie = getUser();
    if (!userCookie) return;

    setUser(userCookie);

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BACKEND}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${userCookie.token}`,
          },
        });

        const data = response.data?.data;

        setDataProfile({ ...data, form: form });
        setDataPribadi((prev) => ({
          ...prev,
          nama: data.fullname,
          namaPemilik: data.fullname,
        }));

        if (data && isUpdate) {
          localStorage.setItem("dataProfile", JSON.stringify(data));
          const placeDateBirth = `${data.investor.ktp?.place_datebirth}, ${data.investor.ktp?.place_datebirth}`;
          const [placeOfBirth, dateOfBirth] = placeDateBirth.split(", ");

          setDataPribadi((prev) => ({
            ...prev,
            nama: data.fullname || "",
            nik: data.investor.ktp.nik || "",
            tempatLahir: placeOfBirth || "",
            tanggalLahir: dateOfBirth || "",
            jenisKelamin:
              data.gender === "L"
                ? "Laki-Laki"
                : data.gender === "P"
                  ? "Perempuan"
                  : "",
            statusPernikahan: data.status_marital || "",
            pendidikanTerakhir: data.last_education || "",
            pekerjaan: data.occupation || "",
            namaBank: data.investor.bank.bank_name || "",
            nomorRekening: data.investor.bank?.no || "",
            namaPemilik: data.investor.bank?.bank_owner || "",
            cabangBank: data.investor.bank?.bank_branch || "",
            ktpUrl: data.investor.ktp?.path || "",
            rekeningKoran: data.bank?.rek_koran_path || "",
            addres: data.address_detail || "",
            provincePribadi: data.province_name
              ? { value: data.province_name, label: data.province_name }
              : null,

            cityPribadi: data.city_name
              ? { value: data.city_name, label: data.city_name }
              : null,
            districtPribadi: data.district_name
              ? { value: data.district_name, label: data.district_name }
              : null,
            subDistrictPribadi: data.subdistrict_name
              ? { value: data.subdistrict_name, label: data.subdistrict_name }
              : null,
            posCode: data.postal_code || "",
            nama_ahli_waris: data.nama_ahli_waris || "",
            phone_ahli_waris: data.phone_ahli_waris || "",
          }));

          setDataPekerjaan((prev) => ({
            ...prev,
            namaPerusahaan: data.investor.job?.company_name || "",
            jabatan: data.investor.job?.position || "",
            alamatPerusahaan: data.investor.job?.company_address || "",
            penghasilanBulanan: data.investor.job?.monthly_income || "",
            penghasilanTahunan: data.investor.job?.annual_income || "",
            npwpUrl: data.investor.job?.npwp_path || "",
            fotoPemodalUrl: data.avatar || "",

            provincePekerjaan: data.job?.province_name
              ? { value: data.job.province_name, label: data.job.province_name }
              : null,
            cityPekerjaan: data.job?.city_name
              ? { value: data.job.city_name, label: data.job.city_name }
              : null,
            districtPekerjaan: data.job?.district_name
              ? { value: data.job.district_name, label: data.job.district_name }
              : null,
            subDistrictPekerjaan: data.job?.subdistrict_name
              ? {
                  value: data.job.subdistrict_name,
                  label: data.job.subdistrict_name,
                }
              : null,
            posCodePekerjaan: data.job?.postal_code || "",
            tujuanInvestasi: data.risk?.goal || "",
            toleransiResiko: data.risk?.tolerance || "",
            pengalamanInvestasi: data.risk?.experience || "",
            pengetahuanPasarModal: data.risk?.pengetahuan_pasar_modal || "",
            setujuKebenaranData: true,
            setujuRisikoInvestasi: true,
            signature: data.signature_path || "",
            slipGajiUrl: (data.slip_gaji && data.slip_gaji !== "-") || "",
            namaBank_efek: data.profile_security_account?.account_bank
              ? {
                  value: data.profile_security_account.account_bank,
                  label: data.profile_security_account.account_bank,
                }
              : null,
            nomorRekening_efek: data.profile_security_account?.account || "",
            namaPemilik_efek: data.profile_security_account?.account_name || "",
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | undefined>(
    undefined,
  );

  //* handle alert ketika halaman di reload / close
  useEffect(() => {
    if (IS_DEV) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  function getFormIndex(form: string | null): number {
    if (!form) return 0;

    const lowerForm = form.toLowerCase();

    switch (true) {
      case lowerForm.includes("ktp"):
        return 0;
      case lowerForm.includes("npwp"):
      case lowerForm.includes("slip-gaji"):
      case lowerForm.includes("slip_gaji"):
        return 1;
      default:
        return 0;
    }
  }

  const [selectedIndex, setSelectedIndex] = useState(
    isUpdate ? getFormIndex(form) : 0,
  );
  const [errorsPribadi, setErrorsPribadi] = useState<Record<string, string[]>>(
    {},
  );
  const [errorsPekerjaan, setErrorsPekerjaan] = useState<
    Record<string, string[]>
  >({});

  const schemaDataPribadi = z
    .object({
      nama: z.string().min(1, "Nama wajib diisi"),

      nik: z
        .string({ required_error: "NIK wajib diisi" })
        .min(1, "NIK wajib diisi")
        .refine((val) => val.length === 16, {
          message: "NIK harus 16 digit",
        }),
      npwp: z.string().min(1, "Nomor Npwp wajib diisi"),
      tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
      tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
      jenisKelamin: z.string().min(1, "Jenis kelamin wajib diisi"),
      statusPernikahan: z.string().min(1, "Status pernikahan wajib diisi"),
      pendidikanTerakhir: z.string().min(1, "Pendidikan terakhir wajib diisi"),
      pekerjaan: z.string().min(1, "Pekerjaan wajib diisi"),
      pekerjaanLainnya: z.string().optional(),
      addres: z.string().min(1, "Alamat wajib diisi"),
      namaBank: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Nama bank wajib dipilih",
        }),
      nomorRekening: z.string().min(1, "Nomor rekening wajib diisi"),
      namaPemilik: z.string().min(1, "Nama pemilik rekening wajib diisi"),
      cabangBank: z.string().min(1, "Cabang bank wajib diisi"),
      ktpUrl: z.string().min(1, "Upload KTP wajib"),
      rekeningKoran: z.string().optional(),
      provincePribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Provinsi wajib dipilih",
        }),
      cityPribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kota wajib dipilih",
        }),
      districtPribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kecamatan wajib dipilih",
        }),
      subDistrictPribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kelurahan wajib dipilih",
        }),

      posCode: z.string().min(1, "Kode pos wajib dipilih"),
      nama_ahli_waris: z.string().min(1, "Nama ahli waris wajib diisi"),
      phone_ahli_waris: z
        .string()
        .min(1, "Nomor telepon ahli waris wajib diisi"),
      fotoPemodalUrlPribadi: z.string().min(1, "Upload Foto wajib"),
    })
    .refine((data) => data.nama === data.namaPemilik, {
      message: "Nama pemilik rekening harus sama dengan nama",
      path: ["namaPemilik"],
    })
    .refine(
      (data) => {
        if (data.pekerjaan === "Lainnya") {
          return data.pekerjaanLainnya && data.pekerjaanLainnya.trim() !== "";
        }
        return true;
      },
      {
        message: "Pekerjaan lainnya wajib diisi",
        path: ["pekerjaanLainnya"],
      },
    );

  const schemaDataPekerjaan = z
    .object({
      namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
      jabatan: z.string().min(1, "Jabatan wajib diisi"),
      alamatPerusahaan: z.string().min(1, "Alamat perusahaan wajib diisi"),
      slipGajiUrl: z.string().min(1, "Slip gaji wajib diupload"),
      penghasilanTahunan: z.string().min(1, "Penghasilan tahunan wajib diisi"),
      tujuanInvestasi: z.string().min(1, "Tujuan investasi wajib diisi"),
      tujuanInvestasiLainnya: z.string().optional(),
      toleransiResiko: z.string().min(1, "Toleransi resiko wajib diisi"),
      pengalamanInvestasi: z
        .string()
        .min(1, "Pengalaman investasi wajib diisi"),
      pengetahuanPasarModal: z
        .string()
        .min(1, "Pengetahuan pasar modal wajib diisi"),
      setujuKebenaranData: z.literal(true),
      setujuRisikoInvestasi: z.literal(true),

      provincePekerjaan: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Provinsi wajib dipilih",
        }),
      cityPekerjaan: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kota wajib dipilih",
        }),
      districtPekerjaan: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kecamatan wajib dipilih",
        }),
      subDistrictPekerjaan: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kelurahan wajib dipilih",
        }),

      posCodePekerjaan: z.string().min(1, "Kode pos wajib dipilih"),

      namaBank_efek: z
        .object({ value: z.string(), label: z.string() })
        .nullable()
        .optional(),
      nomorRekening_efek: z.string().optional(),
      namaPemilik_efek: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.tujuanInvestasi === "Lainnya" &&
        !data.tujuanInvestasiLainnya?.trim()
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["tujuanInvestasiLainnya"],
          message: "Tujuan investasi lainnya wajib diisi",
        });
      }

      const adaIsi =
        data.namaBank_efek || data.nomorRekening_efek || data.namaPemilik_efek;

      if (adaIsi) {
        if (!data.namaBank_efek) {
          ctx.addIssue({
            code: "custom",
            path: ["namaBank_efek"],
            message:
              "Harap pilih nama bank efek jika mengisi data rekening efek",
          });
        }
        if (!data.nomorRekening_efek?.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["nomorRekening_efek"],
            message:
              "Harap lengkapi nomor rekening efek jika mengisi data rekening efek",
          });
        }
        if (!data.namaPemilik_efek?.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["namaPemilik_efek"],
            message:
              "Harap lengkapi nama pemilik rekening efek jika mengisi data rekening efek",
          });
        }
      }
    });

  const [dataPribadi, setDataPribadi] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          nama: parsed.nama || "",
          nik: parsed.nik || "",
          npwp: parsed.npwp || "",
          tempatLahir: parsed.tempatLahir || "",
          tanggalLahir: parsed.tanggalLahir || "",
          jenisKelamin: parsed.jenisKelamin || "",
          statusPernikahan: parsed.statusPernikahan || "",
          pendidikanTerakhir: parsed.pendidikanTerakhir || "",
          pekerjaan: parsed.pekerjaan || "",
          pekerjaanLainnya: parsed.pekerjaanLainnya || "",
          addres: parsed.addres || "",
          namaBank:
            parsed.namaBank && typeof parsed.namaBank === "object"
              ? parsed.namaBank
              : { value: "", label: "" },

          nomorRekening: parsed.nomorRekening || "",
          namaPemilik: parsed.namaPemilik || "",
          cabangBank: parsed.cabangBank || "",
          ktpUrl: parsed.ktpUrl || "",
          rekeningKoran: parsed.rekeningKoran || "",
          provincePribadi: parsed.provincePribadi ?? null,
          cityPribadi: parsed.cityPribadi ?? null,
          districtPribadi: parsed.districtPribadi ?? null,
          subDistrictPribadi: parsed.subDistrictPribadi ?? null,
          posCode: parsed.posCode || "",
          nama_ahli_waris: parsed.nama_ahli_waris || "",
          phone_ahli_waris: parsed.phone_ahli_waris || "",
          fotoPemodalUrlPribadi: parsed.fotoPemodalUrlPribadi || "",
        };
      }
    }
    return {
      nama: "",
      nik: "",
      npwp: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      statusPernikahan: "",
      pendidikanTerakhir: "",
      pekerjaan: "",
      pekerjaanLainnya: "",
      addres: "",
      namaBank: null,
      nomorRekening: "",
      namaPemilik: "",
      cabangBank: "",
      ktpUrl: "",
      rekeningKoran: "",
      provincePribadi: null,
      cityPribadi: null,
      districtPribadi: null,
      subDistrictPribadi: null,
      posCode: "",
      nama_ahli_waris: "",
      phone_ahli_waris: "",
      fotoPemodalUrlPribadi: "",
    };
  });

  const [dataPekerjaan, setDataPekerjaan] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          namaPerusahaan: parsed.namaPerusahaan || "",
          jabatan: parsed.jabatan || "",
          alamatPerusahaan: parsed.alamatPerusahaan || "",
          penghasilanBulanan: parsed.penghasilanBulanan || "",
          penghasilanTahunan: parsed.penghasilanTahunan || "",
          tujuanInvestasi: parsed.tujuanInvestasi || "",
          tujuanInvestasiLainnya: parsed.tujuanInvestasiLainnya || "",
          toleransiResiko: parsed.toleransiResiko || "",
          pengalamanInvestasi: parsed.pengalamanInvestasi || "",
          pengetahuanPasarModal: parsed.pengetahuanPasarModal || "",
          setujuKebenaranData: parsed.setujuKebenaranData || false,
          setujuRisikoInvestasi: parsed.setujuRisikoInvestasi || false,
          signature: parsed.signature || "",
          npwpUrl: parsed.npwpUrl || "",
          fotoPemodalUrl: parsed.fotoPemodalUrl || "",
          provincePekerjaan: parsed.provincePekerjaan ?? null,
          cityPekerjaan: parsed.cityPekerjaan ?? null,
          districtPekerjaan: parsed.districtPekerjaan ?? null,
          subDistrictPekerjaan: parsed.subDistrictPekerjaan ?? null,
          posCodePekerjaan: parsed.posCodePekerjaan || "",
          namaBank_efek: parsed.namaBank_efek || "",
          nomorRekening_efek: parsed.nomorRekening_efek || "",
          namaPemilik_efek: parsed?.namaPemilik_efek || "",
          slipGajiUrl: parsed.slipGajiUrl || "",
        };
      }
    }
    return {
      namaPerusahaan: "",
      jabatan: "",
      alamatPerusahaan: "",
      penghasilanBulanan: "",
      penghasilanTahunan: "",
      tujuanInvestasi: "",
      tujuanInvestasiLainnya: "",
      toleransiResiko: "",
      pengalamanInvestasi: "",
      pengetahuanPasarModal: "",
      setujuKebenaranData: false,
      setujuRisikoInvestasi: false,
      signature: "",
      npwpUrl: "",
      fotoPemodalUrl: "",
      provincePekerjaan: null,
      cityPekerjaan: null,
      districtPekerjaan: null,
      subDistrictPekerjaan: null,
      posCodePekerjaan: "",
      namaBank_efek: null,
      nomorRekening_efek: "",
      namaPemilik_efek: "",
      slipGajiUrl: "",
    };
  });

  const capitalizeWords = (value: string) => {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChangeDataPribadi = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Hanya izinkan angka dan maksimal 16 digit untuk NIK
    if (name === "nik") {
      const numericValue = value.replace(/\D/g, ""); // hapus non-angka
      if (numericValue.length > 16) return; // batasi 16 digit

      setDataPribadi((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name === "nomorRekening") {
      const numericValue = value.replace(/\D/g, ""); // hapus non-angka
      // if (numericValue.length > 16) return;

      setDataPribadi((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name === "phone_ahli_waris") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 13) return;

      setDataPribadi((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    const capitalizeFields = [
      "nama",
      "tempatLahir",
      "namaBank",
      "namaPemilik",
      "cabangBank",
      "nama_ahli_waris",
    ];

    const formattedValue = capitalizeFields.includes(name)
      ? capitalizeWords(value)
      : value;
    setDataPribadi((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
      if (saved && !isUpdate) {
        const parsed = JSON.parse(saved);
        setDataPribadi({
          nama: parsed.nama || "",
          nik: parsed.nik || "",
          npwp: parsed.npwp || "",
          tempatLahir: parsed.tempatLahir || "",
          tanggalLahir: parsed.tanggalLahir || "",
          jenisKelamin: parsed.jenisKelamin || "",
          statusPernikahan: parsed.statusPernikahan || "",
          pendidikanTerakhir: parsed.pendidikanTerakhir || "",
          pekerjaan: parsed.pekerjaan || "",
          pekerjaanLainnya: parsed.pekerjaanLainnya || "",
          addres: parsed.addres || "",
          namaBank: parsed.namaBank || "",
          nomorRekening: parsed.nomorRekening || "",
          namaPemilik: parsed.namaPemilik || "",
          cabangBank: parsed.cabangBank || "",
          ktpUrl: parsed.ktpUrl || "",
          rekeningKoran: parsed.rekeningKoran || "",
          provincePribadi: parsed.provincePribadi ?? null,
          cityPribadi: parsed.cityPribadi ?? null,
          districtPribadi: parsed.districtPribadi ?? null,
          subDistrictPribadi: parsed.subDistrictPribadi ?? null,
          posCode: parsed.posCode || "",
          nama_ahli_waris: parsed.nama_ahli_waris || "",
          phone_ahli_waris: parsed.phone_ahli_waris || "",
          fotoPemodalUrlPribadi: parsed.fotoPemodalUrlPribadi || "",
        });

        setDataPekerjaan({
          namaPerusahaan: parsed.namaPerusahaan || "",
          jabatan: parsed.jabatan || "",
          alamatPerusahaan: parsed.alamatPerusahaan || "",
          penghasilanBulanan: parsed.penghasilanBulanan || "",
          penghasilanTahunan: parsed.penghasilanTahunan || "",
          tujuanInvestasi: parsed.tujuanInvestasi || "",
          tujuanInvestasiLainnya: parsed.tujuanInvestasiLainnya || "",
          toleransiResiko: parsed.toleransiResiko || "",
          pengalamanInvestasi: parsed.pengalamanInvestasi || "",
          pengetahuanPasarModal: parsed.pengetahuanPasarModal || "",
          setujuKebenaranData: parsed.setujuKebenaranData || false,
          setujuRisikoInvestasi: parsed.setujuRisikoInvestasi || false,
          signature: parsed.signature || "",
          npwpUrl: parsed.npwpUrl || "",
          fotoPemodalUrl: parsed.fotoPemodalUrl || "",
          provincePekerjaan: parsed.provincePekerjaan ?? null,
          cityPekerjaan: parsed.cityPekerjaan ?? null,
          districtPekerjaan: parsed.districtPekerjaan ?? null,
          subDistrictPekerjaan: parsed.subDistrictPekerjaan ?? null,
          posCodePekerjaan: parsed.posCodePekerjaan || "",
          namaBank_efek: parsed.namaBank_efek || "",
          nomorRekening_efek: parsed.nomorRekening_efek || "",
          namaPemilik_efek: parsed.namaPemilik_efek || "",
          slipGajiUrl: parsed.slipGajiUrl || "",
        });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!submitted) {
        const fullData = {
          ...dataPribadi,
          ...dataPekerjaan,
        };

        localStorage.setItem("formPemodal", JSON.stringify(fullData));
      }
    }
  }, [dataPribadi, dataPekerjaan, submitted]);

  const handleGenderChange = (gender: string) => {
    setDataPribadi((prev) => ({ ...prev, jenisKelamin: gender }));
  };

  const handleChangeDataPekerjaan = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "nomorRekening_efek") {
      const numericValue = value.replace(/\D/g, ""); // hapus non-angka

      setDataPekerjaan((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name === "namaPemilik_efek") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");

      setDataPekerjaan((prev) => ({
        ...prev,
        [name]: onlyLetters,
      }));
      return;
    }

    const capitalizeFields = ["namaPemilik_efek"];

    const formattedValue = capitalizeFields.includes(name)
      ? capitalizeWords(value)
      : value;

    setDataPekerjaan((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handlePenghasilanBulananChange = (penghasilanBulanan: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      penghasilanBulanan: penghasilanBulanan,
    }));
  };

  const handlePenghasilanTahunanChange = (penghasilanTahunan: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      penghasilanTahunan: penghasilanTahunan,
    }));
  };

  const handleToleransiResikoChange = (toleransiResiko: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      toleransiResiko: toleransiResiko,
    }));
  };

  const handlePengalamanInvestasi = (pengalamanInvestasi: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      pengalamanInvestasi: pengalamanInvestasi,
    }));
  };

  const handlePengetahuanPasarModal = (pengetahuanPasarModal: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      pengetahuanPasarModal: pengetahuanPasarModal,
    }));
  };

  const handleonTujuanInvetasiChange = (tujuanInvestasi: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      tujuanInvestasi: tujuanInvestasi,
      tujuanInvestasiLainnya: "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDataPekerjaan((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSignatureSave = (signature: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      signature,
    }));
  };

  const handleWeddingChange = (wedding: string) => {
    setDataPribadi((prev) => ({ ...prev, statusPernikahan: wedding }));
  };

  const handleEducationChange = (education: string) => {
    setDataPribadi((prev) => ({ ...prev, pendidikanTerakhir: education }));
  };

  const onPekerjaanChange = (value: string) => {
    setDataPribadi((prev) => ({
      ...prev,
      pekerjaan: value,
      pekerjaanLainnya: "",
    }));
  };

  const handleAlamatChange = (alamat: {
    provincePribadi: OptionType;
    cityPribadi: OptionType;
    districtPribadi: OptionType;
    subDistrictPribadi: OptionType;
    posCode: string;
  }) => {
    setDataPribadi((prev) => ({
      ...prev,
      provincePribadi: alamat.provincePribadi,
      cityPribadi: alamat.cityPribadi,
      districtPribadi: alamat.districtPribadi,
      subDistrictPribadi: alamat.subDistrictPribadi,
      posCode: alamat.posCode,
    }));
  };

  const handleAlamatPekerjaanChange = (alamat: {
    provincePekerjaan: OptionType;
    cityPekerjaan: OptionType;
    districtPekerjaan: OptionType;
    subDistrictPekerjaan: OptionType;
    posCodePekerjaan: string;
  }) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      provincePekerjaan: alamat.provincePekerjaan,
      cityPekerjaan: alamat.cityPekerjaan,
      districtPekerjaan: alamat.districtPekerjaan,
      subDistrictPekerjaan: alamat.subDistrictPekerjaan,
      posCodePekerjaan: alamat.posCodePekerjaan,
    }));
  };

  const handleBank = (namaBank: OptionType) => {
    setDataPribadi((prev) => ({
      ...prev,
      namaBank: namaBank,
    }));
  };

  const handleBankPekerjaan = (namaBank_efek: OptionType) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      namaBank_efek: namaBank_efek,
    }));
  };

  const handleUploadSelfie = (url: string) => {
    setDataPribadi((prev) => ({
      ...prev,
      fotoPemodalUrlPribadi: url, // update hanya foto
    }));
  };

  const validateStep0 = () => {
    const result = schemaDataPribadi.safeParse(dataPribadi);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setErrorsPribadi(errors);
      return false;
    }
    setErrorsPribadi({});
    return true;
  };

  const validateStep1 = async () => {
    const result = schemaDataPekerjaan.safeParse(dataPekerjaan);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setErrorsPekerjaan(errors);
      return false;
    }
    setErrorsPekerjaan({});
    return true;
  };

  const handleNext = () => {
    if (isUpdate) {
      handleSubmit();
      return;
    }

    if (selectedIndex === 0) {
      const isValid = validateStep0();
      if (!isValid) return;
    }

    setSelectedIndex((prev) => prev + 1);
  };

  function mapFormToDataType(
    form: string | null,
    data: any,
  ): {
    dataType: string;
    val: string;
  } {
    if (!form) return { dataType: "", val: "" };

    switch (form.toLowerCase()) {
      case "upload-ktp-pic":
        return { dataType: "ktp_path", val: data.ktpUrl };
      case "npwp":
        return { dataType: "npwp_path", val: data.npwpUrl };
      case "slip-gaji":
        return { dataType: "ip_gaji", val: data.slipGajiUrl };
      default:
        return { dataType: "", val: "" };
    }
  }

  const handleSubmit = async () => {
    const savedData = localStorage.getItem("formPemodal");

    if (!savedData) {
      Swal.fire({
        title: "Gagal",
        text: "Data Tidak ditemukan.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    if (isUpdate) {
      let formIsValid = false;
      if (selectedIndex === 0) {
        formIsValid = validateStep0();
      }

      if (selectedIndex === 1) {
        formIsValid = await validateStep1();
      }
      if (!formIsValid) {
        Swal.fire({
          title: "Data Tidak Lengkap / Tidak Valid",
          text: "Beberapa kolom berisi data yang tidak valid atau belum diisi. Harap koreksi sebelum melanjutkan.",
          icon: "warning",
          timer: 10000,
          showConfirmButton: false,
        });
        return;
      }
    } else {
      const isValid = await validateStep1();
      if (!isValid && IS_PROD) return;
    }

    try {
      const data = JSON.parse(savedData);

      if (!isUpdate) {
        const payload = {
          role: "1",
          ktp: {
            name: data.nama,
            place_datebirth: `${data.tempatLahir}, ${data.tanggalLahir}`,
            nik: data.nik,
            nik_path: data.ktpUrl,
          },
          gender: data.jenisKelamin === "Laki-Laki" ? "L" : "P",
          status_marital: data.statusPernikahan,
          last_education: data.pendidikanTerakhir,
          province_name: data.provincePribadi?.label,
          city_name: data.cityPribadi?.label,
          district_name: data.districtPribadi?.label,
          subdistrict_name: data.subDistrictPribadi?.label,
          postal_code: data.posCode,
          address_detail: data.addres,
          avatar: data.fotoPemodalUrlPribadi,
          occupation:
            data.pekerjaan === "Lainnya"
              ? data.pekerjaanLainnya
              : data.pekerjaan,
          signature_path: data.signature,
          nama_ahli_waris: data.nama_ahli_waris,
          phone_ahli_waris: data.phone_ahli_waris,
          slip_gaji: data.slipGajiUrl,
          nama_rekening_efek: data.namaPemilik_efek || "-",
          nomor_rekening_efek: data.nomorRekening_efek || "-",
          nomor_sub_rekening_efek: "-",
          bank_rekening_efek: data.namaBank_efek?.label || "-",
          bank: {
            name: data.namaBank.label,
            no: data.nomorRekening,
            owner: data.namaPemilik,
            branch: data.cabangBank,
            rek_koran_path: data.rekeningKoran || "-",
          },
          job: {
            province_name: data.provincePekerjaan?.label,
            city_name: data.cityPekerjaan?.label,
            district_name: data.districtPekerjaan?.label,
            subdistrict_name: data.subDistrictPekerjaan?.label,
            postal_code: data.posCodePekerjaan,
            company: data.namaPerusahaan,
            address: data.alamatPerusahaan,
            position: data.jabatan,
            monthly_income: data.penghasilanBulanan,
            npwp_path: data.npwpUrl,
            npwp: data.npwp,
            annual_income: data.penghasilanTahunan,
          },
          risk: {
            goal:
              data.tujuanInvestasi === "Lainnya"
                ? data.tujuanInvestasiLainnya
                : data.tujuanInvestasi,
            tolerance: data.toleransiResiko,
            experience: data.pengalamanvInvestasi,
            pengetahuan_pasar_modal: data.pengetahuanPasarModal,
          },
        };

        await axios.post(`${API_BACKEND}/api/v1/auth/assign/role`, payload, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        setCookie(
          "user",
          JSON.stringify({
            ...user,
            role: "investor",
          } as AuthDataResponse),
        );
      } else {
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
          const { dataType, val } = mapFormToDataType(form, data);
          const payload = { val };

          await axios.put(
            `${API_BACKEND}/api/v1/document/update/user/${dataType}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            },
          );
          localStorage.removeItem("formPemodal");
          localStorage.removeItem("signature");
          Cookies.remove("formPemodal");

          setSubmitted(true);

          Swal.fire({
            title: "Berhasil",
            text: "Data berhasil dikirim",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            setSelectedIndex(0);
            router.replace("/dashboard");
          });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Swal.fire({
          title: "Gagal",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat mengirim data.",
          icon: "warning",
          timer: 3000,
        });
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan yang tidak diketahui.",
          icon: "warning",
          timer: 3000,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] md:mt-52">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-400 fill-[#10565C]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto text-black px-10 md:px-24 py-20">
      {selectedIndex === 0 && dataProfile && (
        <div>
          <ComponentDataPribadi
            formData={dataPribadi}
            onChange={handleChangeDataPribadi}
            onGenderChange={handleGenderChange}
            onWeddingChange={handleWeddingChange}
            onEducationChange={handleEducationChange}
            onPekerjaanChange={onPekerjaanChange}
            onUploadKTP={(url: string, keyName: string) =>
              setDataPribadi((prev) => ({ ...prev, [keyName]: url }))
            }
            onAlamatChange={handleAlamatChange}
            errors={errorsPribadi}
            onBankChange={handleBank}
            onLihatKTP={() => setPreviewOpen(true)}
            isUpdate={isUpdate}
            dataProfile={dataProfile}
            onUploadSelfie={handleUploadSelfie}
          />
          <FileViewerModal
            src={dataPribadi.ktpUrl}
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
          />
        </div>
      )}

      {selectedIndex === 1 && dataProfile && (
        <div>
          <ComponentDataPekerjaan
            formData={dataPekerjaan}
            onChange={handleChangeDataPekerjaan}
            onPenghasilanBulanan={handlePenghasilanBulananChange}
            onPenghasilanTahunan={handlePenghasilanTahunanChange}
            onTujuanInvetasi={handleonTujuanInvetasiChange}
            onToleransiResiko={handleToleransiResikoChange}
            onPengalamanInvestasi={handlePengalamanInvestasi}
            onPengetahuanPasarModal={handlePengetahuanPasarModal}
            onCheckboxChange={handleCheckboxChange}
            onSignatureSave={handleSignatureSave}
            onUploadKTP={(url: string, keyName: string) =>
              setDataPekerjaan((prev) => ({ ...prev, [keyName]: url }))
            }
            onAlamatChange={handleAlamatPekerjaanChange}
            errors={errorsPekerjaan}
            onLihatNPWP={() => {
              setPreviewFileUrl(dataPekerjaan.npwpUrl);
              setPreviewOpen(true);
            }}
            onLihatFotoPemodal={() => {
              setPreviewFileUrl(dataPekerjaan.fotoPemodalUrl);
              setPreviewOpen(true);
            }}
            onLihatSlipGaji={() => {
              setPreviewFileUrl(dataPekerjaan.slipGajiUrl);
              setPreviewOpen(true);
            }}
            isUpdate={isUpdate}
            dataProfile={dataProfile}
            onBankChange={handleBankPekerjaan}
          />
          <FileViewerModal
            src={previewFileUrl ?? ""}
            open={previewOpen}
            onClose={() => {
              setPreviewOpen(false);
              setPreviewFileUrl(undefined);
            }}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-5">
        {!isUpdate && (
          <button
            onClick={() => setSelectedIndex((prev) => prev - 1)}
            disabled={selectedIndex === 0}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Kembali
          </button>
        )}

        {selectedIndex < 1 ? (
          <button
            onClick={handleNext}
            disabled={
              selectedIndex === 1 &&
              (!dataPekerjaan.setujuKebenaranData ||
                !dataPekerjaan.setujuRisikoInvestasi)
            }
            className={`px-4 py-2 rounded text-white ${
              selectedIndex === 1 &&
              (!dataPekerjaan.setujuKebenaranData ||
                !dataPekerjaan.setujuRisikoInvestasi)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3C2B90] hover:bg-[#2e2176]"
            }`}
          >
            {isUpdate ? "Update Data" : "Selanjutnya"}
          </button>
        ) : (
          <Tooltip
            label="Checklist Syarat & Ketentuan terlebih dahulu"
            showTooltip={
              !dataPekerjaan.setujuKebenaranData ||
              !dataPekerjaan.setujuRisikoInvestasi
            }
          >
            <button
              onClick={handleSubmit}
              disabled={
                !dataPekerjaan.setujuKebenaranData ||
                !dataPekerjaan.setujuRisikoInvestasi
              }
              className={`px-8 py-2 rounded text-white ${
                !dataPekerjaan.setujuKebenaranData ||
                !dataPekerjaan.setujuRisikoInvestasi
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3C2B90] hover:bg-[#2e2176]"
              }`}
            >
              {isUpdate ? "Update Data" : "Kirim Data"}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default FormPemodal;
