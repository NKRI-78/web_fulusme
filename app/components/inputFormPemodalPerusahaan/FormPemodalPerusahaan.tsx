"use client";

import FormButton from "@/app/components/inputFormPemodalPerusahaan/component/FormButton";
import SectionPoint from "@/app/components/inputFormPemodalPerusahaan/component/SectionPoint";
import Subtitle from "@/app/components/inputFormPemodalPerusahaan/component/SectionSubtitle";
import TextField from "@/app/components/inputFormPemodalPerusahaan/component/TextField";
import ContainerSelfie from "./component/ContainerSelfie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/helper/cookie";
import { getUser } from "@/app/lib/auth";
import { useSearchParams } from "next/navigation";
import UpdateRing from "@/app/components/inputFormPemodal/component/UpdateRing";
import { AuthDataResponse } from "@/app/interfaces/auth/auth";
import { uploadMediaService } from "@/app/helper/mediaService";
import FileInput from "../inputFormPenerbit/_component/FileInput";

interface FormSchema {
  photo: string;
  fullname: string;
  jabatan: string;
  fileKtp: string;
  noKtp: string;
  noNpwp: string;
  noNpwpFormatted?: string;
  suratKuasa: string;
}

interface ErrorSchema {
  photo?: string;
  fullname?: string;
  jabatan?: string;
  fileKtp?: string;
  noKtp?: string;
  noNpwp?: string;
  noNpwpFormatted?: string;
  suratKuasa?: string;
}

const FormPemodalPerusahaan: React.FC = () => {
  const [formFields, setFormFields] = useState<FormSchema>({
    photo: "",
    fullname: "",
    jabatan: "",
    fileKtp: "",
    noKtp: "",
    noNpwp: "",
    noNpwpFormatted: "",
    suratKuasa: "",
  });

  const getFormCache = (): FormSchema | null => {
    const cache = localStorage.getItem("pemodalPerusahaanCache");
    return cache ? (JSON.parse(cache) as FormSchema) : null;
  };

  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<ErrorSchema>({});
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<AuthDataResponse | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("update") === "true";
  const formType = searchParams.get("form");
  const inboxId = searchParams.get("inbox-id");
  const formatNpwp = (rawValue: string): string => {
    if (!rawValue) return "";

    const digits = rawValue.replace(/\D/g, "");
    let formattedValue = digits;

    if (digits.length > 2) {
      formattedValue = digits.slice(0, 2) + "." + digits.slice(2);
    }
    if (digits.length > 5) {
      formattedValue =
        formattedValue.slice(0, 6) + "." + formattedValue.slice(6);
    }
    if (digits.length > 8) {
      formattedValue =
        formattedValue.slice(0, 10) + "." + formattedValue.slice(10);
    }
    if (digits.length > 9) {
      formattedValue =
        formattedValue.slice(0, 12) + "-" + formattedValue.slice(12);
    }
    if (digits.length > 12) {
      formattedValue =
        formattedValue.slice(0, 16) + "." + formattedValue.slice(16);
    }

    return formattedValue;
  };

  //* load profile

  useEffect(() => {
    const userCookie = getUser();
    if (!userCookie) return;

    setUser(userCookie);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BACKEND}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${userCookie.token}`,
          },
        });

        const remoteProfile = res.data?.data;
        setProfile(remoteProfile);

        if (isUpdate) {
          setFormFields({
            fullname: remoteProfile?.fullname || "",
            noKtp: remoteProfile?.no_ktp || "",
            fileKtp:
              remoteProfile?.photo_ktp && remoteProfile.photo_ktp !== "-"
                ? remoteProfile.photo_ktp
                : "",

            jabatan: remoteProfile?.position || "",
            noNpwp: remoteProfile?.npwp || "",
            noNpwpFormatted: formatNpwp(remoteProfile?.npwp || ""),
            suratKuasa:
              remoteProfile?.doc?.type === "surat-kuasa"
                ? remoteProfile?.doc?.path
                : "",
            photo: remoteProfile?.selfie || null,
          });
        } else {
          const formCache = getFormCache();
          if (!formCache?.fullname && remoteProfile?.fullname) {
            setFormFields((prev) => ({
              ...prev,
              fullname: remoteProfile.fullname,
            }));
          }
        }
      } catch {}
    };

    fetchProfile();
  }, [isUpdate, formType]);

  const handleSubmit = async () => {
    if (isUpdate) {
      onUpdateEvent();
    } else {
      onSubmitEvent();
    }
  };

  // Submit Create Pemodal Perusahaan
  const onSubmitEvent = async () => {
    const isValid = validateForm();

    if (isValid) {
      setLoading(true);
      try {
        const userData = getUser();

        if (userData) {
          const urlPhotoSelfie = await uploadFotoSelfie(formFields.photo);

          const payload = {
            role: "9",
            fullname: formFields.fullname,
            photo_selfie: urlPhotoSelfie,
            jabatan: formFields.jabatan,
            photo_ktp: formFields.fileKtp,
            no_ktp: formFields.noKtp,
            no_npwp: formFields.noNpwp,
            surat_kuasa: formFields.suratKuasa,
          };

          await axios.post(
            `${API_BACKEND}/api/v1/auth/register-as-emiten`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            },
          );

          setCookie(
            "user",
            JSON.stringify({
              ...userData,
              role: "investor institusi",
            }),
          );

          await Swal.fire({
            icon: "success",
            title: "Data berhasil dikirim",
            text: "Data Anda telah tersimpan. Silakan lanjutkan untuk mengisi form berikutnya.",
            timer: 3000,
            timerProgressBar: true,
          });

          localStorage.removeItem("pemodalPerusahaanCache");
          router.push("/form-data-pemodal-perusahaan");
        }
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
    }
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
        return { dataType: "upload-ktp-pic", val: formFields.fileKtp };
      case "surat-kuasa":
        return { dataType: "surat-kuasa", val: formFields.suratKuasa };
      default:
        return { dataType: "", val: "" };
    }
  }

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
        try {
          const userData = getUser();

          if (!userData) return;

          setLoading(true);

          const userId = profile?.id || userData?.id;
          const companyId = profile?.company?.id;

          const { dataType, val } = mapFormToDataType(formType, formFields);

          const payload = {
            val,
            user_id: userId,
            company_id: companyId,
            inbox_id: inboxId ?? "-",
          };

          await axios.put(
            `${API_BACKEND}/api/v1/document/update/${dataType}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            },
          );

          setCookie(
            "user",
            JSON.stringify({
              ...userData,
              role: "investor institusi",
            }),
          );

          await Swal.fire({
            icon: "success",
            title: "Data berhasil diperbarui",
            text: "Perubahan data Anda sudah tersimpan.",
            timer: 3000,
            timerProgressBar: true,
          });

          localStorage.removeItem("pemodalPerusahaanCache");
          router.replace("/dashboard");
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Update gagal",
            text:
              error.response?.data?.message ||
              "Terjadi kesalahan saat update data.",
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  //* load cache
  useEffect(() => {
    const formCache = localStorage.getItem("pemodalPerusahaanCache");
    if (formCache) {
      const {
        photo,
        fullname,
        jabatan,
        noKtp,
        noNpwp,
        noNpwpFormatted,
        suratKuasa,
        fileKtp,
      } = JSON.parse(formCache) as FormSchema;
      setFormFields({
        photo: photo,
        fullname: fullname,
        jabatan: jabatan,
        noKtp: noKtp,
        noNpwp: noNpwp,
        noNpwpFormatted: noNpwpFormatted,
        suratKuasa: suratKuasa,
        fileKtp: fileKtp,
      });
    }
  }, []);

  //* set cache
  useEffect(() => {
    localStorage.setItem("pemodalPerusahaanCache", JSON.stringify(formFields));
  }, [formFields]);

  //* check form ini apakah update atau engga
  const disabledFormWhenUpdate = (formId: string): boolean => {
    return isUpdate && formId !== formType;
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
    if (!formFields.noNpwp) {
      newErrors.noNpwp = "No NPWP tidak boleh kosong";
    } else if (formFields.noNpwp.length < 15) {
      newErrors.noNpwp = "No NPWP kurang dari 15 digit";
    } else if (formFields.noNpwp.length > 15) {
      newErrors.noNpwp = "No NPWP lebih dari 15 digit";
    }

    if (!formFields.suratKuasa) {
      if (!disabledFormWhenUpdate("surat-kuasa")) {
        newErrors.suratKuasa = "Surat Kuasa wajib disertakan";
      }
    }
    if (!formFields.fileKtp) {
      if (!disabledFormWhenUpdate("upload-ktp-pic")) {
        newErrors.fileKtp = "File KTP wajib disertakan";
      }
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

    try {
      const res = await uploadMediaService(photoFile);
      return res.data?.path ?? "";
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="w-full py-28 mx-auto px-11 md:px-16 lg:px-52 bg-white">
      <h1 className="text-black text-2xl font-bold">Form Pemodal Perusahaan</h1>

      <div className="my-2"></div>

      <p className="text-gray-500 text-sm">
        Halaman ini digunakan untuk mengisi dan mengunggah informasi identitas
        resmi perusahaan Anda sebagai pemodal. Lengkapi seluruh data dengan
        benar untuk memastikan proses verifikasi berjalan lancar dan investasi
        dapat segera dilakukan.
      </p>

      <div className="my-5"></div>

      <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-6">
        <ContainerSelfie
          photoUrl={formFields.photo}
          resetPhotoResult={() => {
            setFormFields({ ...formFields, photo: "" });
          }}
          disabled={isUpdate}
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
            onChange={() => {}}
            disabled
            errorText={errors.fullname}
          />

          <div className="my-3"></div>

          <SectionPoint text="Jabatan" className="mb-1" />
          <TextField
            placeholder="Jabatan"
            value={formFields.jabatan}
            disabled={isUpdate}
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
            disabled={isUpdate}
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

          <div className="my-3"></div>

          <SectionPoint text="Nomor NPWP" className="mb-1" />
          <TextField
            placeholder="Nomor NPWP"
            type="text"
            disabled={isUpdate}
            value={formFields.noNpwpFormatted || ""}
            onChange={(val) => {
              const rawValue = val.target.value.replace(/\D/g, "");

              setFormFields({
                ...formFields,
                noNpwp: rawValue,
                noNpwpFormatted: formatNpwp(rawValue),
              });

              if (rawValue.length === 15) {
                setErrors({ ...errors, noNpwp: "" });
              }
            }}
            maxLength={20}
            errorText={errors.noNpwp}
          />

          <div className="my-1"></div>
          <p className="text-[11px] text-gray-500">
            Nomor NPWP harus sesuai dengan format.
          </p>

          <div className="my-6"></div>

          <div className="w-full flex gap-6 ">
            <UpdateRing formKey={formType} identity="surat-kuasa">
              <div>
                <SectionPoint text="Surat Kuasa" />
                <Subtitle
                  text="File maksimal berukuran 10mb"
                  className="mb-1"
                />
                <Subtitle text="Bermaterai dan di cap basah" className="mb-1" />
                <FileInput
                  fileName="Surat-Kuasa"
                  accept=".pdf,.doc,.docx"
                  fileUrl={formFields.suratKuasa}
                  disabled={disabledFormWhenUpdate("surat-kuasa")}
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
            <UpdateRing formKey={formType} identity="upload-ktp-pic">
              <div>
                <SectionPoint text="File KTP" />
                <Subtitle
                  text="File maksimal berukuran 10mb"
                  className="mb-7"
                />

                <FileInput
                  fileName="File-KTP"
                  accept=".pdf,.doc,.docx"
                  fileUrl={formFields.fileKtp}
                  disabled={disabledFormWhenUpdate("upload-ktp-pic")}
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
            <FormButton onClick={handleSubmit} disabled={loading}>
              {loading ? "Memuat.." : isUpdate ? "Update" : "Lanjutkan"}
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPemodalPerusahaan;
