import { PhoneValue } from "../../(defaults)/form-penerbit/components/PhoneInput";

export interface IFormPublisher {
  sameAsCompany: boolean;
  noPhoneCompany: PhoneValue;
  webCompany: string;
  emailCompany: string;
  namaBank: string;
  nomorRekening: string;
  namaPemilik: string;
  establishedYear: string;
  address: Address[];
  company_name: string;
  jenis_usaha: string;
  companyType: string;
  statusCompanys: string;
  sk_kumham_terahkir: string;
  beneficialOwnerFullname: string;
  beneficialOwnerNoKTP: string;
  tdp: string;
  siup: string;
  fileNpwp: string;
  akta_pendirian: string;
  company_nib_path: string;
  sk_kumham_path: string;
  akta_perubahan_terahkir_path: string;
  total_employees: string;
  laporanKeuangan: string;
  rekeningKoran: string;
  direktur: Direktur[];
  komisaris: Komisari[];
  agree: boolean;
}

export interface Address {
  name: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
  detail: string;
}

export interface Direktur {
  id: string;
  nama: string;
  jabatan: string;
  noKTP: string;
  fileKTP: string;
  fileNPWP: string;
}

export interface Komisari {
  id: string;
  nama: string;
  jabatan: string;
  noKTP: string;
  fileKTP: string;
  fileNPWP: string;
}
