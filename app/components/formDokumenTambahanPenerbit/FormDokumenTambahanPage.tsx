"use client";

import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import PhotoUploaderContainer from "../inputFormPenerbit/_component/PhotoUploaderContainer";
import VideoUploaderContainer from "../inputFormPenerbit/_component/VideoUploadContainer";
import Subtitle from "../inputFormPemodalPerusahaan/component/SectionSubtitle";
import SectionPoint from "../inputFormPenerbit/_component/SectionPoint";
import DocumentRow from "./DocumentRow";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSection from "./FormSection";
import FormButton from "../inputFormPemodalPerusahaan/component/FormButton";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  defaultValues,
  formDokumenPelengkapPenerbitSchema,
  FormDokumenPelengkapPenerbitSchema,
} from "./form-schema";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { useRouter, useSearchParams } from "next/navigation";
import FileInput from "../inputFormPenerbit/_component/FileInput";

const getUserToken = (): string => {
  const userCookie = Cookies.get("user");
  if (!userCookie) throw "User tidak ditemukan";
  return JSON.parse(userCookie).token;
};

const FORM_CACHE_KEY = "formDokumenPelengkapPenerbitCache";

const FormDokumenTambahanPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const inboxId = searchParams.get("inboxId");

  const skipCacheWrite = useRef(false);

  //* form state
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<FormDokumenPelengkapPenerbitSchema>({
    resolver: zodResolver(formDokumenPelengkapPenerbitSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  //* read cache
  useEffect(() => {
    const formCache = localStorage.getItem(FORM_CACHE_KEY);
    if (formCache) {
      try {
        const parsedCache: FormDokumenPelengkapPenerbitSchema =
          JSON.parse(formCache);

        reset({
          ...defaultValues,
          ...parsedCache,
        });
      } catch {}
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

  //* on submit (send data)
  const onSubmit: SubmitHandler<FormDokumenPelengkapPenerbitSchema> = async (
    data,
  ) => {
    if (projectId) {
      try {
        const payload = {
          inbox_id: inboxId,
          project_id: projectId,
          skd: data.suratKeteranganDomisili,
          rab: data.rab,
          cv: data.shortCvManajemen,
          dokumen_perizinan_lainnya: data.dokumenPerizinanLainnya ?? "-",
          video_profil_perusahaan: data.videoProfilPerusahaan,
          project_summary: data.projectSummary,
          project_pendapatan: data.proyeksiPendapatan,
          timeline_pekerjaan: data.timelinePekerjaan,
          laporan_pajak_tahunan: data.laporanPajakTahunan,
          daftar_pekerjaan: data.listPekerjaan2TahunTerakhir,
          daftar_supplier: data.listDataSupplier,
          daftar_piutang: data.daftarPiutang,
          cashflow_project: data.cashflowProject,
          foto_karyawan_kantor: data.fotoKantorKaryawan.map((url) => ({
            path: url,
          })),
          foto_kegiatan_usaha: data.fotoKegiatanUsaha.map((url) => ({
            path: url,
          })),
        };

        const token = getUserToken();
        await axios.post(
          `${API_BACKEND}/api/v1/document/verify/project`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const modalResult = await Swal.fire({
          title: "Dokumen Berhasil Diupload",
          text: "Dokumen tambahan Anda telah kami terima. Mohon menunggu hingga 2x24 jam untuk mendapatkan informasi selanjutnya.",
          icon: "success",
        });

        if (
          modalResult.isDismissed ||
          modalResult.isConfirmed ||
          modalResult.isDenied
        ) {
          localStorage.removeItem(FORM_CACHE_KEY);
          skipCacheWrite.current = true;
          reset(defaultValues);

          router.back();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Proyek",
          text: `${error}`,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  //* on invalid
  const onInvalid = async (
    errors: FieldErrors<FormDokumenPelengkapPenerbitSchema>,
  ): Promise<void> => {
    const fieldNames = Object.keys(errors);

    const errorList = fieldNames
      .map((field) => `<li>- <span class="font-semibold">${field}</span></li>`)
      .join("");

    Swal.fire({
      icon: "info",
      title: "Ups masih ada field yang error",
      html: `
        <style>
        .swal2-title{font-size:20px !important; font-weight:700; margin:4px 0 10px !important;}
        .swal2-icon{transform:scale(.9); margin:10px auto 0 !important;}
            .swal-error{ text-align:left; font-size:14px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
            .swal-error .desc{ margin:0 0 10px; color:#4A5568; }
            .swal-error .alert-list{
              list-style:none; padding:0; margin:6px 0 0;
              display:grid; grid-template-columns:1fr; gap:8px;
              max-height:260px; overflow:auto;
            }
            @media (min-width:520px){
              .swal-error .alert-list{ grid-template-columns:1fr 1fr; }
            }
            .swal-error .alert-item{
              display:flex; align-items:center; gap:10px;
              padding:8px 10px; border:1px solid #FED7D7; background:#FFF5F5; border-radius:8px;
            }
            .swal-error .badge{
              width:24px; height:24px; border-radius:50%;
              display:inline-flex; align-items:center; justify-content:center;
              background:#F56565; color:#fff; font-weight:700; font-size:12px;
              flex:0 0 24px;
            }
            .swal-error .field{ color:#C53030; font-weight:600; word-break:break-word; }
            .swal-error .tip{ margin-top:12px; font-size:12px; color:#718096; }
            /* scrollbar halus */
            .swal-error .alert-list::-webkit-scrollbar{ height:8px; width:8px; }
            .swal-error .alert-list::-webkit-scrollbar-thumb{ background:#E53E3E33; border-radius:8px; }
          </style>

          <div class="swal-error">
            <p class="desc">Beberapa field belum lengkap, periksa dan lengkapi daftar di bawah ini:</p>
            <ol class="alert-list">
              ${errorList}
            </ol>
          </div>
        `,
      confirmButtonText: "Dimengerti",
    });
  };

  return (
    <div className="w-full py-28 px-6 md:px-24 bg-white">
      <div className="text-black">
        <h1 className="text-2xl font-bold">Form Dokumen Pelengkap</h1>

        <p className="text-gray-500 text-sm pt-3">
          Silakan lengkapi{" "}
          <span className="text-black font-medium">dokumen pelengkap </span>
          sebagai syarat untuk{" "}
          <span className="text-black font-medium">
            melanjutkan proses penerbitan proyek
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          Anda juga dapat meninggalkan form ini kapan saja, karena
          <span className="text-black font-medium">
            {" "}
            data yang telah diinput akan tersimpan otomatis di cache
          </span>
          .
        </p>
      </div>

      <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        {/* right section */}
        <div className="w-full space-y-4">
          <Controller
            control={control}
            name="fotoKantorKaryawan"
            render={({ field }) => {
              return (
                <PhotoUploaderContainer
                  label="Foto Kantor & Karyawan"
                  maxUpload={10}
                  photoPaths={field.value}
                  fileOnChange={field.onChange}
                  errorText={errors.fotoKantorKaryawan?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="fotoKegiatanUsaha"
            render={({ field }) => {
              return (
                <PhotoUploaderContainer
                  label="Foto Kegiatan Usaha"
                  maxUpload={10}
                  photoPaths={field.value}
                  fileOnChange={field.onChange}
                  errorText={errors.fotoKegiatanUsaha?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="videoProfilPerusahaan"
            render={({ field }) => {
              return (
                <VideoUploaderContainer
                  label="Video Profil Perusahaan"
                  videoPath={field.value}
                  fileOnChange={(videoUrl) => {
                    field.onChange(videoUrl);
                  }}
                  errorText={errors.videoProfilPerusahaan?.message}
                />
              );
            }}
          />
        </div>

        {/* left section */}
        <FormSection>
          <DocumentRow>
            <div>
              <SectionPoint text="Surat Keterangan Domisili" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="suratKeteranganDomisili"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Surat Keterangan Domisili"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.suratKeteranganDomisili?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Surat Pernyataan APU-PPT" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="dokumenPerizinanLainnya"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Dokumen Perizinan Lainya"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.dokumenPerizinanLainnya?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Short CV Manajemen" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="shortCvManajemen"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Short CV Manajemen"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.shortCvManajemen?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Daftar Piutang" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="daftarPiutang"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Daftar Piutang"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.daftarPiutang?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="List Data Suplier" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="listDataSupplier"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="List Data Suplier"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.listDataSupplier?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="List Pekerjaan 2 Tahun Terakhir" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="listPekerjaan2TahunTerakhir"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="List Pekerjaan 2 Tahun Terakhir"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.listPekerjaan2TahunTerakhir?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Laporan Pajak Tahunan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="laporanPajakTahunan"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Laporan Pajak Tahunan"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.laporanPajakTahunan?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="RAB" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="rab"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="RAB"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.rab?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Cashflow Project" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="cashflowProject"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Cashflow Project"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.cashflowProject?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Timeline Pekerjaan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="timelinePekerjaan"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Timeline Pekerjaan"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.timelinePekerjaan?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Project Summary" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="projectSummary"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Project Summary"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.projectSummary?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Proyeksi Pendapatan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="proyeksiPendapatan"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Proyeksi Pendapatan"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.proyeksiPendapatan?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <div className="w-full flex justify-end pr-16 pt-4">
            <FormButton onClick={handleSubmit(onSubmit, onInvalid)}>
              Submit
            </FormButton>
          </div>
        </FormSection>
      </div>
    </div>
  );
};

export default FormDokumenTambahanPage;
