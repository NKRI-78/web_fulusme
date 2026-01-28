"use client";

import React, { useEffect, useRef, useState } from "react";

import Cookies from "js-cookie";
import Flatpickr from "react-flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import "flatpickr/dist/flatpickr.min.css";
import TextField from "../inputFormPenerbit/_component/TextField";
import DropdownSelect from "../inputFormPenerbit/_component/DropdownSelect";
import CustomCheckBox from "../inputFormPenerbit/_component/CustomCheckBox";
import PhotoUploaderContainer from "../inputFormPenerbit/_component/PhotoUploaderContainer";
import FileInput from "../inputFormPenerbit/_component/FileInput";
import SectionPoint from "../inputFormPenerbit/_component/SectionPoint";
import Subtitle from "../inputFormPenerbit/_component/SectionSubtitle";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  CreateProjectFormSchema,
  createProjectPenerbitSchema,
  defaultValues,
  ProjectTypeInterface,
} from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyField from "../inputFormPenerbit/_component/CurrencyField";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { fetchProvinces } from "@/app/lib/fetchWilayah";

type OptionType = { value: string; label: string; zip_code: string };
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import FormButton from "../inputFormPenerbit/_component/FormButton";
import MonthSelection from "../inputFormPenerbit/_component/MonthSelection";
import GoogleMapPicker from "./GoogleMapsPicker";
import FormAlamat from "./FormAlamat";

const getUserToken = (): string => {
  const userCookie = Cookies.get("user");
  if (!userCookie) throw "User tidak ditemukan";
  return JSON.parse(userCookie).token;
};

const FORM_CACHE_KEY = "createProjectPenerbitCache";

function formatDateToCustom(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0

  return `${year}-${month}-${day}`;
}

const CreateProjectPenerbit: React.FC = () => {
  const router = useRouter();

  const [jenisProyek, setJenisProyek] = useState<ProjectTypeInterface[]>([]);
  const [jenisInstansiPemberiProyek, setJenisInstansiPemberiProyek] = useState<
    ProjectTypeInterface[]
  >([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const skipCacheWrite = useRef(false);

  //* form state
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectPenerbitSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  //* init state
  useEffect(() => {
    fetchJenisProyek();
    fetchJenisInstansiPemberiProyek();
    fetchCompanyId();
  }, []);

  //* read cache
  useEffect(() => {
    const formCache = localStorage.getItem(FORM_CACHE_KEY);
    if (formCache) {
      try {
        const parsedCache: CreateProjectFormSchema = JSON.parse(formCache);

        reset({
          ...defaultValues,
          ...parsedCache,
        });
      } catch (err) {
        console.error("Cache tidak valid:", err);
      }
    }
  }, [reset]);

  //* write cache
  useEffect(() => {
    const subscription = watch((values) => {
      if (!skipCacheWrite.current) {
        localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(values));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const [provinsiList, setProvinsiList] = useState<OptionType[]>([]);
  const [kotaList, setKotaList] = useState<Record<number, OptionType[]>>({});
  const [kecamatanList, setKecamatanList] = useState<
    Record<number, OptionType[]>
  >({});
  const [kelurahanList, setKelurahanList] = useState<
    Record<number, OptionType[]>
  >({});

  useEffect(() => {
    const loadProvinces = async () => {
      const provinsiList = await fetchProvinces();
      setProvinsiList(provinsiList);
    };
    loadProvinces();
  }, []);

  const fetchOptions = async (url: string, parentId?: string) => {
    try {
      const response = await axios.get(
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

  //* on submit
  const onSubmit: SubmitHandler<CreateProjectFormSchema> = async (data) => {
    const penyedia = data.address[0]; // alamat penyedia
    setLoading(true);

    try {
      if (!companyId) throw "ID Perusahaan tidak terdaftar";

      const payload = {
        company_id: companyId,
        title: data.namaProyek,
        deskripsi: data.deskripsiProyek,
        dana_yang_dibutuhkan: data.danaYangDibutuhkan,
        modal: String(data.modalProyek),
        persentase_keuntungan: String(data.persentaseKeuntungan),
        spk: data.fileSPK,
        loa: data.laporanKeuangan,
        jenis_project: String(
          jenisProyek.find((type) => type.name === data.jenisProyek)?.id ?? 1,
        ),
        batas_akhir_pengerjaan: formatDateToCustom(data.tanggalSelesaiProyek),
        tenor_pinjaman: data.tenor,
        website: data.websiteInstansiProyek,
        doc_rekening_koran: data.rekeningKoran,
        doc_laporan_keuangan: data.laporanKeuangan,
        doc_contract: data.dokumenKontrak,
        doc_prospect: data.prospektus,
        instansi_pemberi_project: data.instansiProyek,
        jenis_instansi_pemberi_project: String(
          jenisInstansiPemberiProyek.find(
            (type) => type.name === data.jenisInstansiProyek,
          )?.id ?? 1,
        ),
        jaminan_kolateral: data.jaminanKolateral.map((value) => ({
          name: value,
        })),
        media: data.fotoProyek.map((value) => ({ path: value })),
        mulai_project: formatDateToCustom(data.tanggalMulaiProyek),
        selesai_project: formatDateToCustom(data.tanggalSelesaiProyek),
        alamat_penyedia_project: penyedia.detail,
        alamat_penyedia_provinsi: penyedia.province_name,
        alamat_penyedia_kota: penyedia.city_name,
        alamat_penyedia_daerah: penyedia.district_name,
        alamat_penyedia_wilayah: penyedia.subdistrict_name,
        alamat_penyedia_kode_pos: penyedia.postal_code,
        location: {
          name: "-",
          url: data.lokasiProyek?.url.toString(),
          lat: data.lokasiProyek?.lat.toString(),
          lng: data.lokasiProyek?.lng.toString(),
        },

        // ini ga kepake
        penggunaan_dana: [],
        is_apbn: true,
        jumlah_minimal: "-",
        jadwal_pembayaran_bunga: "-",
        jadwal_pembayaran_pokok: "-",
        tingkat_bunga: "-",
        jangka_waktu: "-",
        no_contract_path: "-",
        no_contract_value: "-",
      };

      const token = getUserToken();
      await axios.post(`${API_BACKEND}/api/v1/project/store`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        title: "Berhasil Membuat Proyek",
        text: "Proyek berhasil dibuat akan divalidasi untuk proses lebih lanjut",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      localStorage.removeItem(FORM_CACHE_KEY);
      skipCacheWrite.current = true;
      reset(defaultValues);

      console.log("FORM_CACHE_KEY dihapus = " + FORM_CACHE_KEY);

      router.back(); // back to dashboard
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Proyek",
        text: `${error}`,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJenisProyek = async () => {
    try {
      const token = getUserToken();
      const res = await axios.get(`${API_BACKEND}/api/v1/project/type/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const types = res.data["data"];
      if (types) {
        setJenisProyek(types);
      } else {
        console.log("!types " + !types);
        setJenisProyek([]);
      }
    } catch (error) {
      setJenisProyek([]);
    }
  };

  const fetchJenisInstansiPemberiProyek = async () => {
    try {
      const token = getUserToken();
      const res = await axios.get(
        `${API_BACKEND}/api/v1/project/authority/type/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const types = res.data["data"];
      if (types) {
        setJenisInstansiPemberiProyek(types);
      } else {
        console.log("!types " + !types);
        setJenisInstansiPemberiProyek([]);
      }
    } catch (error) {
      setJenisInstansiPemberiProyek([]);
    }
  };

  const fetchCompanyId = async () => {
    try {
      const token = getUserToken();
      const res = await axios.get(`${API_BACKEND}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data["data"];
      if (user) {
        const companyId = user.company.id ?? "";
        console.log("company id? " + companyId);
        setCompanyId(companyId);
      } else {
        console.log("!user " + !user);
        setCompanyId(null);
      }
    } catch (error) {
      setCompanyId(null);
    }
  };

  return (
    <div className="w-full py-28 px-6 md:px-24 bg-white">
      <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* left section */}
        <div className="w-full space-y-4">
          <Controller
            name="namaProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Nama proyek"
                  placeholder="Nama Proyek"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.namaProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="fotoProyek"
            control={control}
            render={({ field }) => {
              return (
                <PhotoUploaderContainer
                  label="Foto Proyek"
                  photoPaths={field.value}
                  fileOnChange={(urls) => {
                    field.onChange(urls);
                  }}
                  errorText={errors.fotoProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="deskripsiProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Deskripsi Proyek"
                  placeholder="Deskripsi Proyek"
                  type="textarea"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.deskripsiProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="jenisProyek"
            control={control}
            render={({ field }) => {
              return (
                <DropdownSelect
                  label="Jenis Proyek"
                  value={field.value}
                  options={jenisProyek.map((type) => {
                    return {
                      label: type.name,
                      value: type.name,
                    };
                  })}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  errorText={errors.jenisProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="tenor"
            control={control}
            render={({ field }) => {
              return (
                <MonthSelection
                  label="Tenor Pinjaman"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  selected={field.value}
                />
              );
            }}
          />

          <div className="w-full flex gap-x-4 mt-2">
            <div className="w-full">
              <SectionPoint text="Tanggal Mulai Proyek" className="mb-1" />
              <Controller
                name="tanggalMulaiProyek"
                control={control}
                render={({ field }) => {
                  return (
                    <Flatpickr
                      placeholder="Pilih tanggal mulai proyek"
                      value={new Date(field.value) ?? ""}
                      options={{
                        dateFormat: "j F Y",
                        allowInput: false,
                        locale: Indonesian,
                      }}
                      className="border p-2 w-full rounded placeholder:text-sm focus:border-gray-400"
                      onChange={(dates) => {
                        const selected = dates[0] ? dates[0].toISOString() : "";
                        field.onChange(selected);
                      }}
                    />
                  );
                }}
              />
              {errors.tanggalMulaiProyek && (
                <p className="text-red-500 text-xs my-1">
                  {errors.tanggalMulaiProyek?.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <SectionPoint text="Tanggal Selesai Proyek" className="mb-1" />
              <Controller
                name="tanggalSelesaiProyek"
                control={control}
                render={({ field }) => {
                  return (
                    <Flatpickr
                      placeholder="Pilih tanggal selesai proyek"
                      value={field.value ? new Date(field.value) : []}
                      options={{
                        dateFormat: "j F Y",
                        allowInput: false,
                        locale: Indonesian,
                      }}
                      className="border p-2 w-full rounded placeholder:text-sm focus:border-gray-400"
                      onChange={(dates) => {
                        const selected = dates[0] ? dates[0].toISOString() : "";
                        field.onChange(selected);
                      }}
                    />
                  );
                }}
              />
              {errors.tanggalSelesaiProyek && (
                <p className="text-red-500 text-xs my-1">
                  {errors.tanggalSelesaiProyek?.message}
                </p>
              )}
            </div>
          </div>

          <Controller
            name="jaminanKolateral"
            control={control}
            render={({ field }) => {
              return (
                <CustomCheckBox
                  label="Jaminan Kolateral"
                  options={[
                    "Tanah Bangunan",
                    "Kendaraan Bermotor",
                    "Rumah",
                    "Surat Berharga",
                  ]}
                  selected={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                  errorText={errors.jaminanKolateral?.message}
                />
              );
            }}
          />

          <div className="w-full flex gap-x-4">
            <Controller
              name="persentaseKeuntungan"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    label="Persentase Keuntungan"
                    placeholder="Minimal 10%"
                    type="number"
                    value={`${field.value === 0 ? "" : field.value}`}
                    className="w-full"
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                    onBlur={() => {
                      if (field.value) {
                        let val = field.value;
                        if (val < 10) val = 10;
                        if (val > 100) val = 100;
                        field.onChange(val);
                      }
                    }}
                    errorText={errors.persentaseKeuntungan?.message}
                    suffix={<p>%</p>}
                  />
                );
              }}
            />

            <Controller
              name="danaYangDibutuhkan"
              control={control}
              render={({ field }) => {
                return (
                  <CurrencyField
                    label="Dana yang Dibutuhkan"
                    placeholder="Rp."
                    value={`${field.value === 0 ? "" : field.value}`}
                    className="w-full"
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const numericValue = Number(rawValue);
                      field.onChange(numericValue);
                    }}
                    errorText={errors.danaYangDibutuhkan?.message}
                  />
                );
              }}
            />
          </div>

          <Controller
            name="modalProyek"
            control={control}
            render={({ field }) => {
              return (
                <CurrencyField
                  label="Modal Proyek   "
                  placeholder="Rp."
                  value={`${field.value === 0 ? "" : field.value}`}
                  className="w-full"
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = Number(rawValue);
                    field.onChange(numericValue);
                  }}
                  errorText={errors.modalProyek?.message}
                />
              );
            }}
          />
        </div>

        {/* right section */}
        <div className="w-full space-y-4">
          <Controller
            name="instansiProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Instansi Pemberi Proyek"
                  placeholder="Instansi Pemberi Proyek"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.instansiProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="jenisInstansiProyek"
            control={control}
            render={({ field }) => {
              return (
                <DropdownSelect
                  label="Jenis Instansi Pemberi Proyek"
                  value={field.value}
                  options={jenisInstansiPemberiProyek.map((type) => {
                    return {
                      label: type.name,
                      value: type.name,
                    };
                  })}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  errorText={errors.jenisInstansiProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="websiteInstansiProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Website Pemberi Proyek"
                  placeholder="Website Pemberi Proyek"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.websiteInstansiProyek?.message}
                />
              );
            }}
          />

          <FormAlamat
            index={0}
            control={control}
            setValue={setValue}
            watch={watch}
            register={register}
            errors={errors}
            provinsiList={provinsiList}
            kotaList={kotaList}
            setKotaList={setKotaList}
            kecamatanList={kecamatanList}
            setKecamatanList={setKecamatanList}
            kelurahanList={kelurahanList}
            setKelurahanList={setKelurahanList}
            fetchOptions={fetchOptions}
          />

          <div className="w-full flex gap-x-4">
            <div>
              <SectionPoint text="File SPK" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="fileSPK"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileUrl={field.value}
                      accept=".pdf,.word"
                      fileName="File SPK"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.fileSPK?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="File LOA" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="fileLOA"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileName="File LOA"
                      accept=".pdf,.word"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.fileLOA?.message}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-4">
            <div>
              <SectionPoint text="Dokumen Kontrak" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="dokumenKontrak"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Dokumen Kontrak"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.dokumenKontrak?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="Rekening Koran" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="rekeningKoran"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Rekening Koran"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.rekeningKoran?.message}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-4">
            <div>
              <SectionPoint text="Laporan Keuangan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="laporanKeuangan"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Laporan Keuangan"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.laporanKeuangan?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="Prospektus" optional />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="prospektus"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Prospektus"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.prospektus?.message}
                    />
                  );
                }}
              />
            </div>
          </div>

          <Controller
            name="lokasiProyek"
            control={control}
            render={({ field }) => {
              return (
                <GoogleMapPicker
                  className="w-full h-[210px] border border-gray-500"
                  cacheMap={field.value}
                  onAddressChange={(data) => {
                    console.log("lokasi dipilih ");
                    console.log(data);
                    field.onChange(data);
                  }}
                  errorText={errors.lokasiProyek?.message}
                />
              );
            }}
          />

          <div className="w-full flex justify-end mt-8">
            <FormButton
              disabled={loading}
              onClick={handleSubmit(onSubmit, (errors) => {
                console.error("VALIDATION ERRORS:", errors);
              })}
            >
              {loading ? "Membuat Project" : "Submit"}
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPenerbit;
