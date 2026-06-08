// constants/jenisUsaha.ts

type TypeOption = { value: string; label: string };

export const JENIS_USAHA_OPTIONS: TypeOption[] = [
  "Perdagangan",
  "Jasa",
  "Manufaktur/Pabrik",
  "Pertanian",
  "Perkebunan",
  "Perikanan",
  "Peternakan",
  "Pertambangan",
  "Konstruksi",
  "Transportasi & Logistik",
  "Pergudangan",
  "Informasi & Komunikasi (TIK)",
  "Keuangan & Asuransi",
  "Properti/Real Estate",
  "Pendidikan",
  "Kesehatan",
  "Pariwisata & Perhotelan",
  "Kuliner / F&B",
  "Ekonomi Kreatif & Media",
  "Energi & Utilitas",
  "Perdagangan Internasional/Ekspor-Impor",
  "Teknologi / Startup",
].map((label) => ({
  value: label,
  label,
}));
