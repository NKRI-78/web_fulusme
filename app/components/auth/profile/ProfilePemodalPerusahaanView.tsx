import { User } from "@/app/interfaces/user/IUser";
import { UserRoundMinus } from "lucide-react";
import Image from "next/image";
import FormButton from "../../inputFormPenerbit/_component/FormButton";
import { useRouter } from "next/navigation";

export default function ProfilePemodalPerusahaan({
  avatar,
  profile,
}: {
  avatar: string;
  profile: User;
}) {
  const router = useRouter();
  const company = profile.company;

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
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Pemodal Perusahaan
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {profile.fullname}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {profile.position ?? "Tidak ada jabatan"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {profile.email} | {profile.phone}
          </p>
        </div>
      </div>

      {/* KONTEN */}
      {profile.company.id ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informasi Perusahaan */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Informasi Perusahaan
            </h2>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                    Jenis Perushaan
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {company.jenis_perusahaan ?? "-"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                    Email
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {company.email ?? "-"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                    No Telepon
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {company.phone ?? "-"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                    Website
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    <a
                      href={company.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.site}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Alamat */}
            <div className="mt-5">
              <p className="font-semibold text-sm mb-2">Alamat Perusahaan:</p>
              <div className="space-y-3">
                {profile.company.address?.map((addr, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition"
                  >
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {addr.detail}
                      <br />
                      {addr.subdistrict_name}, {addr.district_name},{" "}
                      {addr.city_name}, {addr.province_name} ({addr.postal_code}
                      )
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Daftar Dokumen Perusahaan */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Dokumen Perusahaan
            </h2>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="min-w-full text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left w-10">No</th>
                    <th className="px-4 py-2 text-left">Nama Dokumen</th>
                    <th className="px-4 py-2 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Akta Pendirian",
                      url: company.akta_pendirian,
                    },
                    {
                      name: "Akta Perubahan Terakhir",
                      url: company.akta_perubahan_terahkir_path,
                    },
                    {
                      name: "SK Pendirian Perusahaan",
                      url: company.sk_pendirian_perusahaan,
                    },
                    {
                      name: "SK Kemenkumham",
                      url: company.sk_kumham_path,
                    },
                    {
                      name: "NPWP Perusahaan",
                      url: company.npwp_path,
                    },
                  ].map((doc, i) =>
                    doc.url ? (
                      <tr
                        key={i}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{doc.name}</td>
                        <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded-md text-xs hover:bg-blue-100 transition"
                          >
                            Lihat
                          </a>
                          <a
                            href={doc.url}
                            download
                            className="px-2 py-1 bg-green-50 border border-green-200 text-green-600 rounded-md text-xs hover:bg-green-100 transition"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 🏦 Data Bank */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Data Bank
            </h2>

            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <tbody>
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
                    {company.bank?.no || "-"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                    Nama Bank
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {company.bank?.name || "-"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium w-1/3 px-4 py-2 text-gray-700">
                    Nama Pemilik
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {company.bank?.owner || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center text-center p-16 mt-6">
          <UserRoundMinus className="w-16 h-16 mb-4 text-gray-500" />
          <h2 className="font-bold text-xl md:text-2xl text-black mb-2">
            Data Belum Lengkap
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
            Silakan lengkapi profil Anda dengan menyelesaikan proses registrasi
            sebagai pemodal perusahaan. Pastikan seluruh data dan dokumen yang
            diperlukan telah diisi dengan benar agar akun Anda dapat
            diverifikasi.
          </p>
          <FormButton
            onClick={() => {
              router.push("/form-data-pemodal-perusahaan");
            }}
          >
            Selesaikan Registrasi
          </FormButton>
        </div>
      )}
    </>
  );
}
