export interface ProjectResponse {
  status: number;
  error: boolean;
  message: string;
  data: Project[];
}

export interface Project {
  id: string;
  title: string;
  deskripsi: string;
  goal: string;
  jenis_proyek: string;
  medias: ProjectMedia[];
  jangka_waktu: string;
  location: ProjectLocation;
  jumlah_minimal: number;
  investor_paid: number;
  doc: ProjectDocument;
  tingkat_bunga: string;
  capital: string;
  company_profile: string;
  target_amount: number;
  user_paid_amount: number;
  jumlah_lot: string;
  spk: string;
  loa: string;
  doc_prospect: string;
  mulai_project: string;
  stok_lot: number;
  selesai_project: string;
  jadwal_pembayaran_bunga: string;
  jadwal_pembayaran_pokok: string;
  media: ProjectMedia[];
  jaminan_kolateral: ProjectJaminanKolateral[];
  penggunaan_dana: any[];
  nilai_kontrak_path: string;
  nilai_kontrak: string;
  status: string;
  is_apbn: boolean;
  kode_efek: string;
  loan_term: string;
  roi: string;
  min_invest: string;
  remaining_days: number;
  project_is_expire: boolean;
  unit_price: string;
  unit_total: string;
  jumlah_unit: string;
  periode: string;
  type_of_project: string;
  nominal_value: string;
  time_periode: string;
  interest_rate: string;
  interest_payment_schedule: string;
  principal_payment_schedule: string;
  use_of_funds: any[];
  collateral_guarantee: ProjectJaminanKolateral[];
  desc_job: string;
  is_approved: boolean;
  alamat_penyedia_project: string;
  alamat_penyedia_provinsi: string;
  alamat_penyedia_kota: string;
  alamat_penyedia_daerah: string;
  alamat_penyedia_wilayah: string;
  alamat_penyedia_kode_pos: string;
  company: ProjectCompany;
  created_at: string;
  updated_at: string;
}

interface ProjectMedia {
  id: number;
  path: string;
}

interface ProjectLocation {
  id: number;
  name: string;
  url: string;
  lat: string;
  lng: string;
}

interface ProjectDocument {
  id: string;
  path: string;
}

interface ProjectJaminanKolateral {
  id: number;
  name: string;
}

interface ProjectCompany {
  name: string;
  jenis_usaha: string;
}
