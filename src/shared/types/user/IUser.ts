import { Project } from "../project/IProject";

export interface User {
  id: string;
  fullname: string;
  avatar: string;
  selfie: string;
  photo_ktp: string;
  no_ktp: string;
  phone: string;
  email: string;
  npwp: string;
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
  slip_gaji: string;
  profile_security_account: UserSecurityAccount;
  doc: UserDoc;
  investor: UserInvestor;
  company: UserCompany;
  rek_efek: boolean;
  verify_emiten: boolean;
  verify_investor: boolean;
  nama_ahli_waris: string;
  phone_ahli_waris: string;
  created_at: string;
  updated_at: string;
}

export interface UserDoc {
  path: string;
  type: string;
}

export interface UserInvestor {
  bank: UserBank;
  ktp: UserKtp;
  job: UserJob;
  risk: UserRisk;
}

export interface UserBank {
  no: string;
  name: string;
  owner: string;
  bank_name: string;
  bank_owner: string;
  bank_branch: string;
  rek_koran_path: string;
  created_at: string;
}

export interface UserKtp {
  name: string;
  nik: string;
  place_datebirth: string;
  path: string;
  created_at: string;
}

export interface UserJob {
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

export interface UserRisk {
  goal: string;
  tolerance: string;
  experience: string;
  capital_market_knowledge: string;
}

export interface UserCompany {
  id: string;
  name: string;
  nib: string;
  nib_path: string;
  akta_pendirian: string;
  akta_perubahan_terahkir: string;
  akta_perubahan_terahkir_path: string;
  sk_kumham: string;
  sk_kumham_terahkir: string;
  sk_pendirian_perusahaan: string;
  sk_kumham_path: string;
  npwp_path: string;
  siup: string;
  tdp: string;
  site: string;
  email: string;
  npwp: string;
  phone: string;
  bank: UserBank;
  jenis_perusahaan: string;
  total_employees: string;
  laporan_keuangan_path: string;
  rekening_koran: string;
  address: UserAddress[];
  directors: UserDirector[];
  komisaris: UserKomisaris[];
  projects: Project[];
}

export interface UserAddress {
  name: string;
  detail: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
}

export interface UserDirector {
  id: number;
  title: string;
  name: string;
  position: string;
  ktp: string;
  ktp_path: string;
  npwp: string;
  npwp_path: string;
}

export interface UserKomisaris {
  id: number;
  title: string;
  name: string;
  position: string;
  ktp: string;
  ktp_path: string;
  npwp: string;
  npwp_path: string;
}

export interface UserSecurityAccount {
  account_name: string;
  account: string;
  account_sub_no: string;
  account_bank: string;
}
