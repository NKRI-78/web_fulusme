export function formatPriceOrEmpty(
  value: number | string | null | undefined,
  locale = "id-ID",
  currency = "IDR",
): string {
  const number = typeof value === "string" ? parseFloat(value) : (value ?? 0);

  if (!number || number === 0) return "";

  return priceLib(number.toString(), locale, currency);
}

export const priceLib = (
  value: string,
  locale: string = "id-ID",
  currency: string = "IDR",
): string => {
  const number = parseFloat(value);
  if (isNaN(number)) {
    throw new Error("Invalid number input");
  }

  // Format the number without fractional digits
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // No decimals
    maximumFractionDigits: 0, // No decimals
  }).format(number);

  // Return formatted value with commas removed
  return formatted.replace(/,/g, "");
};
