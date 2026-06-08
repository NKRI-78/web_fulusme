export function formatRupiah(
  value: number,
  withPrefix: boolean = true
): string {
  if (isNaN(value)) return withPrefix ? "Rp 0" : "0";

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

  return withPrefix ? formatted : formatted.replace("Rp", "").trim();
}
