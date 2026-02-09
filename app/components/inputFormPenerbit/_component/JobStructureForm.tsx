import React, { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import TextField from "./TextField";
import FileInput from "./FileInput";
import SectionPoint from "./SectionPoint";
import SectionSubtitle from "./SectionSubtitle";
import UpdateRing from "./UpdateRing";
import Select from "react-select";
import { FormPenerbitValues } from "../formPenerbit.schema";

type NamePrefix = "direktur" | "komisaris";

interface JobStructureFormProps {
  label?: string;
  namePrefix: NamePrefix;
  index: number;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  isKomisaris?: boolean;
  hasDirekturUtama?: boolean;
  hasKomisarisUtama?: boolean;
  isUpdate: boolean;
  updateIdentity: string;
  updateFormKey?: string;
}

function capitalizeFullName(name: string): string {
  return name
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const JobStructureForm: React.FC<JobStructureFormProps> = ({
  label,
  namePrefix,
  index,
  onDelete,
  showDeleteButton = true,
  isKomisaris = false,
  hasDirekturUtama = false,
  hasKomisarisUtama = false,
  isUpdate,
  updateIdentity,
  updateFormKey,
}) => {
  const { control, setValue } = useFormContext<FormPenerbitValues>();

  // pantau jabatan baris ini
  const jabatanThisRow = useWatch({
    control,
    name: `${namePrefix}.${index}.jabatan` as const,
  });

  return (
    <div className="w-full flex flex-col mt-2 p-3 rounded-md bg-gray-50 border">
      <div className="flex justify-between">
        <SectionPoint text={label ?? ""} />

        {showDeleteButton && (
          <button
            onClick={onDelete}
            className="bg-gray-200 px-2 rounded-md hover:bg-gray-200"
            type="button"
          >
            <h4 className="font-semibold text-xs text-gray-500 hover:text-gray-700">
              Hapus
            </h4>
          </button>
        )}
      </div>

      <div className="mt-2 mb-2 w-full flex gap-2">
        {/* Nama */}
        <div className="w-full">
          <p className="text-[11px] mb-1 font-semibold text-gray-500">Nama</p>
          <Controller
            control={control}
            name={`${namePrefix}.${index}.nama` as const}
            render={({ field, fieldState }) => (
              <TextField
                placeholder="Nama"
                value={field.value ?? ""}
                disabled={isUpdate}
                onChange={(e) => {
                  const parsed = capitalizeFullName(e.target.value);
                  return field.onChange(parsed);
                }}
                className="flex-[1]"
                errorText={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Jabatan */}
        <div className="w-full">
          <p className="text-[11px] mb-1 font-semibold text-gray-500">
            Jabatan
          </p>

          <Controller
            control={control}
            name={`${namePrefix}.${index}.jabatan` as const}
            defaultValue={isKomisaris ? "komisaris" : "direktur"}
            render={({ field, fieldState }) => {
              const isUtama =
                (field.value ?? "") ===
                (isKomisaris ? "komisaris-utama" : "direktur-utama");

              const options = isKomisaris
                ? [
                    ...(!hasKomisarisUtama || isUtama
                      ? [{ label: "Komisaris Utama", value: "komisaris-utama" }]
                      : []),
                    { label: "Komisaris", value: "komisaris" },
                  ]
                : [
                    ...(!hasDirekturUtama || isUtama
                      ? [{ label: "Direktur Utama", value: "direktur-utama" }]
                      : []),
                    { label: "Direktur", value: "direktur" },
                  ];

              return (
                <Select
                  options={options}
                  value={
                    options.find((opt) => opt.value === field.value) ?? null
                  }
                  onChange={(val) => field.onChange(val?.value)}
                  placeholder="Jabatan"
                  className="text-sm"
                  isDisabled={isUpdate}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "36px",
                      borderColor: fieldState.error ? "red" : base.borderColor,
                    }),
                  }}
                  isClearable={false}
                />
              );
            }}
          />
        </div>
      </div>

      {/* No KTP */}
      <div className="w-full">
        <p className="text-[11px] mb-1 font-semibold text-gray-500">No KTP</p>
        <Controller
          control={control}
          name={`${namePrefix}.${index}.noKTP` as const}
          render={({ field, fieldState }) => (
            <TextField
              placeholder="No KTP"
              value={field.value ?? ""}
              type="text"
              disabled={isUpdate}
              maxLength={16}
              onChange={(e) => {
                const onlyDigits = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 16);
                field.onChange(onlyDigits);
              }}
              errorText={fieldState.error?.message}
            />
          )}
        />
      </div>

      <SectionSubtitle
        text="File maksimal berukuran 10mb"
        className="mt-2 mb-1"
      />

      {/* Uploads */}
      <div className="flex gap-2">
        <UpdateRing
          identity={`${updateIdentity}-upload-ktp`}
          formKey={updateFormKey}
        >
          <Controller
            control={control}
            name={`${namePrefix}.${index}.fileKTP` as const}
            render={({ field, fieldState }) => (
              <FileInput
                fileName="Upload KTP"
                placeholder="Upload KTP"
                disabled={isUpdate}
                fileUrl={field.value ?? ""}
                onChange={(fileUrl) => field.onChange(fileUrl)}
                errorText={fieldState.error?.message}
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
              />
            )}
          />
        </UpdateRing>

        <UpdateRing
          identity={`${updateIdentity}-upload-npwp`}
          formKey={updateFormKey}
        >
          <Controller
            control={control}
            name={`${namePrefix}.${index}.fileNPWP` as const}
            render={({ field, fieldState }) => (
              <FileInput
                fileName="Upload NPWP"
                placeholder="Upload NPWP"
                fileUrl={field.value ?? ""}
                disabled={isUpdate}
                onChange={(fileUrl) => field.onChange(fileUrl)}
                errorText={fieldState.error?.message}
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
              />
            )}
          />
        </UpdateRing>
      </div>
    </div>
  );
};

export default JobStructureForm;
