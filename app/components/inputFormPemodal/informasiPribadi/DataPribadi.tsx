"use client";
// ComponentDataPribadi.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";
import { compressImage } from "@/app/helper/CompressorImage";
import UpdateRing from "../component/UpdateRing";
import ContainerSelfie from "../component/ContainerSelfie";
import { uploadMediaService } from "@/app/helper/mediaService";
import FileInput from "../../inputFormPenerbit/_component/FileInput";

interface Props {
  formData: {
    nama: string;
    nik: string;
    npwp: string;
    noNpwpFormatted?: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    statusPernikahan: string;
    pendidikanTerakhir: string;
    pekerjaan: string;
    pekerjaanLainnya: string;
    addres: string;
    namaBank: { value: string; label: string };
    nomorRekening: string;
    namaPemilik: string;
    cabangBank: string;
    ktpUrl: string;
    rekeningKoran: string;
    provincePribadi: { value: string; label: string };
    cityPribadi: { value: string; label: string };
    districtPribadi: { value: string; label: string };
    subDistrictPribadi: { value: string; label: string };
    posCode: string;
    nama_ahli_waris: string;
    phone_ahli_waris: string;
    fotoPemodalUrlPribadi: string;
  };
  onLihatKTP?: () => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onGenderChange: (value: string) => void;
  onWeddingChange: (value: string) => void;
  onEducationChange: (value: string) => void;
  onPekerjaanChange: (value: string) => void;
  onUploadKTP: (url: string, keyName: string) => void;
  onAlamatChange: (alamat: {
    provincePribadi: { value: string; label: string } | null;
    cityPribadi: { value: string; label: string } | null;
    districtPribadi: { value: string; label: string } | null;
    subDistrictPribadi: { value: string; label: string } | null;
    posCode: string;
  }) => void;
  errors?: Record<string, string[]>;
  onBankChange: (bank: { value: string; label: string } | null) => void;
  dataProfile: {
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
        annual_income: string;
        npwp_path: string;
        position: string;
        npwp: string;
      };
    };
    form: string;
  };
  isUpdate: boolean;
  onUploadSelfie: (url: string) => void;
}

const ComponentDataPribadi: React.FC<Props> = ({
  formData,
  onChange,
  onGenderChange,
  onWeddingChange,
  onEducationChange,
  onPekerjaanChange,
  onUploadKTP,
  onAlamatChange,
  errors,
  onBankChange,
  onLihatKTP,
  dataProfile,
  isUpdate,
  onUploadSelfie,
}) => {
  type OptionValue = {
    value: string;
    label: string;
  };

  type OptionType = OptionValue | null;

  const optionsGender = ["Laki-Laki", "Perempuan"];
  const optionsPernikahan = ["Belum Menikah", "Menikah", "Cerai"];
  const optionsLastEducation = [
    "SD",
    "SMP",
    "SMA",
    "Diploma",
    "Sarjana",
    "Pascasarjana",
  ];
  const pekerjaanOptions = ["PNS", "Swasta", "Wiraswasta", "Lainnya"];

  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {},
  );

  const [syncNamaToPemilik, setSyncNamaToPemilik] = useState(true);
  const [province, setProvince] = useState<any>([]);
  const [selectedProvincePribadi, setSelectedProvincePribadi] =
    useState<OptionType | null>(null);
  const [city, setCity] = useState<any>([]);
  const [selectedCityPribadi, setSelectedCityPribadi] =
    useState<OptionType>(null);

  const [district, setDistrict] = useState<any>([]);
  const [selectedDistrictPribadi, setSelectedDistrictPribadi] =
    useState<OptionType>(null);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [selectedSubDistrictPribadi, setSelectedSubDistrictPribadi] =
    useState<OptionType>(null);
  const [posCode, setPosCode] = useState("");

  const [bank, setBank] = useState<any[]>([]);

  const [selectedBank, setSelectedBank] = useState<OptionType>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const urlWilayah = "https://api.wilayah.site";

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 17,
    today.getMonth(),
    today.getDate(),
  );

  const handleFotoChange = async (file: File, keyName: string) => {
    if (!file || !keyName) return;

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        title: "Warning",
        text: `Ukuran image maksimal 10MB!`,
        icon: "warning",
        timer: 3000,
        timerProgressBar: true,
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

      onUploadSelfie(fileUrl);

      if (fileUrl) {
        onUploadKTP(fileUrl, keyName ?? "");
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
      }
    } catch {
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

  const formatNpwp = (rawValue: string) => {
    let formattedValue = rawValue;

    if (rawValue.length > 2) {
      formattedValue = rawValue.slice(0, 2) + "." + rawValue.slice(2);
    }
    if (rawValue.length > 5) {
      formattedValue =
        formattedValue.slice(0, 6) + "." + formattedValue.slice(6);
    }
    if (rawValue.length > 8) {
      formattedValue =
        formattedValue.slice(0, 10) + "." + formattedValue.slice(10);
    }
    if (rawValue.length > 9) {
      formattedValue =
        formattedValue.slice(0, 12) + "-" + formattedValue.slice(12);
    }
    if (rawValue.length > 12) {
      formattedValue =
        formattedValue.slice(0, 16) + "." + formattedValue.slice(16);
    }

    return formattedValue;
  };

  useEffect(() => {
    if (!dataProfile || !isUpdate) return;

    if (dataProfile?.investor?.job?.npwp) {
      const rawNpwp = dataProfile.investor.job.npwp;
      onChange({
        target: {
          name: "npwp",
          value: rawNpwp,
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "noNpwpFormatted",
          value: formatNpwp(rawNpwp),
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    if (dataProfile.avatar) {
      onChange({
        target: {
          name: "fotoPemodalUrlPribadi",
          value: dataProfile.avatar,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    if (dataProfile.nama_ahli_waris) {
      onChange({
        target: {
          name: "nama_ahli_waris",
          value: dataProfile.nama_ahli_waris,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    if (dataProfile.phone_ahli_waris) {
      onChange({
        target: {
          name: "phone_ahli_waris",
          value: dataProfile.phone_ahli_waris,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [dataProfile, isUpdate]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/province`);
        setProvince(response.data.data);
      } catch {}
    };

    fetchProvince();
  }, []);

  useEffect(() => {
    if (!selectedProvincePribadi) return;
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/city`, {
          params: {
            code: selectedProvincePribadi?.value,
          },
        });
        setCity(response.data.data);
      } catch {}
    };

    fetchCity();
  }, [selectedProvincePribadi]);

  useEffect(() => {
    if (!selectedCityPribadi) return;
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/district`, {
          params: {
            code: selectedCityPribadi?.value,
          },
        });
        setDistrict(response.data.data);
      } catch {}
    };

    fetchDistrict();
  }, [selectedCityPribadi]);

  useEffect(() => {
    if (!selectedDistrictPribadi) return;
    const fetchSubDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/subdistrict`, {
          params: {
            code: selectedDistrictPribadi?.value,
          },
        });
        setSubDistrict(response.data.data);
      } catch {}
    };

    fetchSubDistrict();
  }, [selectedDistrictPribadi]);

  useEffect(() => {
    if (!selectedSubDistrictPribadi) return;

    const fetchPosCode = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/postalcode`, {
          params: {
            code: selectedSubDistrictPribadi?.value,
          },
        });
        setPosCode(response?.data?.data?.postal_code || "");
      } catch {}
    };

    fetchPosCode();
  }, [selectedSubDistrictPribadi]);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const response = await axios.get(
          `https://api.gateway.langitdigital78.com/v1/bank`,
        );
        setBank(response.data.data.beneficiary_banks);
      } catch {}
    };

    fetchBank();
  }, []);

  useEffect(() => {
    if (
      selectedProvincePribadi &&
      selectedCityPribadi &&
      selectedDistrictPribadi &&
      selectedSubDistrictPribadi &&
      posCode
    ) {
      onAlamatChange({
        provincePribadi: selectedProvincePribadi,
        cityPribadi: selectedCityPribadi,
        districtPribadi: selectedDistrictPribadi,
        subDistrictPribadi: selectedSubDistrictPribadi,
        posCode: posCode,
      });
    }
  }, [
    selectedProvincePribadi,
    selectedCityPribadi,
    selectedDistrictPribadi,
    selectedSubDistrictPribadi,
    posCode,
  ]);

  useEffect(() => {
    onBankChange(selectedBank);
  }, [selectedBank]);

  useEffect(() => {
    if (!Object.keys(formData).length) return;
    if (formData.provincePribadi)
      setSelectedProvincePribadi(formData.provincePribadi);
    if (formData.cityPribadi) setSelectedCityPribadi(formData.cityPribadi);
    if (formData.districtPribadi)
      setSelectedDistrictPribadi(formData.districtPribadi);
    if (formData.subDistrictPribadi)
      setSelectedSubDistrictPribadi(formData.subDistrictPribadi);
    if (formData.namaBank) setSelectedBank(formData.namaBank);
    if (formData?.posCode) {
      setPosCode(formData.posCode);
    }
  }, [formData]);

  const customOptions: OptionValue[] = province.map(
    (province: { code: any; nama: any }) => ({
      value: province.code,
      label: province.nama,
    }),
  );

  const customOptionsCity = city?.map(
    (city: { code: string; nama: string }) => ({
      value: city.code,
      label: city.nama,
    }),
  );

  const customOptionsDistrict = district?.map(
    (district: { code: string; nama: string }) => ({
      value: district.code,
      label: district.nama,
    }),
  );

  const customOptionsSubDistrict = subDistrict?.map(
    (subDistrict: { code: string; nama: string }) => ({
      value: subDistrict.code,
      label: subDistrict.nama,
    }),
  );

  const customOptionsBank = useMemo(() => {
    return bank.map((b) => ({
      value: b.code,
      label: b.name,
    }));
  }, [bank]);

  useEffect(() => {
    if (
      !dataProfile?.investor.bank?.bank_name ||
      customOptionsBank.length === 0 ||
      !isUpdate
    )
      return;

    const foundBank = customOptionsBank.find(
      (opt) => opt.label === dataProfile.investor.bank.bank_name,
    );

    if (foundBank) {
      setSelectedBank(foundBank);
    }
  }, [customOptionsBank, dataProfile?.investor.bank?.bank_name]);

  const formatOptionLabel = ({ label, icon }: any) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
    </div>
  );

  const tanggalLahirDate = useMemo(() => {
    return formData.tanggalLahir ? new Date(formData.tanggalLahir) : [];
  }, [formData.tanggalLahir]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 p-6 max-w-6xl mx-auto">
      <div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Isi Data Sebagai Pemodal</h2>
          <p className="text-sm text-gray-600">
            Untuk memastikan kelancaran proses verifikasi dan layanan yang
            optimal, kami mengajak Anda untuk melengkapi seluruh data secara
            jujur, benar, dan akurat.
          </p>

          <h3 className="font-semibold text-black">1. Informasi Pribadi</h3>

          {/* <div className="h-80">
          </div> */}
          <ContainerSelfie
            defaultPhoto={formData.fotoPemodalUrlPribadi}
            disabled={isUpdate}
            photoResult={(file) => {
              if (file) {
                handleFotoChange(file, "fotoPemodalUrl");
              }
            }}
            errorText={errors?.fotoPemodalUrlPribadi?.[0]}
          />

          <div>
            <label className="text-sm font-medium mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={dataProfile.fullname}
              disabled={syncNamaToPemilik}
              onChange={(e) => {
                onChange(e);

                if (syncNamaToPemilik) {
                  onChange({
                    target: {
                      name: "namaPemilik",
                      value: e.target.value,
                    },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              placeholder="Nama"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm disabled:bg-gray-100"
            />

            {errors?.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama[0]}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2">
              NIK KTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nik"
              disabled={isUpdate}
              value={formData.nik}
              onChange={onChange}
              placeholder="NIK KTP"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm"
            />
            {errors?.nik && (
              <p className="text-red-500 text-sm mt-1">{errors.nik[0]}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2">
              Nomor NPWP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="npwp"
              disabled={isUpdate}
              value={formData.npwp || ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                let formattedValue = rawValue;

                if (rawValue.length > 2) {
                  formattedValue =
                    rawValue.slice(0, 2) + "." + rawValue.slice(2);
                }
                if (rawValue.length > 5) {
                  formattedValue =
                    formattedValue.slice(0, 6) + "." + formattedValue.slice(6);
                }
                if (rawValue.length > 8) {
                  formattedValue =
                    formattedValue.slice(0, 10) +
                    "." +
                    formattedValue.slice(10);
                }
                if (rawValue.length > 9) {
                  formattedValue =
                    formattedValue.slice(0, 12) +
                    "-" +
                    formattedValue.slice(12);
                }
                if (rawValue.length > 12) {
                  formattedValue =
                    formattedValue.slice(0, 16) +
                    "." +
                    formattedValue.slice(16);
                }

                onChange({
                  target: {
                    name: "npwp",
                    value: rawValue,
                  },
                } as React.ChangeEvent<HTMLInputElement>);

                onChange({
                  target: {
                    name: "noNpwpFormatted",
                    value: formattedValue,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              maxLength={20}
              placeholder="Nomor NPWP"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm"
            />
            {errors?.npwp && (
              <p className="text-red-500 text-sm mt-1">{errors.npwp[0]}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div>
              <label className="text-sm font-medium mb-2">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={isUpdate}
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={onChange}
                placeholder="Tempat Lahir"
                className="border p-2 w-full rounded mb-4 placeholder:text-sm"
              />
              {errors?.tempatLahir && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tempatLahir[0]}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <Flatpickr
                disabled={isUpdate}
                options={{
                  dateFormat: "d-m-Y",
                  maxDate: maxDate,
                }}
                value={tanggalLahirDate}
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  if (selectedDate) {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(
                      2,
                      "0",
                    );
                    const day = String(selectedDate.getDate()).padStart(2, "0");

                    const formatted = `${year}-${month}-${day}`;

                    onChange({
                      target: {
                        name: "tanggalLahir",
                        value: formatted,
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                placeholder="Tanggal Lahir"
                className="border p-2 w-full rounded mb-4 placeholder:text-sm"
              />
              {errors?.tanggalLahir && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tanggalLahir[0]}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-md mb-2">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {optionsGender.map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <input
                  type="radio"
                  name="jenisKelamin"
                  value={gender}
                  disabled={isUpdate}
                  checked={formData.jenisKelamin === gender}
                  onChange={() => onGenderChange(gender)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
          {errors?.jenisKelamin && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jenisKelamin[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-md mb-2">
            Status Pernikahan <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {optionsPernikahan.map((wedding) => (
              <label
                key={wedding}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="statusPernikahan"
                  value={wedding}
                  disabled={isUpdate}
                  checked={formData.statusPernikahan === wedding}
                  onChange={() => onWeddingChange(wedding)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{wedding}</span>
              </label>
            ))}
          </div>
          {errors?.statusPernikahan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.statusPernikahan[0]}
            </p>
          )}
        </div>
      </div>

      {/* form bagian kanan */}
      <div>
        <div className="mb-4">
          <label className="text-sm font-medium mb-2">
            Upload KTP <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            File maksimal berukuran 10mb
          </p>

          <UpdateRing
            identity={`${dataProfile?.form}`}
            formKey="upload-ktp-pic"
          >
            <FileInput
              fileName="KTP"
              accept=".pdf,.jpg,.png"
              fileUrl={formData.ktpUrl}
              onChange={(fileUrl) => {
                onUploadKTP(fileUrl, "ktpUrl");
              }}
              errorText={errors?.ktpUrl?.[0] ?? ""}
            />
          </UpdateRing>
        </div>

        <div className="mb-4">
          <label className="text-md mb-2">
            Pendidikan Terakhir <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-y-2 gap-x-4">
            {optionsLastEducation.map((education) => (
              <label
                key={education}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pendidikanTerakhir"
                  disabled={isUpdate}
                  value={education}
                  checked={formData.pendidikanTerakhir === education}
                  onChange={() => onEducationChange(education)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{education}</span>
              </label>
            ))}
          </div>
          {errors?.pendidikanTerakhir && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pendidikanTerakhir[0]}
            </p>
          )}
        </div>

        <div className="mb-4 mt-2">
          <label className="text-md mb-2">
            Pekerjaan <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {pekerjaanOptions.map((option) => (
              <label
                key={option}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pekerjaan"
                  value={option}
                  disabled={isUpdate}
                  checked={formData.pekerjaan === option}
                  onChange={() => onPekerjaanChange(option)}
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          {formData.pekerjaan === "Lainnya" && (
            <input
              type="text"
              name="pekerjaanLainnya"
              disabled={isUpdate}
              value={formData.pekerjaanLainnya}
              onChange={onChange}
              placeholder="Lainnya"
              className="mt-3 border p-2 w-full rounded text-sm"
            />
          )}

          {errors?.pekerjaan && (
            <p className="text-red-500 text-sm mt-1">{errors.pekerjaan[0]}</p>
          )}
          {formData.pekerjaan === "Lainnya" && errors?.pekerjaanLainnya && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pekerjaanLainnya[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="text-sm font-medium mb-2 mt-2">
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
            <div>
              <Select
                className="mt-0"
                value={selectedProvincePribadi}
                options={customOptions}
                formatOptionLabel={formatOptionLabel}
                isDisabled={isUpdate}
                onChange={(e) => {
                  setSelectedProvincePribadi(e);
                  setSelectedCityPribadi(null);
                  setSelectedDistrictPribadi(null);
                  setSelectedSubDistrictPribadi(null);
                  setPosCode("");
                }}
                placeholder="Pilih Provinsi"
              />

              {errors?.provincePribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.provincePribadi[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedCityPribadi}
                options={customOptionsCity}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedCityPribadi(e);
                  setSelectedDistrictPribadi(null);
                  setSelectedSubDistrictPribadi(null);
                  setPosCode("");
                }}
                placeholder="Pilih Kota"
                isDisabled={!selectedProvincePribadi || isUpdate}
              />
              {errors?.cityPribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cityPribadi[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedDistrictPribadi}
                options={customOptionsDistrict}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedDistrictPribadi(e);
                  setSelectedSubDistrictPribadi(null);
                  setPosCode("");
                }}
                placeholder="Pilih Kecamatan"
                isDisabled={!selectedCityPribadi || isUpdate}
              />
              {errors?.districtPribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.districtPribadi[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedSubDistrictPribadi}
                options={customOptionsSubDistrict}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedSubDistrictPribadi(e);
                  setPosCode("");
                }}
                placeholder="Pilih Kelurahan"
                isDisabled={!selectedDistrictPribadi || isUpdate}
              />
              {errors?.subDistrictPribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subDistrictPribadi[0]}
                </p>
              )}
            </div>
          </div>
          <div>
            <input
              type="number"
              name="posCode"
              placeholder="Kode Pos"
              disabled={isUpdate}
              value={posCode || formData.posCode || ""}
              onChange={onChange}
              className="border rounded p-2 w-full mb-2 placeholder:text-sm"
            />
            {errors?.posCode && (
              <p className="text-red-500 text-sm mt-1 mb-1">
                {errors.posCode[0]}
              </p>
            )}
          </div>

          <textarea
            id="address"
            name="addres"
            value={formData.addres}
            onChange={onChange}
            disabled={isUpdate}
            placeholder="Alamat sesuai KTP dan alamat domisili"
            className="border p-2 w-full rounded resize-none placeholder:text-sm"
            rows={4}
          ></textarea>
          {errors?.addres && (
            <p className="text-red-500 text-sm mt-1">{errors.addres[0]}</p>
          )}

          <div>
            <label className="text-sm font-medium mb-2">
              Nama Ahli Waris <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_ahli_waris"
              value={formData.nama_ahli_waris}
              disabled={isUpdate}
              onChange={onChange}
              placeholder="Nama ahli waris"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm"
            />
            {errors?.nama_ahli_waris && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nama_ahli_waris[0]}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2">
              Nomor Telepon Ahli Waris <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone_ahli_waris"
              value={formData.phone_ahli_waris}
              disabled={isUpdate}
              onChange={onChange}
              placeholder="Nomor telepon ahli waris"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm"
            />
            {errors?.phone_ahli_waris && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone_ahli_waris[0]}
              </p>
            )}
          </div>
        </div>
        <h2 className="font-semibold text-black">2. Informasi Rekening Bank</h2>

        <div>
          <label className="text-sm font-medium mb-2">
            Nama Bank <span className="text-red-500">*</span>
          </label>

          <Select
            className="mt-0"
            value={selectedBank || null}
            options={customOptionsBank}
            isDisabled={isUpdate}
            formatOptionLabel={formatOptionLabel}
            onChange={(e) => {
              setSelectedBank(e);
            }}
            placeholder="Pilih Nama Bank"
          />
          {errors?.namaBank && (
            <p className="text-red-500 text-sm mt-1">{errors.namaBank[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Nomor Rekening <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nomorRekening"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isUpdate}
            placeholder="Masukkan Nomor Rekening"
            value={formData.nomorRekening}
            onChange={onChange}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm"
          />
          {errors?.nomorRekening && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorRekening[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Nama Pemilik Rekening <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="namaPemilik"
            placeholder="Masukkan Nama Pemilik Rekening"
            value={dataProfile.fullname}
            onChange={onChange}
            disabled={syncNamaToPemilik}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm disabled:bg-gray-100"
          />
          {errors?.namaPemilik && (
            <p className="text-red-500 text-sm mt-1">{errors.namaPemilik[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Cabang Bank <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cabangBank"
            placeholder="Masukkan Cabang Bank"
            value={formData.cabangBank}
            disabled={isUpdate}
            onChange={onChange}
            className="border rounded p-2 w-full placeholder:text-sm"
          />
          {errors?.cabangBank && (
            <p className="text-red-500 text-sm mt-1">{errors.cabangBank[0]}</p>
          )}
        </div>

        {/* <div className="mb-4 mt-4">
          <label className="text-md mb-2">Rekening Koran</label>
          <p className="text-xs text-gray-500 mb-2">
            File maksimal berukuran 10mb
          </p>

          <input
            type="file"
            id="rekeningKoranUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadStatus["rekeningKoran"] === true}
            accept="application/pdf, image/*"
            data-keyname="rekeningKoran"
          />

          <label
            htmlFor="rekeningKoranUpload"
            className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
          >
            <>
              <FaFileAlt />
              Upload Dokumen
            </>
          </label>
        </div>
        {formData.rekeningKoran && (
          <a
            href={formData.rekeningKoran}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm block mt-2 mb-2"
          >
            Lihat Rekening Koran
          </a>
        )} */}
      </div>
    </div>
  );
};

export default ComponentDataPribadi;
