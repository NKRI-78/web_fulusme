import { Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect } from "react";

interface OptionType {
  label: string;
  value: string;
  zip_code: string;
}

// ✅ Props lengkap

type Props = {
  index: number;
  control: any;
  setValue: any;
  watch: any;
  register: any;
  errors: any; //
  provinsiList: OptionType[];
  kotaList: Record<number, OptionType[]>;
  setKotaList: React.Dispatch<
    React.SetStateAction<Record<number, OptionType[]>>
  >;
  kecamatanList: Record<number, OptionType[]>;
  setKecamatanList: React.Dispatch<
    React.SetStateAction<Record<number, OptionType[]>>
  >;
  kelurahanList: Record<number, OptionType[]>;
  setKelurahanList: React.Dispatch<
    React.SetStateAction<Record<number, OptionType[]>>
  >;
  fetchOptions: (type: string, id: string) => Promise<OptionType[]>;
  sameAsCompany: boolean;
};

const FormAlamat = ({
  index,
  control,
  setValue,
  watch,
  register,
  errors,
  provinsiList,
  kotaList,
  setKotaList,
  kecamatanList,
  setKecamatanList,
  kelurahanList,
  setKelurahanList,
  fetchOptions,
  sameAsCompany,
}: Props) => {
  const watchProvinsi = watch(`address.${index}.province_name`);
  const watchKota = watch(`address.${index}.city_name`);
  const watchKecamatan = watch(`address.${index}.district_name`);

  useEffect(() => {
    if (watchProvinsi)
      fetchOptions("api/v1/administration/city", watchProvinsi).then((res) =>
        setKotaList((prev) => ({ ...prev, [index]: res })),
      );
  }, [watchProvinsi]);

  useEffect(() => {
    if (watchKota)
      fetchOptions("api/v1/administration/district", watchKota).then((res) =>
        setKecamatanList((prev) => ({ ...prev, [index]: res })),
      );
  }, [watchKota]);

  useEffect(() => {
    if (watchKecamatan)
      fetchOptions("api/v1/administration/subdistrict", watchKecamatan).then(
        (res: any) => {
          const data = res.data || [];
          setKelurahanList((prev) => ({ ...prev, [index]: res }));
        },
      );
  }, [watchKecamatan]);

  const isDisabled = sameAsCompany && index === 1;

  return (
    <div key={index} className="space-y-3">
      <h3 className="font-semibold">
        Alamat {index === 0 ? "Perusahaan" : "Korespondensi"}{" "}
        <span className="text-red-500">*</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* =================== PROVINSI (menyimpan label) =================== */}
        <Controller
          name={`address.${index}.province_name`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <Select<OptionType>
                placeholder="Pilih Provinsi"
                options={provinsiList}
                isSearchable
                isDisabled={isDisabled}
                value={
                  provinsiList.find((opt) => opt.label === field.value) || null
                }
                onChange={async (opt) => {
                  // simpan nama provinsi
                  field.onChange(opt?.label || "");

                  // reset turunan & options
                  setValue(`address.${index}.city_name`, "");
                  setValue(`address.${index}.district_name`, "");
                  setValue(`address.${index}.subdistrict_name`, "");
                  setValue(`address.${index}.postal_code`, "");
                  setKotaList((prev) => ({ ...prev, [index]: [] }));
                  setKecamatanList((prev) => ({ ...prev, [index]: [] }));
                  setKelurahanList((prev) => ({ ...prev, [index]: [] }));

                  // fetch kota berbasis province.value
                  if (opt?.value) {
                    const cities = await fetchOptions(
                      "api/v1/administration/city",
                      opt.label,
                    );
                    setKotaList((prev) => ({ ...prev, [index]: cities || [] }));
                  }
                }}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          )}
        />

        {/* =================== KOTA (menyimpan label) =================== */}
        <Controller
          name={`address.${index}.city_name`}
          control={control}
          render={({ field, fieldState: { error } }) => {
            const options = kotaList[index] || [];
            return (
              <div>
                <Select<OptionType>
                  placeholder="Pilih Kota"
                  options={options}
                  isSearchable
                  isDisabled={!watchProvinsi || isDisabled}
                  value={
                    options.find((opt) => opt.label === field.value) || null
                  }
                  onChange={async (opt) => {
                    // simpan nama kota
                    field.onChange(opt?.label || "");

                    // reset turunan & options
                    setValue(`address.${index}.district_name`, "");
                    setValue(`address.${index}.subdistrict_name`, "");
                    setValue(`address.${index}.postal_code`, "");
                    setKecamatanList((prev) => ({ ...prev, [index]: [] }));
                    setKelurahanList((prev) => ({ ...prev, [index]: [] }));

                    // fetch kecamatan berbasis city.value
                    if (opt?.value) {
                      const dists = await fetchOptions(
                        "api/v1/administration/district",
                        opt.label,
                      );
                      setKecamatanList((prev) => ({
                        ...prev,
                        [index]: dists || [],
                      }));
                    }
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error.message}</p>
                )}
              </div>
            );
          }}
        />

        {/* =================== KECAMATAN (menyimpan label) =================== */}
        <Controller
          name={`address.${index}.district_name`}
          control={control}
          render={({ field, fieldState: { error } }) => {
            const options = kecamatanList[index] || [];
            return (
              <div>
                <Select<OptionType>
                  placeholder="Pilih Kecamatan"
                  options={options}
                  isSearchable
                  isDisabled={!watchKota || isDisabled}
                  value={
                    options.find((opt) => opt.label === field.value) || null
                  }
                  onChange={async (opt) => {
                    // simpan nama kecamatan
                    field.onChange(opt?.label || "");

                    // reset turunan & options
                    setValue(`address.${index}.subdistrict_name`, "");
                    setValue(`address.${index}.postal_code`, "");
                    setKelurahanList((prev) => ({ ...prev, [index]: [] }));

                    // fetch kelurahan berbasis district.value
                    if (opt?.value) {
                      const subs = await fetchOptions(
                        "api/v1/administration/subdistrict",
                        opt.label,
                      );
                      setKelurahanList((prev) => ({
                        ...prev,
                        [index]: subs || [],
                      }));
                    }
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error.message}</p>
                )}
              </div>
            );
          }}
        />

        {/* =================== KELURAHAN (menyimpan label) =================== */}
        <Controller
          name={`address.${index}.subdistrict_name`}
          control={control}
          render={({ field, fieldState: { error } }) => {
            const options = kelurahanList[index] || [];
            return (
              <div>
                <Select<OptionType>
                  placeholder="Pilih Kelurahan"
                  options={options}
                  isSearchable
                  isDisabled={!watchKecamatan || isDisabled}
                  value={
                    options.find((opt) => opt.label === field.value) || null
                  }
                  onChange={(opt) => {
                    // simpan nama kelurahan
                    field.onChange(opt?.label || "");
                    // isi otomatis kode pos
                    setValue(
                      `address.${index}.postal_code`,
                      opt?.zip_code || "",
                    );
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error.message}</p>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* =================== Kode Pos =================== */}
      <div>
        <input
          {...register(`address.${index}.postal_code`, {
            required: "Kode Pos wajib diisi",
          })}
          placeholder="Kode Pos"
          type="text"
          disabled={isDisabled}
          className="border px-3 py-2 rounded w-full"
        />
        {errors?.address?.[index]?.postal_code && (
          <p className="text-red-500 text-sm">
            {errors.address[index].postal_code.message}
          </p>
        )}
      </div>

      {/* =================== Detail Alamat =================== */}
      <div>
        <textarea
          {...register(`address.${index}.detail`, {
            required: "Detail alamat wajib diisi",
          })}
          disabled={isDisabled}
          placeholder="Detail Alamat"
          className="border px-3 py-2 rounded w-full"
        />
        {errors?.address?.[index]?.detail && (
          <p className="text-red-500 text-sm">
            {errors.address[index].detail.message}
          </p>
        )}
      </div>

      {/* =================== Checkbox Same As Company =================== */}
      {index === 0 && (
        <Controller
          name="sameAsCompany"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => {
                  const checked = e.target.checked;
                  field.onChange(checked);

                  if (checked) {
                    const company = watch("address")[0];
                    // salin hanya field yang ada di schema
                    setValue(`address.1`, {
                      name: "Koresponden",
                      province_name: company.province_name || "",
                      city_name: company.city_name || "",
                      district_name: company.district_name || "",
                      subdistrict_name: company.subdistrict_name || "",
                      postal_code: company.postal_code || "",
                      detail: company.detail || "",
                    });
                  } else {
                    setValue(`address.1`, {
                      name: "Koresponden",
                      province_name: "",
                      city_name: "",
                      district_name: "",
                      subdistrict_name: "",
                      postal_code: "",
                      detail: "",
                    });
                  }
                }}
              />
              <label>
                Gunakan alamat perusahaan sebagai alamat korespondensi
              </label>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default FormAlamat;
