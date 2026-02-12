"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";

// Type untuk data per jabatan
type JabatanData = {
  nama: string;
  jabatan: string;
  noKtp: string;
  fileKtp?: File;
  fileNpwp?: File;
  fileKtpUrl?: string;
  fileNpwpUrl?: string;
};

// Type untuk keseluruhan form
type FormData = {
  jabatans: JabatanData[];
};

export default function JabatanForm() {
  const { register, control, handleSubmit, watch, setValue } =
    useForm<FormData>({
      defaultValues: {
        jabatans: [
          { nama: "", jabatan: "Komisaris", noKtp: "" },
          { nama: "", jabatan: "Direksi", noKtp: "" },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jabatans",
  });

  const jabatanValues = watch("jabatans");

  useEffect(() => {
    const stored = localStorage.getItem("jabatanFormData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.jabatans)) {
          parsed.jabatans.forEach((val: JabatanData, idx: number) => {
            if (idx === 0 || idx === 1) {
              setValue(`jabatans.${idx}.nama`, val.nama);
              setValue(`jabatans.${idx}.jabatan`, val.jabatan);
              setValue(`jabatans.${idx}.noKtp`, val.noKtp);
            } else {
              append({
                nama: val.nama,
                jabatan: val.jabatan,
                noKtp: val.noKtp,
                fileKtp: undefined,
                fileNpwp: undefined,
              });
            }
          });
        }
      } catch (err) {}
    }
  }, []);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();

    data.jabatans.forEach((jab, index) => {
      formData.append(`jabatans[${index}][nama]`, jab.nama);
      formData.append(`jabatans[${index}][jabatan]`, jab.jabatan);
      formData.append(`jabatans[${index}][noKtp]`, jab.noKtp);
      if (jab.fileKtp)
        formData.append(`jabatans[${index}][fileKtp]`, jab.fileKtp);
      if (jab.fileNpwp)
        formData.append(`jabatans[${index}][fileNpwp]`, jab.fileNpwp);
    });

    localStorage.setItem("draftJabatan", JSON.stringify(data));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "fileKtp" | "fileNpwp",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`jabatans.${index}.${type}`, file);
      const previewUrl = URL.createObjectURL(file);
      const urlField = type === "fileKtp" ? "fileKtpUrl" : "fileNpwpUrl";
      setValue(`jabatans.${index}.${urlField}`, previewUrl);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 text-black max-w-xl mx-auto px-3 md:px-10 py-30 md:py-40"
    >
      {fields.map((field, index) => (
        <div key={field.id} className="border-b pb-6 relative">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">
            {jabatanValues?.[index]?.jabatan || `Jabatan ${index + 1}`}
          </h2>

          {index >= 2 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-0 top-0 text-red-500 hover:text-red-700 flex items-center text-sm"
            >
              <FaTrash className="mr-1" /> Hapus
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              placeholder="Nama"
              {...register(`jabatans.${index}.nama`)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Jabatan"
              {...register(`jabatans.${index}.jabatan`)}
              className="border p-2 rounded w-full"
            />
          </div>

          <input
            type="text"
            placeholder="No KTP"
            {...register(`jabatans.${index}.noKtp`)}
            className="border p-2 rounded w-full mb-2"
          />

          <p className="text-xs text-gray-500 mb-2">File maksimal 10MB (PDF)</p>

          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded cursor-pointer">
              <FaFileAlt /> Upload KTP
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, index, "fileKtp")}
                className="hidden"
              />
            </label>

            <label className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded cursor-pointer">
              <FaFileAlt /> Upload NPWP
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, index, "fileNpwp")}
                className="hidden"
              />
            </label>
          </div>

          {jabatanValues[index]?.fileKtpUrl && (
            <a
              href={jabatanValues[index]?.fileKtpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm block"
            >
              Lihat File KTP
            </a>
          )}

          {jabatanValues[index]?.fileNpwpUrl && (
            <a
              href={jabatanValues[index]?.fileNpwpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm block"
            >
              Lihat File NPWP
            </a>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ nama: "", jabatan: "", noKtp: "" })}
        className="w-full border-2 border-dashed border-gray-400 py-3 text-center text-gray-600 rounded"
      >
        + Tambah Jabatan
      </button>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Submit
      </button>
    </form>
  );
}
