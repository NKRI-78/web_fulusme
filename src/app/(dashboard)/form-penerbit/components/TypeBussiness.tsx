// TypeBussiness.tsx
"use client";
import {
  useController,
  type Control,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";
import Select from "react-select";

type Option = { value: string; label: string };

type Props<T extends FieldValues, N extends FieldPath<T>> = {
  name: N;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
};

export default function RHFSelect<
  T extends FieldValues,
  N extends FieldPath<T>
>({ name, control, options, placeholder = "Pilih…" }: Props<T, N>) {
  const { field, fieldState } = useController<T, N>({ name, control });
  const selected = options.find((o) => o.value === field.value) ?? null;

  return (
    <div>
      <label className="block mb-1 text-black">
        Jenis Usaha<span className="text-red-500 ml-1">*</span>
      </label>
      <Select
        inputId={String(name)}
        options={options}
        value={selected}
        onChange={(opt) => field.onChange(opt ? (opt as Option).value : "")}
        onBlur={field.onBlur}
        isClearable
        placeholder={placeholder}
      />
      {fieldState.error?.message && (
        <p className="text-red-600 text-sm">{fieldState.error.message}</p>
      )}
    </div>
  );
}
