"use client";

import { useEffect, useState } from "react";
import PublisherForm from "./FormPenerbit";
import FormPenerbit from "@/app/components/inputFormPenerbit/FormPenerbit";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { penerbitUpdateKeys } from "./IUpdateRegistrationKey";
import FormUtusanPenerbit from "./FormUtusanPenerbit";
import { getUser } from "@/app/lib/auth";
import { ProfileUpdate } from "./IProfileUpdate";
import {
  FORM_INDEX_CACHE_KEY,
  FORM_PENERBIT_1_CACHE_KEY,
  FORM_PENERBIT_2_CACHE_KEY,
  FORM_PIC_CACHE_KEY,
} from "./form-cache-key";
import Swal from "sweetalert2";
import CircularProgressIndicator from "@/app/components/CircularProgressIndicator";

export interface UpdateFieldValueManajemen {
  id: string;
  val: string;
  type: string;
}

export interface UpdateFieldValue {
  val: string;
  val_array: UpdateFieldValueManajemen[];
}

const loadFormIndex = (isUpdate: boolean, form: string | null): number => {
  // if form == complete-company maka index adalah 1 dimulai dari register perusahaan
  // melewati register pic karena konteksnya user udah register pic yang belum register perusahaan
  if (form === "complete-company") return 1;

  if (isUpdate) {
    console.log("get form index, form= " + form);
    if (!form) return 0;

    // jika formKey memuat form update penerbit maka navigate to index form penerbit yaitu index-2
    // jika tidak itu artinya update berada di form PIC/Form utusan penerbit yaitu index-0
    if (penerbitUpdateKeys.includes(form)) return 2;
  } else {
    const formIndexCache = localStorage.getItem(FORM_INDEX_CACHE_KEY);
    return formIndexCache ? Number(formIndexCache) : 0;
  }

  // fallback
  return 0;
};

const hasDirekturOrKomisaris = (formKey: string | null): boolean => {
  if (!formKey) return false;
  const isDirektur = formKey.includes("direktur");
  const isKomisaris = formKey.includes("komisaris");
  return isDirektur || isKomisaris;
};

export default function MultiStepFormWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("update");
  const formKey = searchParams.get("form");
  const inboxId = searchParams.get("inbox-id");

  const [userProfile, setUserProfile] = useState<ProfileUpdate | null>(null);

  const [loadingGetFormIndex, setLoadingGetFormIndex] = useState<boolean>(true);
  const [formIndex, setFormIndex] = useState<number>(0);

  const [loadingUpdateDoc, setLoadingUpdateDoc] = useState<boolean>(false);

  const userCookie = getUser();

  //* load cache form index
  // jadi halaman penerbit terdiri dari 3 view: register pic, form penerbit 1, dan form penerbit 2
  // tiap view ada index tersendiri sebagai key untuk halaman penerbit bisa mengkondisikan state sekarang harus menampilkan view apa
  // nah, useEffect ini untuk me-load data form index, tapi hanya diload ketika form tidak dalam mode isUpdate
  useEffect(() => {
    // hanya load cache form index ketika ia tidak sedang dalam mode update
    setLoadingGetFormIndex(true);

    const formIndexResult = loadFormIndex(isUpdate !== null, formKey);
    console.log("formundexresult", formIndexResult);
    setFormIndex(formIndexResult);

    setLoadingGetFormIndex(false);
  }, [isUpdate]);

  //* set item form index
  useEffect(() => {
    localStorage.setItem(FORM_INDEX_CACHE_KEY, `${formIndex}`);
  }, [formIndex]);

  //* get data user
  // get data user, data user akan di-inject kedalam masing2 form
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userCookie) {
          const res = await axios(`${API_BACKEND}/api/v1/profile`, {
            headers: {
              Authorization: `Bearer ${userCookie.token}`,
            },
          });

          setUserProfile({ ...res.data["data"], form_key: formKey });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const next = () => setFormIndex((prev) => prev + 1);
  const prev = () => setFormIndex((prev) => prev - 1);

  //* update data register
  const onUpdateDataRegister = async (updateFieldValue: UpdateFieldValue) => {
    setLoadingUpdateDoc(true);

    const isKTP = formKey?.endsWith("upload-ktp") ?? false;
    const isNPWP = formKey?.endsWith("upload-npwp") ?? false;
    const isSusunanManajemen = isKTP || isNPWP;
    const formKeyResult = hasDirekturOrKomisaris(formKey)
      ? "update-direktur-komisaris"
      : formKey;

    const payload = {
      user_id: userProfile?.id ?? "-",
      // ...(formKey === "company-profile"
      //   ? { company_id: userProfile?.company.id }
      //   : { project_id: userProfile?.company.projects?.[0]?.id }),
      inbox_id: inboxId ?? "-",
      company_id: userProfile?.company.id ?? "-",
      project_id: userProfile?.company.projects?.[0]?.id ?? "-",
      val: updateFieldValue.val,
      val_array: isSusunanManajemen ? updateFieldValue.val_array : [],
    };

    try {
      if (userCookie) {
        await axios.put(
          `${API_BACKEND}/api/v1/document/update/${formKeyResult}`,
          payload,
          {
            headers: { Authorization: `Bearer ${userCookie.token}` },
          },
        );

        localStorage.removeItem(FORM_INDEX_CACHE_KEY);
        localStorage.removeItem(FORM_PIC_CACHE_KEY);
        localStorage.removeItem(FORM_PENERBIT_1_CACHE_KEY);
        localStorage.removeItem(FORM_PENERBIT_2_CACHE_KEY);

        await Swal.fire({
          title: "Berhasil",
          text: "Data berhasil diupdate",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        router.back();
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Terjadi kesalahan";
      Swal.fire({
        icon: "error",
        title: "Update Gagal",
        text: `${message}`,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoadingUpdateDoc(false);
    }
  };

  return (
    <div className="py-28 bg-white">
      {loadingGetFormIndex ? (
        <div className="w-full h-[calc(100vh-28px)] flex flex-col items-center justify-center gap-4">
          <CircularProgressIndicator textDescription="Memuat halaman.." />
        </div>
      ) : (
        <>
          {formIndex === 0 && (
            <FormUtusanPenerbit
              profile={userProfile}
              isUpdate={isUpdate !== null}
              loadingUpdate={loadingUpdateDoc}
              onUpdateCallback={(val) => {
                onUpdateDataRegister(val);
              }}
              onSubmitCallback={next}
            />
          )}

          {formIndex === 1 && (
            <PublisherForm
              onNext={next}
              profile={userProfile}
              isUpdate={isUpdate !== null}
            />
          )}

          {formIndex === 2 && (
            <FormPenerbit
              profile={userProfile}
              isUpdate={isUpdate !== null}
              onBack={prev}
              onUpdateCallback={(val) => {
                onUpdateDataRegister(val);
              }}
              onSubmidCallback={() => {
                router.push("/dashboard");
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
