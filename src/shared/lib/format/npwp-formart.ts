// app/utils/npwp-format.ts
const ANY_DASH = /[\u2010\u2011\u2012\u2013\u2014\u2212-]/g; // berbagai dash → -

export function normalizeNPWP(input: string): string {
  return (input || "")
    .replace(ANY_DASH, "-")
    .replace(/[Oo]/g, "0")
    .replace(/[Il]/g, "1")
    .replace(/B/g, "8")
    .replace(/[^\d]/g, ""); // sisakan digit saja
}

export function isValidNPWPDigits(d: string): d is string {
  return d.length === 15 || d.length === 16;
}

export function formatNPWPFromDigits(d: string): string {
  if (d.length === 15) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}.${d.slice(
      8,
      9
    )}-${d.slice(9, 12)}.${d.slice(12, 15)}`;
  }
  if (d.length === 16) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}.${d.slice(
      8,
      9
    )}-${d.slice(9, 12)}.${d.slice(12, 16)}`;
  }
  return d; // fallback (seharusnya tidak terjadi bila sudah valid)
}

/** Normalisasi (ambil digit), validasi (15/16), lalu format baku. Throw jika tidak valid. */
export function sanitizeNPWPOrThrow(raw: string): string {
  const digits = normalizeNPWP(raw);
  if (!isValidNPWPDigits(digits))
    throw new Error("NPWP harus 15 atau 16 digit");
  return formatNPWPFromDigits(digits);
}
