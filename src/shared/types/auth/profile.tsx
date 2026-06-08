export interface IProfile {
  status: number;
  error: boolean;
  message: string;
  data: IProfileData;
}

export interface IProfileData {
  id: string;
  fullname: string;
  avatar: string;
  selfie: string;
  photo_ktp: string;
  no_ktp: string;
  last_education: string;
  gender: string;
  status_marital: string;
  address_detail: string;
  occupation: string;
  position: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
  doc: Doc;
  investor: Investor;
  company: Company;
  verify_emiten: boolean;
  verify_investor: boolean;
  nama_ahli_waris: string;
  phone_ahli_waris: string;
  created_at: string;
  updated_at: string;
}

export interface Doc {
  path: string;
  type: string;
}

export interface Investor {
  bank: Bank;
  ktp: Ktp;
  job: Job;
  risk: Risk;
}

export interface Bank {
  no: string;
  bank_name: string;
  bank_owner: string;
  bank_branch: string;
  rek_koran_path: string;
  created_at: string;
}

export interface Ktp {
  name: string;
  nik: string;
  place_datebirth: string;
  path: string;
  created_at: string;
}

export interface Job {
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
  company_name: string;
  company_address: string;
  monthly_income: string;
  annual_income: string;
  npwp_path: string;
  npwp: string;
  position: string;
}

export interface Risk {
  goal: string;
  tolerance: string;
  experience: string;
  capital_market_knowledge: string;
}

export interface Company {
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
  total_employees: string;
  laporan_keuangan_path: string;
  rekening_koran: string;
  address: any;
  directors: any[];
  komisaris: any[];
  projects: any;
}
