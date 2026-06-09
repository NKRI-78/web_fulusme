"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Select, {
  GroupBase,
  Props as RSProps,
  ClassNamesConfig,
} from "react-select";
import { useMemo } from "react";

type AnyOption = Record<string, any>;

type RHFSelectGenericProps<
  TForm extends FieldValues,
  TValue,
  TMulti extends boolean = false
> = {
  name: Path<TForm>;
  control: Control<TForm>;

  options: AnyOption[];
  getOptionValue?: (opt: AnyOption) => string | number;
  getOptionLabel?: (opt: AnyOption) => string;

  // mapping single
  toFormValue?: (opt: AnyOption | null) => TValue;
  fromFormValue?: (
    val: TValue | null | undefined,
    all: AnyOption[]
  ) => AnyOption | null;

  // mapping multi
  toFormValueMulti?: (opts: AnyOption[]) => TValue;
  fromFormValueMulti?: (
    val: TValue | null | undefined,
    all: AnyOption[]
  ) => AnyOption[];

  placeholder?: string;
  isClearable?: boolean;

  /** penting: generic ikut di sini */
  isMulti?: TMulti;

  usePortal?: boolean;

  /** prop tambahan react-select, tapi genericnya DIKUNCI agar tidak jatuh ke unknown */
  selectProps?: Omit<
    RSProps<AnyOption, TMulti, GroupBase<AnyOption>>,
    "value" | "onChange" | "options" | "isMulti"
  >;

  /** kalau mau pakai classNames, kunci genericnya juga */
  classNames?: ClassNamesConfig<AnyOption, TMulti, GroupBase<AnyOption>>;
};

export default function RHFSelectGeneric<
  TForm extends FieldValues,
  TValue,
  TMulti extends boolean = false
>({
  name,
  control,
  options,
  getOptionValue = (opt) => opt?.value,
  getOptionLabel = (opt) => opt?.label ?? String(opt?.value ?? ""),
  toFormValue,
  fromFormValue,
  toFormValueMulti,
  fromFormValueMulti,
  placeholder = "Pilih…",
  isClearable = true,
  isMulti,
  usePortal = true,
  selectProps,
  classNames,
}: RHFSelectGenericProps<TForm, TValue, TMulti>) {
  const indexByKey = useMemo(() => {
    const m = new Map<string | number, AnyOption>();
    for (const o of options) m.set(getOptionValue(o), o);
    return m;
  }, [options, getOptionValue]);

  const defaultToFormValue = (opt: AnyOption | null) =>
    (opt ? (getOptionValue(opt) as any) : ("" as any)) as TValue;

  const defaultFromFormValue = (val: any): AnyOption | null => {
    if (val === null || val === undefined || val === "") return null;
    const key = typeof val === "object" ? getOptionValue(val) : val;
    return indexByKey.get(key) ?? null;
  };

  const defaultToFormValueMulti = (opts: AnyOption[]) =>
    (opts?.map((o) => getOptionValue(o)) ?? []) as any as TValue;

  const defaultFromFormValueMulti = (val: any): AnyOption[] => {
    if (!Array.isArray(val)) return [];
    const out: AnyOption[] = [];
    for (const v of val) {
      const key = typeof v === "object" ? getOptionValue(v) : v;
      const found = indexByKey.get(key);
      if (found) out.push(found);
    }
    return out;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const valueForSelect = (
          isMulti
            ? (fromFormValueMulti ?? defaultFromFormValueMulti)(
                field.value as TValue,
                options
              )
            : (fromFormValue ?? defaultFromFormValue)(
                field.value as TValue,
                options
              )
        ) as any;

        return (
          <Select<AnyOption, TMulti, GroupBase<AnyOption>>
            {...selectProps}
            classNames={classNames}
            inputId={name}
            options={options}
            isMulti={isMulti as TMulti}
            placeholder={placeholder}
            isClearable={isClearable}
            getOptionLabel={getOptionLabel}
            getOptionValue={(o) => String(getOptionValue(o))}
            value={valueForSelect}
            onChange={(opt) => {
              if (isMulti) {
                const next = (toFormValueMulti ?? defaultToFormValueMulti)(
                  (opt as AnyOption[]) ?? []
                );
                field.onChange(next);
              } else {
                const next = (toFormValue ?? defaultToFormValue)(
                  (opt as AnyOption) ?? null
                );
                field.onChange(next);
              }
            }}
            onBlur={field.onBlur}
            ref={field.ref}
            menuPortalTarget={
              usePortal && typeof window !== "undefined" ? document.body : null
            }
            menuPosition={usePortal ? "fixed" : "absolute"}
            styles={
              usePortal
                ? {
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    option: (base, state) => ({
                      ...base,
                      color: state.isDisabled ? "#ccc" : "#000",
                      backgroundColor: state.isSelected
                        ? "#2684FF"
                        : state.isFocused
                        ? "#B2D4FF"
                        : "#fff",
                    }),
                  }
                : undefined
            }
          />
        );
      }}
    />
  );
}
