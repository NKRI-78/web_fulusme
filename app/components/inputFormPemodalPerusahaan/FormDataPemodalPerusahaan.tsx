"use client";

import React, { useEffect, useState } from "react";
import DataPemodalPerusahaanV1 from "./DataPemodalPerusahaanV1/DataPemodalPerusahaanV1";
import { z } from "zod";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import FileViewer from "@/app/(defaults)/viewer/components/FilePreviewModalV2";
import { API_BACKEND } from "@/app/utils/constant";
import { useSearchParams } from "next/navigation";
import { setCookie } from "@/app/helper/cookie";
import { getUser } from "@/app/lib/auth";

const FormDataPemodalPerusahaan: React.FC = () => {
  type OptionType = { value: string; label: string } | null;

  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("update") === "true";
  const formType = searchParams.get("form") ?? "";

  const [profile, setProfile] = useState<any>(null);

  const [formData, setFormData] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodalPerusahaan");
      if (saved) return JSON.parse(saved);
    }
    return {
      jenisPerusahaan: "",
      nomorAktaPerubahanTerakhir: "",
      nomorNpwpPerusahaan: "",
      noTeleponPerusahaan: "",
      situsPerusahaan: "",
      emailPerusahaan: "",
      namaBank: null,
      nomorRekening: "",
      namaPemilik: "",

      aktaPerubahanTerakhirUrl: "",
      aktaPendirianPerusahaanUrl: "",
      skPendirianUrl: "",
      skKumhamPerusahaanUrl: "",
      npwpPerusahaanUrl: "",

      provincePemodalPerusahaan: null,
      cityPemodalPerusahaan: null,
      districtPemodalPerusahaan: null,
      subDistrictPemodalPerusahaan: null,

      posCode: "",
      addres: "",

      namaBank_efek: null,
      nomorRekening_efek: "",
      namaPemilik_efek: "",

      setujuKebenaranData: false,
      setujuRisikoInvestasi: false,
    };
  });

  const router = useRouter();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | undefined>(
    undefined
  );

  const [errorsPemodalPerusahaan, setErrorsPemodalPerusahaan] = useState<
    Record<string, string[]>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleBank = (namaBank: OptionType) => {
    setFormData((prev: any) => ({
      ...prev,
      namaBank: namaBank,
    }));
  };

  const handleBankEfek = (namaBank_efek: OptionType) => {
    setFormData((prev: any) => ({
      ...prev,
      namaBank_efek: namaBank_efek,
    }));
  };

  const handleAlamatChange = (alamat: {
    provincePemodalPerusahaan: OptionType;
    cityPemodalPerusahaan: OptionType;
    districtPemodalPerusahaan: OptionType;
    subDistrictPemodalPerusahaan: OptionType;
    posCode: string;
  }) => {
    setFormData((prev: any) => ({
      ...prev,
      provincePemodalPerusahaan: alamat.provincePemodalPerusahaan,
      cityPemodalPerusahaan: alamat.cityPemodalPerusahaan,
      districtPemodalPerusahaan: alamat.districtPemodalPerusahaan,
      subDistrictPemodalPerusahaan: alamat.subDistrictPemodalPerusahaan,
      posCode: alamat.posCode,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev: any) => {
      return { ...prev, [name]: checked };
    });
  };

  useEffect(() => {
    if (!isUpdate) return;

    const userCookie = Cookies.get("user");
    if (!userCookie) return;

    const user = JSON.parse(userCookie);
    const token = user?.token;
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BACKEND}/api/v1/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = res.data?.data;
        setProfile(profile);

        if (
          isUpdate &&
          [
            "akta-pendirian-perusahaan",
            "sk-pendirian-perusahaan",
            "sk-kumham-path",
            "npwp-perusahaan",
            "akta-perubahan-terakhir",
          ].includes(formType)
        ) {
          setFormData((prev: any) => ({
            ...prev,

            jenisPerusahaan: profile?.company?.jenis_perusahaan || "",
            nomorAktaPerubahanTerakhir:
              profile?.company?.akta_perubahan_terahkir || "",
            nomorNpwpPerusahaan: profile?.company?.npwp || "",
            noTeleponPerusahaan: profile?.company?.phone || "",
            situsPerusahaan: profile?.company?.site || "",
            emailPerusahaan: profile?.company?.email || "",
            aktaPerubahanTerakhirUrl:
              profile?.company?.akta_perubahan_terahkir_path || "",

            aktaPendirianPerusahaanUrl: profile?.company?.akta_pendirian || "",
            skPendirianUrl: profile?.company?.sk_pendirian_perusahaan || "",
            skKumhamPerusahaanUrl: profile?.company?.sk_kumham_path || "",
            npwpPerusahaanUrl: profile?.company?.npwp_path || "",

            namaBank: profile?.company?.bank?.name
              ? {
                  value: profile.company.bank.name,
                  label: profile.company.bank.name,
                }
              : null,
            nomorRekening: profile?.company?.bank?.no || "",
            namaPemilik: profile?.company?.bank?.owner || "",

            namaBank_efek: profile?.profile_security_account?.account_bank
              ? {
                  value: profile.profile_security_account.account_bank,
                  label: profile.profile_security_account.account_bank,
                }
              : null,
            nomorRekening_efek:
              profile?.profile_security_account?.account || "",
            namaPemilik_efek:
              profile?.profile_security_account?.account_name || "",

            provincePemodalPerusahaan: profile?.company?.address?.[0]
              ?.province_name
              ? {
                  value: profile.company.address[0].province_name,
                  label: profile.company.address[0].province_name,
                }
              : null,
            cityPemodalPerusahaan: profile?.company?.address?.[0]?.city_name
              ? {
                  value: profile.company.address[0].city_name,
                  label: profile.company.address[0].city_name,
                }
              : null,
            districtPemodalPerusahaan: profile?.company?.address?.[0]
              ?.district_name
              ? {
                  value: profile.company.address[0].district_name,
                  label: profile.company.address[0].district_name,
                }
              : null,
            subDistrictPemodalPerusahaan: profile?.company?.address?.[0]
              ?.subdistrict_name
              ? {
                  value: profile.company.address[0].subdistrict_name,
                  label: profile.company.address[0].subdistrict_name,
                }
              : null,

            posCode: profile?.company?.address?.[0]?.postal_code || "",
            addres: profile?.company?.address?.[0]?.detail || "",

            setujuKebenaranData: false,
            setujuRisikoInvestasi: false,
          }));
        }
      } catch (err) {
        console.error("Gagal fetch profile:", err);
      }
    };

    fetchProfile();
  }, [isUpdate]);

  const schemaDataPemodalPerusahaan = z.object({
    jenisPerusahaan: z.string().min(1, "Jenis perusahaan harus diisi"),
    nomorAktaPerubahanTerakhir: z.string().min(1, "Nomor akta harus diisi"),
    nomorNpwpPerusahaan: z.string().min(1, "Nomor NPWP harus diisi"),
    noTeleponPerusahaan: z.string().min(1, "No telepon perusahaan harus diisi"),
    situsPerusahaan: z.string().url("Situs perusahaan tidak valid"),
    emailPerusahaan: z.string().email("Email tidak valid"),
    namaBank: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Nama bank wajib dipilih",
      }),
    nomorRekening: z.string().min(1, "Nomor rekening harus diisi"),
    namaPemilik: z.string().min(1, "Nama rekening perusahaan harus diisi"),

    aktaPendirianPerusahaanUrl: z.string().url("Akta harus diisi"),
    skPendirianUrl: z.string().url("SK Pendirian "),
    skKumhamPerusahaanUrl: z.string().url("SK Kumham tidak valid"),
    npwpPerusahaanUrl: z.string().url("NPWP tidak valid"),

    provincePemodalPerusahaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Provinsi wajib dipilih",
      }),
    cityPemodalPerusahaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Kota wajib dipilih",
      }),
    districtPemodalPerusahaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Kecamatan wajib dipilih",
      }),
    subDistrictPemodalPerusahaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Kelurahan wajib dipilih",
      }),

    posCode: z.string().min(1, "Kode pos wajib diisi"),
    addres: z.string().min(1, "Alamat wajib diisi"),

    setujuKebenaranData: z.literal(true),
    setujuRisikoInvestasi: z.literal(true),
  });

  useEffect(() => {
    localStorage.setItem("formPemodalPerusahaan", JSON.stringify(formData));
  }, [formData]);

  const validateStep = () => {
    const result = schemaDataPemodalPerusahaan.safeParse(formData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setErrorsPemodalPerusahaan(errors);
      return false;
    }
    setErrorsPemodalPerusahaan({});
    return true;
  };
  const [token, setToken] = useState(null);
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (!userCookie) return;

    const user = JSON.parse(userCookie);
    const token = user?.token;

    if (!token) return;
    setToken(token);
  });

  const handleSubmit = async () => {
    if (isUpdate) {
      onUpdateEvent();
    } else {
      onSubmitEvent();
    }
  };

  const onSubmitEvent = async () => {
    const savedData = localStorage.getItem("formPemodalPerusahaan");

    if (!savedData) {
      Swal.fire({
        title: "Gagal",
        text: "Data tidak ditemukan. Silakan isi formulir terlebih dahulu.",
        icon: "error",
        timer: 3000,
      });
      return;
    }
    const isValid = await validateStep();
    if (!isValid) return;
    try {
      const data = JSON.parse(savedData);
      const payload = {
        role: "9",
        company_name: "-",
        company_nib: "-",
        company_nib_path: "-",
        akta_pendirian: data.aktaPendirianPerusahaanUrl,
        akta_perubahan_terahkir: data.nomorAktaPerubahanTerakhir,
        akta_perubahan_terahkir_path: data.aktaPerubahanTerakhirUrl,
        sk_kumham: "-",
        sk_kumham_terahkir: "-",
        sk_kumham_path: data.skKumhamPerusahaanUrl,
        sk_pendirian_perusahaan: data.skPendirianUrl,
        npwp: data.nomorNpwpPerusahaan,
        npwp_path: data.npwpPerusahaanUrl,
        didirkan: "-",
        site: data.situsPerusahaan,
        email: data.emailPerusahaan,
        phone: data.noTeleponPerusahaan,
        bank_name: data.namaBank?.label || "-",
        bank_account: data.nomorRekening,
        bank_owner: data.namaPemilik,
        siup: "-",
        tdp: "-",
        jenis_usaha: "99",
        jenis_perusahaan: String(data.jenisPerusahaan),
        status_kantor: "99",
        total_employees: "-",
        laporan_keuangan_path: "-",

        nama_rekening_efek: data.namaPemilik_efek,
        nomor_rekening_efek: data.nomorRekening_efek,
        bank_rekening_efek: data.namaBank_efek?.label || "-",

        address: [
          {
            name: "-",
            detail: data.addres,
            province_name: data.provincePemodalPerusahaan?.label || "-",
            city_name: data.cityPemodalPerusahaan?.label || "-",
            district_name: data.districtPemodalPerusahaan?.label || "-",
            subdistrict_name: data.subDistrictPemodalPerusahaan?.label || "-",
            postal_code: data.posCode,
          },
        ],

        directors: [
          {
            title: "-",
            name: "-",
            position: "-",
            ktp: "-",
            ktp_path: "-",
            npwp: "-",
            npwp_path: "-",
          },
        ],

        komisaris: [
          {
            title: "-",
            name: "-",
            position: "-",
            ktp: "-",
            ktp_path: "-",
            npwp: "-",
            npwp_path: "-",
          },
        ],

        project: {
          title: "-",
          jenis_project: "-",
          jumlah_minimal: "-",
          jangka_waktu: "-",
          tingkat_bunga: "-",
          jaminan_kolateral: [{ name: "-" }],
          penggunaan_dana: [{ name: "-" }],
          company_profile: "-",
          jadwal_pembayaran_bunga: "-",
          jadwal_pembayaran_pokok: "-",
          deskripsi_pekerjaan: "-",
          project_media_path: [],
          no_contract_path: "-",
          no_contract_value: "-",
          is_apbn: null,
        },
      };

      const response = await axios.post(
        `https://api-capbridge.langitdigital78.com/api/v1/auth/assign/role`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Berhasil",
        text: "Data berhasil dikirim!",
        icon: "success",
        timer: 3000,
      });

      localStorage.removeItem("formPemodalPerusahaan");
      Cookies.remove("formPemodalPerusahaan");

      const userData = getUser();

      setCookie(
        "user",
        JSON.stringify({
          ...userData,
          role: "investor institusi",
        })
      );

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error submitting form:", error.response?.data?.message);
        Swal.fire({
          title: "Gagal",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat mengirim data.",
          icon: "warning",
          timer: 3000,
        });
      } else {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan yang tidak diketahui.",
          icon: "warning",
          timer: 3000,
        });
      }
    }
  };

  function mapFormToDataType(
    form: string | null,
    data: any
  ): {
    dataType: string;
    val: string;
  } {
    if (!form) return { dataType: "", val: "" };

    switch (form.toLowerCase()) {
      case "akta-perubahan-terakhir":
        return {
          dataType: "akta_perubahan_terahkir_path",
          val: formData.aktaPerubahanTerakhirUrl,
        };
      case "akta-pendirian-perusahaan":
        return {
          dataType: "akta_pendirian",
          val: formData.aktaPendirianPerusahaanUrl,
        };
      case "sk-pendirian-perusahaan":
        return {
          dataType: "sk_pendirian_perusahaan",
          val: formData.skPendirianUrl,
        };
      case "sk-kumham-path":
        return {
          dataType: "sk_kumham_path",
          val: formData.skKumhamPerusahaanUrl,
        };
      case "npwp-perusahaan":
        return {
          dataType: "npwp_path",
          val: formData.npwpPerusahaanUrl,
        };
      default:
        return { dataType: "", val: "" };
    }
  }

  const onUpdateEvent = async () => {
    const isValid = validateStep();

    if (isValid) {
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
        try {
          const userData = getUser();

          if (!userData) return;

          const userId = profile?.id || userData?.id;
          const companyId = profile?.company?.id;

          const { dataType, val } = mapFormToDataType(formType, formData);

          const payload = {
            val,
            user_id: userId,
            company_id: companyId,
          };

          const res = await axios.put(
            `${API_BACKEND}/api/v1/document/update/${dataType}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );

          setCookie(
            "user",
            JSON.stringify({
              ...userData,
              role: "investor institusi",
            })
          );

          await Swal.fire({
            icon: "success",
            title: "Data berhasil diperbarui",
            text: "Perubahan data Anda sudah tersimpan.",
            timer: 3000,
            timerProgressBar: true,
          });

          localStorage.removeItem("pemodalPerusahaanCache");
          localStorage.removeItem("formPemodalPerusahaan");
          Cookies.remove("formPemodalPerusahaan");
          router.push("/dashboard");
        } catch (error: any) {
          console.error("Update error detail:", error);
          Swal.fire({
            icon: "error",
            title: "Update gagal",
            text:
              error.response?.data?.message ||
              "Terjadi kesalahan saat update data.",
          });
        }
      }
    }
  };

  return (
    <div className="bg-white w-full mx-auto text-black px-10 md:px-24 py-20">
      <DataPemodalPerusahaanV1
        formData={formData}
        onChange={handleChange}
        onUploadAktaPendirianPerusahaan={(url, key) =>
          setFormData((prev: any) => ({ ...prev, [key]: url }))
        }
        onUploadSkPendirian={(url, key) =>
          setFormData((prev: any) => ({ ...prev, [key]: url }))
        }
        onUploadSkKumhamPerusahaan={(url, key) =>
          setFormData((prev: any) => ({ ...prev, [key]: url }))
        }
        onUploadNpwpPerusahaan={(url, key) =>
          setFormData((prev: any) => ({ ...prev, [key]: url }))
        }
        onBankChange={handleBank}
        onBankEfekChange={handleBankEfek}
        onAlamatChange={handleAlamatChange}
        onCheckboxChange={handleCheckboxChange}
        errors={errorsPemodalPerusahaan}
        onLihatAktaPendirianPerusahaan={() => {
          setPreviewFileUrl(formData.aktaPendirianPerusahaanUrl);
          setPreviewOpen(true);
        }}
        onLihatNpwpPerusahaan={() => {
          setPreviewFileUrl(formData.npwpPerusahaanUrl);
          setPreviewOpen(true);
        }}
        onLihatSkKumhamPerusahaan={() => {
          setPreviewFileUrl(formData.skKumhamPerusahaanUrl);
          setPreviewOpen(true);
        }}
        onLihatSkPendirianPerusahaan={() => {
          setPreviewFileUrl(formData.skPendirianUrl);
          setPreviewOpen(true);
        }}
        onLihatAktaPerubahanTerakhir={() => {
          setPreviewFileUrl(formData.aktaPerubahanTerakhirUrl);
          setPreviewOpen(true);
        }}
      />

      <FileViewer
        src={previewFileUrl ?? ""}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewFileUrl(undefined);
        }}
      />

      <div className="mt-2 flex justify-end">
        <button
          className={`px-6 py-2 rounded-lg text-white ${
            formData.setujuKebenaranData && formData.setujuRisikoInvestasi
              ? isUpdate
                ? "bg-[#3C2B90] hover:bg-[#2e2176]"
                : "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={
            !formData.setujuKebenaranData || !formData.setujuRisikoInvestasi
          }
        >
          {isUpdate ? "Update Data" : "Kirim Data"}
        </button>
      </div>
    </div>
  );
};

export default FormDataPemodalPerusahaan;
