export interface ProfileUpdate {
  form_key: string;
  id: string;

  //* register pic
  selfie: string;
  fullname: string;
  position: string;
  no_ktp: string;
  photo_ktp: string;
  doc: {
    path: string;
  };

  // company: {
  //   id: string;
  //   name: string;
  //   nib: string;
  //   nib_path: string;
  //   akta_pendirian: string;
  //   akta_perubahan_terahkir: string;
  //   sk_kumham: string;
  //   sk_kumham_terahkir: string;
  //   sk_kumham_path: string;
  //   npwp_path: string;
  //   total_employees: number;
  //   laporan_keuangan_path: string;
  //   rekening_koran: string;
  //   address: CompanyAddress[];
  //   directors: CompanyPerson[];
  //   komisaris: CompanyPerson[];
  //   projects: CompanyProject[];
  // };
  company: {
    id: string;
    name: string;
    nib: string;
    nib_path: string;
    akta_pendirian: string;
    akta_perubahan_terahkir: string;
    sk_kumham: string;
    sk_kumham_terahkir: string;
    sk_kumham_path: string;
    npwp_path: string;
    siup: string;
    tdp: string;
    site: string;
    email: string;
    npwp: string;
    phone: string;
    bank: CompanyBank;
    jenis_perusahaan: string;
    total_employees: string;
    laporan_keuangan_path: string;
    rekening_koran: string;
    address: CompanyAddress[];
    directors: CompanyPerson[];
    komisaris: CompanyPerson[];
    projects: CompanyProject[];
  };
}

export interface CompanyBank {
  name: string;
  no: string;
  owner: string;
}

export interface CompanyAddress {
  name: string;
  detail: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
}

export interface CompanyPerson {
  id: number;
  title: string;
  name: string;
  position: string;
  ktp: string;
  ktp_path: string;
  npwp: string;
  npwp_path: string;
}

export interface CompanyProject {
  id: string;
  title: string;
  jenis_obligasi: string;
  jumlah_minimal: number;
  jangka_waktu: string;
  tingkat_bunga: string;
  company_profile: string;
  jadwal_pembayaran_bunga: string;
  jadwal_pembayaran_pokok: string;
  deskripsi_pekerjaan: string;
  media: MediaItem[];
  jaminan_kolateral: NamedItem[];
  penggunaan_dana: NamedItem[];
  nilai_kontrak_path: string;
  nilai_kontrak: string;
  is_apbn: boolean;
}

export interface MediaItem {
  id: number;
  path: string;
}

export interface NamedItem {
  id: number;
  name: string;
}
