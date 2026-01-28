import { User } from "@/app/interfaces/user/IUser";
import { formatRupiah } from "@/app/lib/utils";
import { FileText } from "lucide-react";
import Image from "next/image";

export default function ProfilePemodalPribadi({
  avatar,
  profile,
}: {
  avatar: string;
  profile: User;
}) {
  const investor = profile.investor;

  return (
    <>
      {/* HEADER PROFILE */}
      <div className="bg-white rounded-2xl shadow-sm p-8 flex justify-center gap-8 border border-gray-100">
        {/* Foto Profil */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
          <img
            src={avatar}
            alt="Selfie"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Info Profil */}
        <div className="text-center md:text-left flex flex-col justify-center items-center md:items-start">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Pemodal Pribadi
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {profile.fullname}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {profile.email} | {profile.phone}
          </p>
        </div>
      </div>

      {/* KONTEN */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🧍 Data Pribadi */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
            Data Pribadi
          </h2>

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nama Lengkap
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.fullname || "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Jenis Kelamin
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.gender === "L" ? "Laki-laki" : "Perempuan"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Status Perkawinan
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.status_marital || "-"}
                </td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Alamat Lengkap
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.address_detail}, {profile.subdistrict_name},{" "}
                  {profile.district_name}, {profile.city_name},{" "}
                  {profile.province_name}, {profile.postal_code}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 🪪 Data KTP */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
            Data KTP
          </h2>

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nama Lengkap
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.ktp.name || "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  NIK
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.ktp.nik}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Tampat, Tanggal Lahir
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.ktp.place_datebirth}
                </td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-7003">
                  File KTP
                </td>
                <td className="p-3">
                  {profile.investor.ktp?.path ? (
                    <a
                      href={profile.investor.ktp.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-x-2 px-3 py-1 bg-gray-100 rounded-md border border-gray-300 text-sm text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:shadow transition-all duration-200"
                    >
                      <FileText size={14} />
                      <span>Lihat KTP</span>
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 🏦 Data Bank */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-x-4 mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold">Data Bank</h2>

            {profile.rek_efek && (
              <p className="font-semibold bg-amber-50 text-amber-500 text-xs rounded-full border border-amber-500 px-3 py-[2px]">
                Memiliki Rekening Efek
              </p>
            )}
          </div>

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <tbody>
              {profile.rek_efek && (
                <>
                  <tr className="bg-gray-100">
                    <td
                      colSpan={2}
                      className="px-4 py-2 font-semibold text-gray-800 border-t border-gray-300"
                    >
                      Rekening Efek
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                      Nomor Rekening
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {profile.profile_security_account.account || "-"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                      Nama
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {profile.profile_security_account.account_bank || "-"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                      Nama Pemilik
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {profile.profile_security_account.account_name || "-"}
                    </td>
                  </tr>
                </>
              )}

              <tr className="bg-gray-100">
                <td
                  colSpan={2}
                  className="px-4 py-2 font-semibold text-gray-800 border-t border-gray-300"
                >
                  Rekening Utama
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nomor Rekening
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.bank?.no || "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nama Bank
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.bank?.bank_name || "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nama Pemilik
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.bank?.bank_owner || "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Cabang
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.bank?.bank_branch || "-"}
                </td>
              </tr>

              <tr className="bg-gray-100">
                <td
                  colSpan={2}
                  className="px-4 py-2 font-semibold text-gray-800 border-t border-gray-300"
                >
                  Ahli Waris
                </td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nama
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.nama_ahli_waris || "-"}
                </td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  No. Telepon
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.phone_ahli_waris || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 💼 Data Pekerjaan */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
            Data Pekerjaan
          </h2>

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Nama
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.job.company_name || "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Alamat Lengkap
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.job.subdistrict_name},{" "}
                  {profile.investor.job.district_name},{" "}
                  {profile.investor.job.city_name},{" "}
                  {profile.investor.job.province_name},{" "}
                  {profile.investor.job.postal_code}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Posisi
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.job.position}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  NPWP
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.job.npwp}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Penghasilan Pertahun
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {formatRupiah(profile.investor.job?.annual_income)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-7003">
                  File NPWP
                </td>
                <td className="p-3">
                  {profile.investor.job.npwp_path ? (
                    <a
                      href={profile.investor.job.npwp_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-x-2 px-3 py-1 bg-gray-100 rounded-md border border-gray-300 text-sm text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:shadow transition-all duration-200"
                    >
                      <FileText size={14} />
                      <span>Lihat NPWP</span>
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 📊 Profil Risiko */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
            Profil Resiko
          </h2>

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Tujuan Investasi
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.risk.goal}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Toleransi Resiko
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.risk.tolerance}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Pengalaman Investasi
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.risk.experience}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                  Pengetahuan Pasar
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {profile.investor.risk.capital_market_knowledge}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
