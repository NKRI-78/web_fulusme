export type UserRole = "investor" | "emiten" | "admin" | "user";

export type User = {
  id: string;
  role: UserRole;
  fullname: string;
  avatar: string;
  selfie: string;
  photo_ktp: string;
  no_ktp: string;
  npwp: string;
  phone: string;
  email: string;
  last_education: string;
  gender: "L" | "P";
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

  profile_security_account: {
    account_name: string;
    account: string;
    account_sub_no: string;
    account_bank: string;
  };

  doc: {
    path: string;
    type: string;
  };

  investor: {
    bank: {
      no: string;
      bank_name: string;
      bank_owner: string;
      bank_branch: string;
      rek_koran_path: string;
      created_at: string;
    };
    ktp: {
      name: string;
      nik: string;
      place_datebirth: string;
      path: string;
      created_at: string;
    };
    job: {
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
    };
    risk: {
      goal: string;
      tolerance: string;
      experience: string;
      capital_market_knowledge: string;
    };
  };

  company: {
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
    bank: {
      name: string;
      no: string;
      owner: string;
    };
    jenis_perusahaan: string;
    total_employees: string;
    laporan_keuangan_path: string;
    rekening_koran: string;
    address: string | null;
    directors: unknown[];
    komisaris: unknown[];
    projects: unknown | null;
  };

  rek_efek: boolean;
  verify_emiten: boolean;
  verify_investor: boolean;
  nama_ahli_waris: string;
  phone_ahli_waris: string;
  can_create_project: boolean;
  created_at: string;
  updated_at: string;
};
