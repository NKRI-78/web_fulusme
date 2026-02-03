"use client";

import FileInput from "@/app/components/inputFormPenerbit/_component/FileInput";
import FormButton from "@/app/components/inputFormPenerbit/_component/FormButton";
import SectionPoint from "@/app/components/inputFormPenerbit/_component/SectionPoint";
import Subtitle from "@/app/components/inputFormPenerbit/_component/SectionSubtitle";
import TextField from "@/app/components/inputFormPenerbit/_component/TextField";
import ContainerSelfie from "./ContainerSelfie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import { getUser } from "@/app/lib/auth";
import UpdateRing from "@/app/components/inputFormPemodal/component/UpdateRing";
import { ProfileUpdate } from "./IProfileUpdate";
import { FORM_PIC_CACHE_KEY } from "./form-cache-key";
import { UpdateFieldValue } from "./PenerbitParent";
import { setCookie } from "@/app/helper/cookie";
import { uploadMediaService } from "@/app/helper/mediaService";
import { AuthDataResponse } from "@/app/interfaces/auth/auth";

interface FormSchema {
  photo: string;
  fullname: string;
  jabatan: string;
  fileKtp: string;
  noKtp: string;
  suratKuasa: string;
}

interface ErrorSchema {
  photo?: string;
  fullname?: string;
  jabatan?: string;
  fileKtp?: string;
  noKtp?: string;
  suratKuasa?: string;
}

const getFormCache = (): FormSchema | null => {
  const cache = localStorage.getItem(FORM_PIC_CACHE_KEY);
  if (cache) {
    return JSON.parse(cache) as FormSchema;
  } else {
    return null;
  }
};

interface FormUtusanPenerbitProps {
  isUpdate: boolean;
  profile: ProfileUpdate | null;
  onSubmitCallback: () => void;
  onUpdateCallback: (val: UpdateFieldValue) => void;
}

const FormUtusanPenerbit: React.FC<FormUtusanPenerbitProps> = ({
  isUpdate,
  profile,
  onSubmitCallback,
  onUpdateCallback,
}) => {
  const [formFields, setFormFields] = useState<FormSchema>({
    photo: "",
    fullname: "",
    jabatan: "",
    fileKtp: "",
    noKtp: "",
    suratKuasa: "",
  });

  const [errors, setErrors] = useState<ErrorSchema>({});
  const [loading, setLoading] = useState(false);

  const formKey = profile?.form_key;

  const user = getUser();

  //* handle submit
  const handleSubmit = async () => {
    if (isUpdate) {
      onUpdateEvent();
    } else {
      onSubmitEvent();
    }
  };

  //* inject fullname to field
  // mendapatkan data user untuk didambil value fullname-nya kemudian di-inject kedalam localstorage
  useEffect(() => {
    console.log(`has profile ${profile !== null}`);
    if (profile) {
      const fullnameFromRemote = profile.fullname;

      // jika update data maka set semua nilai
      if (isUpdate) {
        setFormFields({
          fullname: fullnameFromRemote,
          fileKtp: profile.photo_ktp,
          noKtp: profile.no_ktp,
          suratKuasa: profile.doc.path,
          jabatan: profile.position,
          photo: profile.selfie,
        });
      } else {
        // hanya inject nama ketika cache belum ada
        const formCache = getFormCache();
        // inject fullname hanya ketika datanya kosong
        // jangan hapus kondisi ini karena bisa menyebabkan bug, form akan mereset semua field yang telah terisi
        if (!formCache?.fullname) {
          setFormFields({ ...formFields, fullname: fullnameFromRemote });
        }
      }
    }
  }, [profile]);

  //* load cache
  useEffect(() => {
    const formCache = getFormCache();
    if (formCache) {
      setFormFields(formCache);
    }
  }, []);

  //* write cache
  useEffect(() => {
    localStorage.setItem(FORM_PIC_CACHE_KEY, JSON.stringify(formFields));
  }, [formFields]);

  //* onSubmit
  const onSubmitEvent = async () => {
    setLoading(true);

    const isValid = validateForm();
    if (isValid && user) {
      try {
        const urlPhotoSelfie = await uploadFotoSelfie(formFields.photo!);

        const payload = {
          role: "2",
          fullname: formFields.fullname,
          photo_selfie: urlPhotoSelfie,
          jabatan: formFields.jabatan,
          photo_ktp: formFields.fileKtp,
          no_ktp: formFields.noKtp,
          surat_kuasa: formFields.suratKuasa,
          no_npwp: "99",
        };

        await axios.post(
          `${API_BACKEND}/api/v1/auth/register-as-emiten`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        setCookie(
          "user",
          JSON.stringify({
            ...user,
            role: "emiten",
          } as AuthDataResponse),
        );

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data berhasil disimpan.",
          timer: 950,
          timerProgressBar: true,
        });

        onSubmitCallback();
        localStorage.removeItem(FORM_PIC_CACHE_KEY);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Kirim data gagal",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat mengisi data.",
          timer: 3000,
          timerProgressBar: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  //* on update event
  const onUpdateEvent = async () => {
    const isValid = validateForm();

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
        onUpdateCallback({
          val:
            profile?.form_key === "surat-kuasa"
              ? formFields.suratKuasa
              : formFields.fileKtp,
          val_array: [],
        });
      }
    }
  };

  //* validate form
  const validateForm = (): boolean => {
    const newErrors: ErrorSchema = {};

    if (!formFields.photo) {
      newErrors.photo = "Anda belum mengambil foto";
    }

    if (!formFields.fullname) {
      newErrors.fullname = "Nama Lengkap tidak boleh kosong";
    }
    if (!formFields.jabatan) {
      newErrors.jabatan = "Jabatan tidak boleh kosong";
    }
    if (!formFields.noKtp) {
      newErrors.noKtp = "No KTP tidak boleh kosong";
    } else if (formFields.noKtp.length < 16) {
      newErrors.noKtp = "No KTP kurang dari 16 digit";
    }
    if (!formFields.suratKuasa) {
      newErrors.suratKuasa = "Surat Kuasa wajib disertakan";
    }
    if (!formFields.fileKtp) {
      newErrors.fileKtp = "File KTP wajib disertakan";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      Swal.fire({
        title: "Data Tidak Lengkap / Tidak Valid",
        text: "Beberapa kolom berisi data yang tidak valid atau belum diisi. Harap koreksi sebelum melanjutkan.",
        icon: "warning",
        timer: 10000,
        showConfirmButton: false,
      });
    }

    return isValid;
  };

  //* upload foto selfie
  const uploadFotoSelfie = async (photoPath: string): Promise<string> => {
    const arr = photoPath.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const photoFile = new File([u8arr], "Foto Selfie", { type: mime });

    const uploadPhotoResult = await uploadMediaService(photoFile);

    if (uploadPhotoResult.ok && uploadPhotoResult.data) {
      return uploadPhotoResult.data.path;
    } else {
      return "-";
    }
  };

  return (
    <div className="w-full mx-auto px-11 md:px-16 lg:px-52 bg-white">
      <h1 className="text-black text-2xl font-bold">Form Utusan Penerbit</h1>

      <div className="my-2"></div>

      <p className="text-gray-500 text-sm">
        Halaman ini digunakan untuk mengisi dan mengunggah informasi identitas
        sebagai perwakilan resmi perusahaan yang akan menggalang dana. Lengkapi
        seluruh data yang diminta dengan benar agar proses verifikasi berjalan
        lancar.
      </p>

      <div className="my-5"></div>

      <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-6">
        {/* conteiner foto selfie */}
        <ContainerSelfie
          photoUrl={formFields.photo}
          resetPhotoResult={() => {
            setFormFields({ ...formFields, photo: "" });
          }}
          photoResult={(photoSelfie) => {
            if (photoSelfie) {
              setFormFields({ ...formFields, photo: photoSelfie });
              setErrors((prev) => ({ ...prev, photo: "" }));
            }
          }}
          errorText={errors.photo}
        />

        {/* input data */}
        <div className="w-full text-black">
          <SectionPoint text="Nama Lengkap" className="my-1" />
          <TextField
            placeholder="Nama Lengkap"
            value={formFields.fullname}
            disabled={true}
            onChange={(val) => {
              setFormFields({ ...formFields, fullname: val.target.value });
              if (val) {
                setErrors({ ...errors, fullname: "" });
              }
            }}
            errorText={errors.fullname}
          />

          <div className="my-3"></div>

          <SectionPoint text="Jabatan" className="mb-1" />
          <TextField
            placeholder="Jabatan"
            value={formFields.jabatan}
            onChange={(val) => {
              setFormFields({ ...formFields, jabatan: val.target.value });
              if (val) {
                setErrors({ ...errors, jabatan: "" });
              }
            }}
            errorText={errors.jabatan}
          />

          <div className="my-3"></div>

          <SectionPoint text="Nomor KTP" className="mb-1" />
          <TextField
            placeholder="Nomor KTP"
            type="number"
            maxLength={16}
            value={formFields.noKtp}
            onChange={(val) => {
              setFormFields({ ...formFields, noKtp: val.target.value });
              if (val) {
                setErrors({ ...errors, noKtp: "" });
              }
            }}
            errorText={errors.noKtp}
          />
          <div className="my-1"></div>
          <p className="text-[11px] text-gray-500">
            Nomor KTP harus memuat 16 digit angka.
          </p>

          <div className="my-6"></div>

          <div className="w-full flex gap-6 ">
            <UpdateRing formKey={formKey} identity="surat-kuasa">
              <div>
                <SectionPoint text="Surat Kuasa" />
                <Subtitle
                  text="File maksimal berukuran 10mb"
                  className="mb-1"
                />
                <FileInput
                  fileName="Surat Kuasa"
                  accept=".pdf,.word"
                  fileUrl={formFields.suratKuasa}
                  onChange={(fileUrl) => {
                    setFormFields({ ...formFields, suratKuasa: fileUrl });
                    if (fileUrl) {
                      setErrors({ ...errors, suratKuasa: "" });
                    }
                  }}
                  errorText={errors.suratKuasa}
                />
              </div>
            </UpdateRing>

            <UpdateRing formKey={formKey} identity="upload-ktp-pic">
              <div>
                <SectionPoint text="File KTP" />
                <Subtitle
                  text="File maksimal berukuran 10mb"
                  className="mb-1"
                />
                <FileInput
                  fileName="File KTP"
                  accept=".pdf,.jpg,.jpeg,.png"
                  fileUrl={formFields.fileKtp}
                  onChange={(fileUrl) => {
                    setFormFields({ ...formFields, fileKtp: fileUrl });
                    if (fileUrl) {
                      setErrors({ ...errors, fileKtp: "" });
                    }
                  }}
                  errorText={errors.fileKtp}
                />
              </div>
            </UpdateRing>
          </div>

          <div className="my-10"></div>

          <div className="w-full flex justify-end gap-4 mt-6">
            <FormButton disabled={loading} onClick={handleSubmit}>
              {loading ? "Loading..." : isUpdate ? "Update" : "Lanjutkan"}
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormUtusanPenerbit;
