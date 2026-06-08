"use client";

import React, { useState } from "react";

const AboutUs: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<null | string>(null);

  const memberDetails: Record<
    string,
    { name: string; title: string; img: string; description: string }
  > = {
    eva: {
      name: "Eva Marlina",
      title: "President Commissioner",
      img: "/images/default-profile.png",
      description: `Berpengalaman di industri telekomunikasi sebagai Associate director dan Chief of Corporate Relation Affairs, dan memiliki pengalaman finansial yang mumpuni untuk mendukung jalannya FuLusme.`,
    },
    donald: {
      name: "Donald Akbar",
      title: "Chief Executive Officer",
      img: "/images/default-profile.png",
      description: `Berkecimpung sebagai komisaris dan komisaris utama di beberapa perusahaan multi industri, membuatnya memiliki pengalaman yang panjang dan tajam sebagai pengawas jalannya FuLusme . Dengan memiliki visi dan misi untuk memajukan bisnis dengan konsep Urun Dana/ securities Crowdfunding bagi seluruh masyarakat, diharapkan FuLusme dapat bermanfaat bagi dunia bisnis di Indonesia.`,
    },
    nanda: {
      name: "Nandana Pawitra",
      title: "Chief Operation Officer & HR",
      img: "/images/default-profile.png",
      description: `Berpengalaman lebih dari 20 tahun sebagai profesional, pelaku pasar di Bursa Efek dan pemilik Anggota Bursa Berjangka Jakarta. Juga pendiri The Jakarta Commodity Exchange. Pengalaman yang cukup dalam industri Capital Market dapat menjadi landasan dalam mengembangkan industri Securities Crowdfunding yang Insya Allah dapat menjadi manfaat bagi sebanyak-banyak umat.`,
    },
  };

  return (
    <div>
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 max-w-lg relative shadow-lg">
            <button
              className="absolute text-gray-600 hover:text-black top-2 right-4 text-2xl font-bold"
              onClick={() => setSelectedMember(null)}
            >
              &times;
            </button>
            <div className="text-center">
              <img
                src={memberDetails[selectedMember].img}
                alt={memberDetails[selectedMember].name}
                className="w-28 h-28 rounded-full mx-auto object-cover mb-4"
              />
              <h3 className="text-xl font-bold text-[#10565C]">
                {memberDetails[selectedMember].name}
              </h3>
              <p className="text-[#16EDFF] font-medium">
                {memberDetails[selectedMember].title}
              </p>
              <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
                {memberDetails[selectedMember].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KOMITMEN */}
      <section className="w-full bg-[#10565C] grid grid-cols-1 md:grid-cols-2 items-center px-10 md:px-20 py-32 gap-y-10 md:gap-y-0 md:gap-x-20">
        <div className="space-y-4 z-10 relative">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
            KOMITMEN KAMI
          </h1>
          <p className="text-white text-sm leading-relaxed">
            FuLusme berkomitmen untuk memberikan akses pembiayaan dan investasi
            yang lebih menguntungkan untuk investor dan pemilik bisnis
          </p>
          <div className="flex gap-6 items-center">
            <img
              src="/images/covered/ojk.png"
              alt="OJK Logo"
              className="h-12"
            />
            <img
              src="/images/covered/iso.png"
              alt="ISO Logo"
              className="h-12"
            />
          </div>
        </div>

        <div className="mt-10 md:mt-0 z-10 relative text-white">
          <div className="space-y-6">
            <div>
              <p className="text-2xl text-white font-bold">Visi</p>
              <p className="text-md text-gray-200">
                Menjadi Perusahaan Teknologi Finansial terkemuka di Indonesia
                dan Regional Asia.
              </p>
            </div>
            <div>
              <p className="text-2xl text-white font-bold">Misi</p>
              <p className="text-md text-gray-200">
                Memajukan perekonomian Indonesia khususnya pada sektor UKM
                melalui teknologi finansial agar dapat tumbuh berkembang dan
                tetap berpegang pada nilai-nilai keadilan dan kejujuran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NILAI */}
      <section className="w-full bg-gray-100 px-10 md:px-20 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#10565C] mb-16">
          FuLusme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="text-xl font-bold text-[#10565C] mb-2">Penerbit</h3>
            <p className="text-gray-700">
              Memprioritaskan calon penerbit yang potensial
            </p>
          </div>

          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <span className="text-3xl">🔥</span>
            </div>
            <h3 className="text-xl font-bold text-[#10565C] mb-2">FuLusme</h3>
            <p className="text-gray-700">
              Selalu menjaga keseimbangan, kebutuhan kenyamanan dan keamanan
              pemodal dan penerbit
            </p>
          </div>

          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <span className="text-3xl">💧</span>
            </div>
            <h3 className="text-xl font-bold text-[#10565C] mb-2">Pemodal</h3>
            <p className="text-gray-700">
              Secara konsisten menampilkan jumlah nilai pokok dan bagi hasil
              yang menarik
            </p>
          </div>
        </div>
      </section>

      {/* BOARD OF COMMISSIONER */}
      <section className="w-full bg-white text-black px-10 md:px-20 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#10565C] mb-16">
          Board Of Commissioner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-start text-center">
          <div className="flex flex-col items-center">
            <img
              src="/images/default-profile.png"
              alt="Eva Marlina"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-bold text-[#10565C]">Eva Marlina</h3>
            <p className="text-[#16EDFF] font-medium mb-2">
              President Commissioner
            </p>
            <p className="text-sm max-w-md">
              Berpengalaman di industri telekomunikasi sebagai Associate
              director dan Chief of Corporate Relation Affairs, dan memiliki
              pengalaman finansial yang…
              <br />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedMember("eva");
                }}
                className="text-[#10565C] font-semibold"
              >
                Baca Selengkapnya
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/default-profile.png"
              alt="Henri Kasyfi Soemartono"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-bold text-[#10565C]">
              Henri Kasyfi Soemartono
            </h3>
            <p className="text-[#16EDFF] font-medium mb-2">Commissioner</p>
          </div>
        </div>
      </section>

      {/* BOARD OF DIRECTOR */}
      <section className="w-full bg-white text-black px-10 md:px-20 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#10565C] mb-16">
          Board Of Director
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center items-start text-center">
          <div className="flex flex-col items-center">
            <img
              src="/images/default-profile.png"
              alt="Donald Akbar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-bold text-[#10565C]">Donald Akbar</h3>
            <p className="text-[#16EDFF] font-medium mb-2">
              Chief Executive Officer
            </p>
            <p className="text-sm text-start max-w-md">
              Berkecimpung sebagai komisaris dan komisaris utama di beberapa
              perusahaan multi industri, membuatnya memiliki pengalaman yang
              panjang dan tajam...
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedMember("donald");
                }}
                className="text-[#10565C] font-semibold"
              >
                Baca Selengkapnya
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/default-profile.png"
              alt="Nandana Pawitra"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-bold text-[#10565C]">
              Nandana Pawitra
            </h3>
            <p className="text-[#16EDFF] font-medium mb-2">
              Chief Operation Officer & HR
            </p>
            <p className="text-sm text-start max-w-md">
              Berpengalaman lebih dari 20 tahun sebagai profesional, pelaku
              pasar di Bursa Efek dan pemilik Anggota Bursa Berjangka
              Jakarta....
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedMember("nanda");
                }}
                className="text-[#10565C] font-semibold"
              >
                Baca Selengkapnya
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/default-profile.png"
              alt="Handoyo Taher"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-bold text-[#10565C]">Handoyo Taher</h3>
            <p className="text-[#16EDFF] font-medium mb-2">
              Chief Finance Officer
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
