"use client";

import React, { useState, useEffect, useMemo } from "react";
import { compressImage } from "@/app/helper/CompressorImage";
import axios from "axios";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { fetchJenisUsaha, TypeOption } from "@/app/utils/fetchJenisUsaha";
import Select from "react-select";
import { FaFileAlt } from "react-icons/fa";
import { fetchJenisPerusahaan } from "@/app/utils/fetchJenisPerusahaan";
import UpdateRing from "@/app/components/inputFormPemodal/component/UpdateRing";
import { useSearchParams } from "next/navigation";

interface Props {
  formData: {
    jenisPerusahaan: string;
    nomorAktaPerubahanTerakhir: string;
    nomorNpwpPerusahaan: string;
    noTeleponPerusahaan: string;
    situsPerusahaan: string;
    emailPerusahaan: string;
    namaBank: { value: string; label: string };
    nomorRekening: string;
    namaPemilik: string;

    aktaPerubahanTerakhirUrl?: string;
    aktaPendirianPerusahaanUrl?: string;
    skPendirianUrl?: string;
    skKumhamPerusahaanUrl?: string;
    npwpPerusahaanUrl?: string;

    provincePemodalPerusahaan: { value: string; label: string };
    cityPemodalPerusahaan: { value: string; label: string };
    districtPemodalPerusahaan: { value: string; label: string };
    subDistrictPemodalPerusahaan: { value: string; label: string };
    posCode: string;
    addres: string;

    namaBank_efek: { value: string; label: string };
    nomorRekening_efek: string;
    namaPemilik_efek: string;

    setujuRisikoInvestasi: boolean;
    setujuKebenaranData: boolean;
  };
  onLihatAktaPerubahanTerakhir?: () => void;
  onLihatAktaPendirianPerusahaan?: () => void;
  onLihatSkPendirianPerusahaan?: () => void;
  onLihatSkKumhamPerusahaan?: () => void;
  onLihatNpwpPerusahaan?: () => void;

  errors?: Record<string, string[]>;
  onBankChange: (bank: { value: string; label: string } | null) => void;
  onBankEfekChange: (bank: { value: string; label: string } | null) => void;

  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onUploadAktaPendirianPerusahaan: (url: string, keyName: string) => void;
  onUploadSkPendirian: (url: string, keyName: string) => void;
  onUploadSkKumhamPerusahaan: (url: string, keyName: string) => void;
  onUploadNpwpPerusahaan: (url: string, keyName: string) => void;
  onAlamatChange: (alamat: {
    provincePemodalPerusahaan: { value: string; label: string } | null;
    cityPemodalPerusahaan: { value: string; label: string } | null;
    districtPemodalPerusahaan: { value: string; label: string } | null;
    subDistrictPemodalPerusahaan: { value: string; label: string } | null;
    posCode: string;
  }) => void;
}

const ComponentDataPemodalPerusahaanV1: React.FC<Props> = ({
  formData,
  onChange,
  onUploadAktaPendirianPerusahaan,
  onBankChange,
  onBankEfekChange,
  onAlamatChange,
  onCheckboxChange,
  onLihatAktaPendirianPerusahaan,
  onLihatAktaPerubahanTerakhir,
  onLihatSkPendirianPerusahaan,
  onLihatSkKumhamPerusahaan,
  onLihatNpwpPerusahaan,

  errors,
}) => {
  const [optionsBussines, setOptionsBussines] = useState<TypeOption[]>([]);
  const [selectedJenisPerusahaan, setSelectedJenisPerusahaan] =
    useState<any>(null);

  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  type OptionValue = {
    value: string;
    label: string;
  };

  type OptionType = OptionValue | null;

  const [province, setProvince] = useState<any>([]);
  const [
    selectedProvincePemodalPerusahaan,
    setSelectedProvincePemodalPerusahaan,
  ] = useState<OptionType>(null);
  const [city, setCity] = useState<any>([]);
  const [selectedCityPemodalPerusahaan, setSelectedCityPemodalPerusahaan] =
    useState<OptionType>(null);

  const [district, setDistrict] = useState<any>([]);
  const [
    selectedDistrictPemodalPerusahaan,
    setSelectedDistrictPemodalPerusahaan,
  ] = useState<OptionType>(null);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [
    selectedSubDistrictPemodalPerusahaan,
    setSelectedSubDistrictPemodalPerusahaan,
  ] = useState<OptionType>(null);
  const [posCode, setPosCode] = useState("");

  const [selectedBank, setSelectedBank] = useState<OptionType>(null);
  const [selectedBankEfek, setSelectedBankEfek] = useState<OptionType>(null);
  const [bank, setBank] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("update") === "true";
  const formType = searchParams.get("form");

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const response = await axios.get(
          `https://api.gateway.langitdigital78.com/v1/bank`
        );
        setBank(response.data.data.beneficiary_banks);
      } catch (error) {
        console.error("Gagal ambil bank:", error);
      }
    };

    fetchBank();
  }, []);

  const urlWilayah = "https://api.wilayah.site";

  useEffect(() => {
    if (!formData?.jenisPerusahaan || !optionsBussines.length) return;

    const matchedOption = optionsBussines.find(
      (option) =>
        String(option.value) === String(formData.jenisPerusahaan) ||
        String(option.label) === String(formData.jenisPerusahaan)
    );

    if (matchedOption) {
      setSelectedJenisPerusahaan(matchedOption);
    } else {
      setSelectedJenisPerusahaan(null);
    }
  }, [formData?.jenisPerusahaan, optionsBussines]);

  useEffect(() => {
    if (!Object.keys(formData).length) return;

    if (formData.provincePemodalPerusahaan)
      setSelectedProvincePemodalPerusahaan(formData.provincePemodalPerusahaan);
    if (formData.cityPemodalPerusahaan)
      setSelectedCityPemodalPerusahaan(formData.cityPemodalPerusahaan);
    if (formData.districtPemodalPerusahaan)
      setSelectedDistrictPemodalPerusahaan(formData.districtPemodalPerusahaan);
    if (formData.subDistrictPemodalPerusahaan)
      setSelectedSubDistrictPemodalPerusahaan(
        formData.subDistrictPemodalPerusahaan
      );
    if (formData.namaBank) setSelectedBank(formData.namaBank);
    if (formData.namaBank_efek) setSelectedBankEfek(formData.namaBank_efek);
    if (formData.posCode) setPosCode(formData.posCode);
  }, [formData]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/province`);
        setProvince(response.data.data);
      } catch (error) {
        console.error("Gagal ambil province:", error);
      }
    };

    fetchProvince();
  }, []);

  useEffect(() => {
    if (!selectedProvincePemodalPerusahaan) return;
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/city`, {
          params: {
            code: selectedProvincePemodalPerusahaan?.value,
          },
        });
        setCity(response.data.data);
      } catch (error) {
        console.error("Gagal ambil city:", error);
      }
    };

    fetchCity();
  }, [selectedProvincePemodalPerusahaan]);

  useEffect(() => {
    if (!selectedCityPemodalPerusahaan) return;
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/district`, {
          params: {
            code: selectedCityPemodalPerusahaan?.value,
          },
        });
        setDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil district:", error);
      }
    };

    fetchDistrict();
  }, [selectedCityPemodalPerusahaan]);

  useEffect(() => {
    if (!selectedDistrictPemodalPerusahaan) return;
    const fetchSubDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/subdistrict`, {
          params: {
            code: selectedDistrictPemodalPerusahaan?.value,
          },
        });
        setSubDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil subdistrict:", error);
      }
    };

    fetchSubDistrict();
  }, [selectedDistrictPemodalPerusahaan]);

  useEffect(() => {
    if (!selectedSubDistrictPemodalPerusahaan) return;

    const fetchPosCode = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/postalcode`, {
          params: {
            code: selectedSubDistrictPemodalPerusahaan?.value,
          },
        });
        setPosCode(response?.data?.data?.postal_code || "");
      } catch (error) {
        console.error("Gagal ambil kode pos:", error);
      }
    };

    fetchPosCode();
  }, [selectedSubDistrictPemodalPerusahaan]);

  const customOptions = province?.map(
    (province: { code: string; nama: string }) => ({
      value: province.code,
      label: province.nama,
    })
  );

  const customOptionsCity = city?.map(
    (city: { code: string; nama: string }) => ({
      value: city.code,
      label: city.nama,
    })
  );

  const customOptionsDistrict = district?.map(
    (district: { code: string; nama: string }) => ({
      value: district.code,
      label: district.nama,
    })
  );

  const customOptionsSubDistrict = subDistrict?.map(
    (subDistrict: { code: string; nama: string }) => ({
      value: subDistrict.code,
      label: subDistrict.nama,
    })
  );

  const customOptionsBank = useMemo(() => {
    return bank.map((b) => ({
      value: b.code,
      label: b.name,
    }));
  }, [bank]);

  const customOptionsBankEfek = useMemo(() => {
    return bank.map((b) => ({
      value: b.code,
      label: b.name,
    }));
  }, [bank]);

  const formatOptionLabel = ({ label, icon }: any) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
    </div>
  );

  useEffect(() => {
    fetchJenisPerusahaan()
      .then(setOptionsBussines)
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const keyName = e.target.getAttribute("data-keyname");
    if (!file || !keyName) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    const compressedFile = await compressImage(file);
    const formDataUpload = new FormData();
    formDataUpload.append("folder", "web");
    formDataUpload.append("subfolder", keyName);
    formDataUpload.append("media", compressedFile);

    setUploadStatus((prev) => ({ ...prev, [keyName]: true }));
    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
        formDataUpload
      );

      const fileUrl = res.data?.data?.path;
      if (fileUrl) {
        const labelMap: { [key: string]: string } = {
          aktaPerubahanTerakhirUrl: "Akta Perubahan Terakhir",
          aktaPendirianPerusahaanUrl: "Akta Pendirian Perusahaan",
          skPendirianUrl: "SK Pendirian",
          skKumhamPerusahaanUrl: "SK KUMHAM Perusahaan",
          npwpPerusahaanUrl: "NPWP Perusahaan",
        };
        const formattedKey = labelMap[keyName] || keyName;

        Swal.fire({
          title: "Berhasil",
          text: `Upload ${formattedKey} berhasil!`,
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        onUploadAktaPendirianPerusahaan(fileUrl, keyName ?? "");
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
      }
    } catch (error) {
      console.error("Gagal upload KTP:", error);
      Swal.fire({
        title: "Gagal",
        text: `Upload ${keyName} gagal. Silakan coba lagi.`,
        icon: "warning",
        timer: 3000,
      });
    } finally {
      setUploadStatus((prev) => ({ ...prev, [keyName]: false }));
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
      borderColor: state.isFocused ? "#14b8a6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : null,
      "&:hover": {
        borderColor: "#14b8a6",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#14b8a6"
        : state.isFocused
        ? "#ccfbf1"
        : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
    }),
  };

  useEffect(() => {
    if (
      selectedProvincePemodalPerusahaan &&
      selectedCityPemodalPerusahaan &&
      selectedDistrictPemodalPerusahaan &&
      selectedSubDistrictPemodalPerusahaan &&
      posCode
    ) {
      onAlamatChange({
        provincePemodalPerusahaan: selectedProvincePemodalPerusahaan,
        cityPemodalPerusahaan: selectedCityPemodalPerusahaan,
        districtPemodalPerusahaan: selectedDistrictPemodalPerusahaan,
        subDistrictPemodalPerusahaan: selectedSubDistrictPemodalPerusahaan,
        posCode: posCode,
      });
    }
  }, [
    selectedProvincePemodalPerusahaan,
    selectedCityPemodalPerusahaan,
    selectedDistrictPemodalPerusahaan,
    selectedSubDistrictPemodalPerusahaan,
    posCode,
  ]);

  useEffect(() => {
    onBankChange(selectedBank);
  }, [selectedBank]);

  useEffect(() => {
    onBankEfekChange(selectedBankEfek);
  }, [selectedBankEfek]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 p-6 max-w-6xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">
          Isi Data Sebagai Pemodal Perusahaan
        </h2>
        <p className="text-sm text-gray-600">
          Untuk memastikan kelancaran proses verifikasi dan layanan yang
          optimal, kami mengajak Anda untuk melengkapi seluruh data secara
          jujur, benar, dan akurat.
        </p>
        <div>
          <h3 className="font-semibold text-black mb-2">
            1. Jenis Perusahaan <span className="text-red-500">*</span>
          </h3>

          <Select
            instanceId="jenis-perusahaan"
            options={optionsBussines}
            placeholder="Pilih Jenis Perusahaan"
            value={selectedJenisPerusahaan || null}
            className="text-gray-600"
            classNamePrefix="react-select"
            onChange={(selectedOption) => {
              setSelectedJenisPerusahaan(selectedOption);
              const syntheticEvent = {
                target: {
                  name: "jenisPerusahaan",
                  value: selectedOption ? selectedOption.value : "",
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            isClearable
          />
          {errors?.jenisPerusahaan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jenisPerusahaan[0]}
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            2. Nomor Akta Perubahan Terakhir{" "}
            <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            name="nomorAktaPerubahanTerakhir"
            value={formData.nomorAktaPerubahanTerakhir}
            onChange={onChange}
            placeholder="Masukkan Nomor Akta Perubahan Terakhir"
            className="border p-2 w-full rounded mb-0 text-gray-700"
          />
          {errors?.nomorAktaPerubahanTerakhir && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorAktaPerubahanTerakhir[0]}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            3. Upload Dokumen Akta Perubahan Terakhir{" "}
            <span className="text-red-500">*</span>
          </h3>
          <UpdateRing formKey={formType} identity="akta-perubahan-terakhir">
            <input
              type="file"
              id="aktaPerubahanTerakhirUrl"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["aktaPerubahanTerakhirUrl"] === true}
              accept=".pdf,.doc,.docx"
              data-keyname="aktaPerubahanTerakhirUrl"
            />

            <label
              htmlFor="aktaPerubahanTerakhirUrl"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              <>
                <FaFileAlt />
                {isClient && formData.aktaPerubahanTerakhirUrl
                  ? "Update Dokumen"
                  : "Upload Dokumen"}
              </>
            </label>

            {isClient && formData.aktaPerubahanTerakhirUrl && (
              <button
                type="button"
                onClick={onLihatAktaPerubahanTerakhir}
                className="text-blue-600 underline text-sm block mt-2"
              >
                Lihat Dokumen Akta Perubahan Terakhir
              </button>
            )}

            {errors?.aktaPerubahanTerakhirUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.aktaPerubahanTerakhirUrl[0]}
              </p>
            )}
          </UpdateRing>
        </div>

        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            4. Upload Dokumen Akta Pendirian Perusahaan{" "}
            <span className="text-red-500">*</span>
          </h3>

          <UpdateRing formKey={formType} identity="akta-pendirian-perusahaan">
            <input
              type="file"
              id="aktaPendirianPerusahaanUrl"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["aktaPendirianPerusahaanUrl"] === true}
              accept=".pdf,.doc,.docx"
              data-keyname="aktaPendirianPerusahaanUrl"
            />

            <label
              htmlFor="aktaPendirianPerusahaanUrl"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              <>
                <FaFileAlt />
                {isClient && formData.aktaPendirianPerusahaanUrl
                  ? "Update Dokumen"
                  : "Upload Dokumen"}
              </>
            </label>

            {isClient && formData.aktaPendirianPerusahaanUrl && (
              <button
                type="button"
                onClick={onLihatAktaPendirianPerusahaan}
                className="text-blue-600 underline text-sm block mt-2"
              >
                Lihat Dokumen Akta Pendirian Perusahaan
              </button>
            )}

            {errors?.aktaPendirianPerusahaanUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.aktaPendirianPerusahaanUrl[0]}
              </p>
            )}
          </UpdateRing>
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            5. Upload Dokumen SK Pendirian Perusahaan{" "}
            <span className="text-red-500">*</span>
          </h3>

          <UpdateRing formKey={formType} identity="sk-pendirian-perusahaan">
            <input
              type="file"
              id="skPendirianUrl"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["skPendirianUrl"] === true}
              accept=".pdf,.doc,.docx"
              data-keyname="skPendirianUrl"
            />

            <label
              htmlFor="skPendirianUrl"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              <>
                <FaFileAlt />
                {isClient && formData.skPendirianUrl
                  ? "Update Dokumen"
                  : "Upload Dokumen"}
              </>
            </label>

            {isClient && formData.skPendirianUrl && (
              <button
                type="button"
                onClick={onLihatSkPendirianPerusahaan}
                className="text-blue-600 underline text-sm block mt-2"
              >
                Lihat Dokumen SK Pendirian Perusahaan
              </button>
            )}

            {errors?.skPendirianUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.skPendirianUrl[0]}
              </p>
            )}
          </UpdateRing>
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            6. Upload Dokumen SK KUMHAM Perusahaan{" "}
            <span className="text-red-500">*</span>
          </h3>

          <UpdateRing formKey={formType} identity="sk-kumham-path">
            <input
              type="file"
              id="skKumhamPerusahaanUrl"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["skKumhamPerusahaanUrl"] === true}
              accept=".pdf,.doc,.docx"
              data-keyname="skKumhamPerusahaanUrl"
            />

            <label
              htmlFor="skKumhamPerusahaanUrl"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              <>
                <FaFileAlt />
                {isClient && formData.skKumhamPerusahaanUrl
                  ? "Update Dokumen"
                  : "Upload Dokumen"}
              </>
            </label>

            {isClient && formData.skKumhamPerusahaanUrl && (
              <button
                type="button"
                onClick={onLihatSkKumhamPerusahaan}
                className="text-blue-600 underline text-sm block mt-2"
              >
                Lihat Dokumen SK Kumham Perusahaan
              </button>
            )}
            {errors?.skKumhamPerusahaanUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.skKumhamPerusahaanUrl[0]}
              </p>
            )}
          </UpdateRing>
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            7. Upload Dokumen NPWP Perusahaan{" "}
            <span className="text-red-500">*</span>
          </h3>
          <UpdateRing formKey={formType} identity="npwp-perusahaan">
            <input
              type="file"
              id="npwpPerusahaanUrl"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["npwpPerusahaanUrl"] === true}
              accept=".pdf,.doc,.docx"
              data-keyname="npwpPerusahaanUrl"
            />

            <label
              htmlFor="npwpPerusahaanUrl"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              <>
                <FaFileAlt />
                {isClient && formData.npwpPerusahaanUrl
                  ? "Update Dokumen"
                  : "Upload Dokumen"}
              </>
            </label>

            {isClient && formData.npwpPerusahaanUrl && (
              <button
                type="button"
                onClick={onLihatNpwpPerusahaan}
                className="text-blue-600 underline text-sm block mt-2"
              >
                Lihat Dokumen Npwp Perusahaan
              </button>
            )}
            {errors?.npwpPerusahaanUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.npwpPerusahaanUrl[0]}
              </p>
            )}
          </UpdateRing>
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            8. Nomor NPWP Perusahaan <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            name="nomorNpwpPerusahaan"
            value={formData.nomorNpwpPerusahaan}
            onChange={onChange}
            placeholder="Masukkan Nomor NPWP Perusahaan"
            className="border p-2 w-full rounded mb-0 text-gray-700"
          />

          {errors?.nomorNpwpPerusahaan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorNpwpPerusahaan[0]}
            </p>
          )}
        </div>
        <h3 className="font-semibold text-black mt-4 mb-2">
          9. Alamat Tempat Usaha <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
          <div className="text-black">
            <Select
              instanceId="province-pemodal-perusahaan"
              className="mt-0"
              value={selectedProvincePemodalPerusahaan || null}
              options={customOptions}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedProvincePemodalPerusahaan(e);
                setSelectedCityPemodalPerusahaan(null);
                setSelectedDistrictPemodalPerusahaan(null);
                setSelectedSubDistrictPemodalPerusahaan(null);
                setPosCode("");
              }}
              placeholder="Pilih Provinsi"
            />

            {errors?.provincePemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.provincePemodalPerusahaan[0]}
              </p>
            )}
          </div>
          <div className="text-black">
            <Select
              instanceId="city-pemodal-perusahaan"
              className="mt-0"
              value={selectedCityPemodalPerusahaan || null}
              options={customOptionsCity}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedCityPemodalPerusahaan(e);
                setSelectedDistrictPemodalPerusahaan(null);
                setSelectedSubDistrictPemodalPerusahaan(null);
                setPosCode("");
              }}
              placeholder="Pilih Kota"
              isDisabled={!selectedProvincePemodalPerusahaan}
            />
            {errors?.cityPemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cityPemodalPerusahaan[0]}
              </p>
            )}
          </div>
          <div className="text-black">
            <Select
              instanceId="district-pemodal-perusahaan"
              className="mt-0"
              value={selectedDistrictPemodalPerusahaan || null}
              options={customOptionsDistrict}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedDistrictPemodalPerusahaan(e);
                setSelectedSubDistrictPemodalPerusahaan(null);
                setPosCode("");
              }}
              placeholder="Pilih Kecamatan"
              isDisabled={!selectedCityPemodalPerusahaan}
            />
            {errors?.districtPemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.districtPemodalPerusahaan[0]}
              </p>
            )}
          </div>
          <div className="text-black">
            <Select
              instanceId="sub-district-pemodal-perusahaan"
              className="mt-0"
              value={selectedSubDistrictPemodalPerusahaan || null}
              options={customOptionsSubDistrict}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedSubDistrictPemodalPerusahaan(e);
                setPosCode("");
              }}
              placeholder="Pilih Kelurahan"
              isDisabled={!selectedDistrictPemodalPerusahaan}
            />
            {errors?.subDistrictPemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subDistrictPemodalPerusahaan[0]}
              </p>
            )}
          </div>
        </div>
        <div>
          <input
            type="number"
            name="posCode"
            placeholder="Kode Pos"
            value={formData.posCode || ""}
            onChange={onChange}
            className="border rounded p-2 w-full placeholder:text-sm text-black"
          />
          {errors?.posCode && (
            <p className="text-red-500 text-sm mt-1">{errors.posCode[0]}</p>
          )}
        </div>
        <div>
          <textarea
            id="address"
            name="addres"
            value={formData.addres}
            onChange={onChange}
            placeholder="Alamat Sesuai Tempat Usaha"
            className="border p-2 w-full rounded resize-none placeholder:text-sm text-black"
            rows={4}
          ></textarea>
          {errors?.addres && (
            <p className="text-red-500 text-sm mt-1">{errors.addres[0]}</p>
          )}
        </div>
      </div>

      {/* KANAN */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-black mt-2 mb-2">
            10. Nomor Telepon Perusahaan <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            name="noTeleponPerusahaan"
            value={formData.noTeleponPerusahaan}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              onChange({
                target: { name: "noTeleponPerusahaan", value: onlyNums },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            placeholder="Masukkan Nomor Telepon Perusahaan"
            className="border p-2 w-full rounded mb-0 text-gray-700"
          />
          {errors?.noTeleponPerusahaan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.noTeleponPerusahaan[0]}
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            11. Situs Perusahaan <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            name="situsPerusahaan"
            value={formData.situsPerusahaan}
            onChange={onChange}
            placeholder="Masukkan Situs Perusahaan"
            className="border p-2 w-full rounded mb-0 text-gray-700"
          />
          {errors?.situsPerusahaan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.situsPerusahaan[0]}
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-black mt-4 mb-2">
            12. Email Perusahaan <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            name="emailPerusahaan"
            value={formData.emailPerusahaan}
            onChange={onChange}
            placeholder="Masukkan Email Perusahaan"
            className="border p-2 w-full rounded mb-0 text-gray-700"
          />
          {errors?.emailPerusahaan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.emailPerusahaan[0]}
            </p>
          )}
        </div>

        <h3 className="font-semibold text-black">
          13. Informasi Rekening Bank <span className="text-red-500">*</span>
        </h3>

        <div>
          <label className="text-sm font-medium text-black">
            Nama Bank <span className="text-red-500">*</span>
          </label>

          <Select
            instanceId="bank"
            className="mt-0"
            value={selectedBank || null}
            options={customOptionsBank}
            formatOptionLabel={formatOptionLabel}
            onChange={(e) => {
              setSelectedBank(e);
            }}
            placeholder="Pilih Nama Bank"
            isClearable
          />
          {errors?.namaBank && (
            <p className="text-red-500 text-sm mt-1">{errors.namaBank[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 text-black">
            Nomor Rekening <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="nomorRekening"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Masukkan Nomor Rekening"
            value={formData.nomorRekening}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              onChange({
                target: { name: "nomorRekening", value: onlyNums },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="border rounded p-2 w-full mt-1 placeholder:text-sm"
          />

          {errors?.nomorRekening && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorRekening[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 text-black">
            Nama Rekening Perusahaan <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="namaPemilik"
            placeholder="Masukkan Nama Rekening Perusahaan"
            value={formData.namaPemilik}
            onChange={onChange}
            className="border rounded p-2 w-full mt-1 placeholder:text-sm"
          />

          {errors?.namaPemilik && (
            <p className="text-red-500 text-sm mt-1">{errors.namaPemilik[0]}</p>
          )}
        </div>

        <h3 className="font-semibold text-black mt-2 md-2">
          14. Rekening Efek (opsional)
        </h3>

        <div>
          <label className="text-sm font-medium mb-2">Nama Bank</label>

          <Select
            instanceId="bank-efek"
            className="mt-0"
            value={selectedBankEfek || null}
            options={customOptionsBankEfek}
            formatOptionLabel={formatOptionLabel}
            onChange={(e) => {
              setSelectedBankEfek(e);
            }}
            placeholder="Pilih Nama Bank Efek"
            isClearable
          />
          {errors?.namaBank_efek && (
            <p className="text-red-500 text-sm mt-1">
              {errors.namaBank_efek[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">Nomor Rekening</label>
          <input
            type="text"
            name="nomorRekening_efek"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Masukkan Nomor Rekening"
            value={formData.nomorRekening_efek}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              onChange({
                target: { name: "nomorRekening_efek", value: onlyNums },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm"
          />
          {errors?.nomorRekening_efek && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorRekening_efek[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            name="namaPemilik_efek"
            placeholder="Masukkan Nama Pemilik Rekening"
            value={formData.namaPemilik_efek}
            onChange={onChange}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm"
          />
          {errors?.namaPemilik_efek && (
            <p className="text-red-500 text-sm mt-1">
              {errors.namaPemilik_efek[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 mt-2">
            Pernyataan Kebenaran Data Perusahaan
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Dengan ini kami menyatakan bahwa seluruh data dan dokumen yang
            diberikan terkait perusahaan adalah benar, akurat, dan sesuai dengan
            kondisi saat ini. Pihak perusahaan bertanggung jawab penuh atas data
            yang diinput serta memahami bahwa ketidaksesuaian informasi dapat
            berdampak pada proses investasi.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="setujuKebenaranData"
              checked={formData.setujuKebenaranData}
              onChange={onCheckboxChange}
              className="form-checkbox text-[#4821C2]"
            />
            <span className="text-sm font-medium text-gray-700">
              Ya, perusahaan setuju
            </span>
          </label>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Pernyataan Pemahaman Risiko Investasi
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Kami memahami bahwa setiap investasi mengandung risiko, termasuk
            kemungkinan kehilangan sebagian atau seluruh dana yang
            diinvestasikan oleh perusahaan.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="setujuRisikoInvestasi"
              checked={formData.setujuRisikoInvestasi}
              onChange={onCheckboxChange}
              className="form-checkbox text-[#4821C2]"
            />
            <span className="text-sm font-medium text-gray-700">
              Ya, perusahaan setuju
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ComponentDataPemodalPerusahaanV1;
