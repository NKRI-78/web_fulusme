import { Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect } from "react";

interface OptionType {
  label: string;
  value: string;
  zip_code: string;
}

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
}: Props) => {
  const watchProvinsi = watch(`address.${index}.province_name`);
  const watchKota = watch(`address.${index}.city_name`);
  const watchKecamatan = watch(`address.${index}.district_name`);
  const nameAddress = watch(`address.${index}.name`);

  const sameDisabledAll = false;

  const disProv = sameDisabledAll;
  const disCity = sameDisabledAll || !watchProvinsi;
  const disDist = sameDisabledAll || !watchKota;
  const disSubd = sameDisabledAll || !watchKecamatan;

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
          console.log("Data ", data);
          setKelurahanList((prev) => ({ ...prev, [index]: res }));
        },
      );
  }, [watchKecamatan]);

  return (
    <div key={index} className="space-y-3">
      <h3 className="font-semibold">
        Alamat {nameAddress} <span className="text-red-500">*</span>
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
                isDisabled={disProv}
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
                  isDisabled={disCity}
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
                  isDisabled={disDist}
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
                  isDisabled={disSubd}
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
          placeholder="Detail Alamat"
          className="border px-3 py-2 rounded w-full"
        />
        {errors?.address?.[index]?.detail && (
          <p className="text-red-500 text-sm">
            {errors.address[index].detail.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormAlamat;
