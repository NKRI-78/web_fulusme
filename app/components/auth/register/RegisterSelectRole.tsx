import React, { useState } from "react";
import Cookies from "js-cookie";

export default function RegisterSelectRole({
  onNext,
  onClose,
}: {
  onNext?: () => void;
  onClose?: () => void;
}) {
  const [showInvestorModal, setShowInvestorModal] = useState(false);

  const handleSelectRole = async (role: number, subRole?: string) => {
    try {
      // const userCookie = Cookies.get("user");

      // if (userCookie) {
      //   const user = JSON.parse(userCookie);

      //   const updatedUser = {
      //     ...user,
      //     role:
      //       role === 2
      //         ? "emiten"
      //         : role === 9
      //         ? "investor company"
      //         : "investor",
      //     subRole: subRole || undefined,
      //     enabled: true,
      //   };

      //   Cookies.set("user", JSON.stringify(updatedUser));
      // }

      onClose?.();

      // Redirect sesuai role
      if (role === 2) {
        window.location.href = "/form-penerbit";
      } else if (role === 9) {
        window.location.href = "/form-pemodal-perusahaan";
      } else {
        window.location.href = "/form-pemodal";
      }
    } catch (err: any) {
      console.error("Error ", err);
    }
  };

  return (
    <>
      {/* Modal Pilih Role */}
      {!showInvestorModal && (
        <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden max-w-3xl w-full">
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl text-black font-bold mb-6">
              Pilih Peran Anda <br /> untuk Memulai
            </h2>

            <div className="space-y-6">
              {/* Penerbit */}
              <div
                onClick={() => handleSelectRole(2)}
                className="border border-purple-600 rounded-xl p-4 hover:bg-purple-50 cursor-pointer"
              >
                <h3 className="text-purple-700 font-bold text-lg">Penerbit</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Anda tertarik mendukung dan membiayai ide bisnis yang
                  menjanjikan. Temukan proyek potensial, kelola investasi Anda,
                  dan bantu wujudkan inovasi.
                </p>
              </div>

              {/* Pemodal */}
              <div
                onClick={() => {
                  setShowInvestorModal(true);
                  // handleSelectRole(1, "investor");
                }}
                className="border border-green-600 rounded-xl p-4 hover:bg-green-50 cursor-pointer"
              >
                <h3 className="text-green-700 font-bold text-lg">Pemodal</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Anda memiliki ide atau bisnis yang siap dikembangkan. Cari
                  dukungan finansial dan bangun koneksi dengan pemodal.
                </p>
              </div>
            </div>

            <p className="text-1xl text-gray-500 mt-6">
              Pilihan Anda akan menentukan alur dan fitur yang tersedia dalam
              platform.
            </p>
          </div>

          <div className="md:w-1/2 relative hidden md:block">
            <img
              src="/images/modal-auth.png"
              alt="Professional Woman"
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Modal Sub Role Investor */}
      {showInvestorModal && (
        <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden max-w-3xl w-full">
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl text-black font-bold mb-3">
              Pilih Jenis Pemodal
            </h2>
            <p className="text-gray-600 mb-6">
              Mulailah perjalanan investasi Anda dan jadilah bagian dari peluang
              besar. Pilih peran yang paling sesuai dan wujudkan keuntungan
              bersama.
            </p>

            <div className="space-y-6">
              {/* Pemodal Individu */}
              <div
                onClick={() => handleSelectRole(1, "investor")}
                className="border border-green-600 rounded-xl p-4 hover:bg-green-50 cursor-pointer"
              >
                <h3 className="text-green-700 font-bold text-lg">
                  Pemodal Individu
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Cocok untuk perorangan yang ingin berinvestasi secara pribadi
                  pada proyek-proyek potensial.
                </p>
              </div>

              {/* Pemodal Perusahaan */}
              <div className="relative">
                <div
                  onClick={() => {
                    handleSelectRole(9, "investor company");
                  }}
                  className="border border-green-600 rounded-xl p-4 hover:bg-green-50 cursor-pointer"
                >
                  <h3 className="text-green-700 font-bold text-lg">
                    Pemodal Perusahaan
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Cocok untuk badan usaha yang ingin berinvestasi pada skala
                    lebih besar.
                  </p>
                </div>

                {/* <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl cursor-not-allowed">
                  <span className="text-white text-xs bg-black/70 rounded-md px-2 py-1">
                    Sedang dalam pembangunan
                  </span>
                </div> */}
              </div>
            </div>

            <button
              onClick={() => setShowInvestorModal(false)}
              className="mt-6 text-sm text-gray-500 hover:underline"
            >
              ← Kembali
            </button>
          </div>

          <div className="md:w-1/2 relative hidden md:block">
            <img
              src="/images/modal-auth.png"
              alt="Professional Woman"
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
