import { User } from "@/app/interfaces/user/IUser";
import { FileText, UserRoundMinus } from "lucide-react";
import Image from "next/image";
import FormButton from "../../inputFormPenerbit/_component/FormButton";
import { useRouter } from "next/navigation";

export default function ProfilePenerbitView({
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
            Penerbit
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {profile.fullname}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {profile.position || "Tidak ada jabatan"}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-1">
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
                    Nama Perushaan
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {company.name ?? "-"}
                  </td>
                </tr>
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
                    <p className="text-sm font-medium">{addr.name}</p>
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
                    { name: "NIB", url: profile.company.nib_path },
                    {
                      name: "Akta Pendirian",
                      url: profile.company.akta_pendirian,
                    },
                    {
                      name: "Akta Perubahan Terakhir",
                      url: profile.company.akta_perubahan_terahkir,
                    },
                    {
                      name: "SK Kemenkumham Pendirian",
                      url: profile.company.sk_kumham,
                    },
                    {
                      name: "SK Kemenkumham Terakhir",
                      url: profile.company.sk_kumham_terahkir,
                    },
                    {
                      name: "NPWP Perusahaan",
                      url: profile.company.npwp_path,
                    },
                    { name: "SIUP", url: profile.company.siup },
                    { name: "TDP", url: profile.company.tdp },
                    {
                      name: "Laporan Keuangan",
                      url: profile.company.laporan_keuangan_path,
                    },
                    {
                      name: "Rekening Koran",
                      url: profile.company.rekening_koran,
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

          {/* Susunan Manajemen */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Susunan Manajemen
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Direktur */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Direktur</h3>
                {profile.company.directors?.map((d) => (
                  <div
                    key={d.id}
                    className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3 space-y-1"
                  >
                    <p className="text-sm">
                      <strong>Nama:</strong> {d.name}
                    </p>
                    <p className="text-sm">
                      <strong>KTP:</strong> {d.ktp}
                    </p>
                    <div className="flex gap-x-4">
                      <a
                        href={d.ktp_path}
                        target="_blank"
                        className="px-3 py-1 bg-blue-100 rounded-md border border-blue-200 text-xs text-blue-500 cursor-pointer hover:shadow transition-shadow duration-300"
                      >
                        <div className="flex gap-x-1 items-center">
                          <FileText size={12} />
                          <p className="text-blue-500">KTP</p>
                        </div>
                      </a>
                      <a
                        href={d.npwp_path}
                        target="_blank"
                        className="px-3 py-1 bg-blue-100 rounded-md border border-blue-200 text-xs text-blue-500 cursor-pointer hover:shadow transition-shadow duration-300"
                      >
                        <div className="flex gap-x-1 items-center">
                          <FileText size={12} />
                          <p className="text-blue-500">NPWP</p>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Komisaris */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Komisaris</h3>
                {profile.company.komisaris?.map((k) => (
                  <div
                    key={k.id}
                    className="bg-green-50 border border-green-100 rounded-xl p-4 mb-3 transition space-y-1"
                  >
                    <p className="text-sm">
                      <strong>Nama:</strong> {k.name}
                    </p>
                    <p className="text-sm">
                      <strong>KTP:</strong> {k.ktp}
                    </p>
                    <div className="flex gap-x-4">
                      <a
                        href={k.ktp_path}
                        target="_blank"
                        className="px-3 py-1 bg-green-100 rounded-md border border-green-200 text-xs text-green-500 cursor-pointer hover:shadow transition-shadow duration-300"
                      >
                        <div className="flex gap-x-1 items-center">
                          <FileText size={12} />
                          <p className="text-green-500">KTP</p>
                        </div>
                      </a>
                      <a
                        href={k.npwp_path}
                        target="_blank"
                        className="px-3 py-1 bg-green-100 rounded-md border border-green-200 text-xs text-green-500 cursor-pointer hover:shadow transition-shadow duration-300"
                      >
                        <div className="flex gap-x-1 items-center">
                          <FileText size={12} />
                          <p className="text-green-500">NPWP</p>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center text-center p-16 mt-6">
          <UserRoundMinus className="w-16 h-16 mb-4 text-gray-500" />
          <h2 className="font-bold text-xl md:text-2xl text-black mb-2">
            Data Belum Lengkap
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
            Silakan lengkapi profil perusahaan Anda dengan menyelesaikan proses
            registrasi perusahaan. Pastikan semua informasi dan dokumen yang
            diperlukan telah diisi dengan benar agar perusahaan Anda dapat
            terverifikasi.
          </p>
          <FormButton
            onClick={() => {
              router.push("/form-penerbit?form=complete-company");
            }}
          >
            Selesaikan Registrasi
          </FormButton>
        </div>
      )}
    </>
  );
}
