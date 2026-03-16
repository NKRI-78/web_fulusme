import api from "@/utils/axios";

export type TypeOption = { value: string; label: string };

export async function fetchJenisUsaha(): Promise<TypeOption[]> {
  const { data } = await api.get(`/api/v1/business/type/list`);

  if (!data || !Array.isArray(data.data)) {
    throw new Error("Format respons API tidak sesuai");
  }

  return data.data
    .filter((item: { id: number }) => item.id !== 99)
    .map((item: { id: number; name: string }) => ({
      value: item.id.toString(),
      label: item.name,
    }));
}
