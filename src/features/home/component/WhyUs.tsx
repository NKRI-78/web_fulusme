import React from "react";

const WhyUs: React.FC = () => {
  return (
    <section className="bg-white relative text-black pt-14 pb-5 px-6 text-center md:px-16">
      <div className="flex flex-col md:flex-row gap-x-6 gap-y-10 md:gap-y-0">
        <div className="basis-full md:basis-6/12">
          <img
            className="w-3/4 md:w-full mx-auto"
            src="/images/secure-investment-illustration.webp"
            alt="Secure Investment"
          />
        </div>

        <div className="basis-full md:basis-6/12 text-left flex flex-col gap-y-6">
          <h2 className="text-[#10565C] text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
            Cara Baru Investasi Aman dan Menguntungkan
          </h2>
          <p className="text-[#969696] text-base md:text-lg">
            FuLusme adalah penyelenggara urun dana berbasis teknologi
            informasi di Indonesia yang beroperasi sesuai prinsip ESG
            (Environmental, Social, Governance)...
          </p>

          <ul className="flex flex-col gap-y-8">
            <li className="border-b-2 border-b-[#DDDDDD] pb-8">
              <h3 className="text-[#10565C] text-xl md:text-2xl font-extrabold tracking-tight">
                1. Platform resmi yang berizin
              </h3>
              <ul className="flex flex-col gap-y-5 mt-5">
                <li className="flex gap-x-2 items-center">
                  <img className="w-6" src="/images/check.png" alt="Check" />
                  <span className="text-[#969696]">
                    Berizin resmi dan diawasi OJK : Surat KEP-45/D.04/2022
                  </span>
                </li>
                <li className="flex gap-x-2 items-center">
                  <img className="w-6" src="/images/check.png" alt="Check" />
                  <span className="text-[#969696]">
                    Bersertifikasi ISO 27001 : 2013
                  </span>
                </li>
                <li className="flex gap-x-2 items-center">
                  <img className="w-6" src="/images/check.png" alt="Check" />
                  <span className="text-[#969696]">
                    Anggota resmi dari ALUDI
                  </span>
                </li>
              </ul>
            </li>

            <li className="border-b-2 border-b-[#DDDDDD] pb-8">
              <h3 className="text-[#10565C] text-xl md:text-2xl font-extrabold tracking-tight">
                2. Imbal hasil yang menarik
              </h3>
            </li>

            <li>
              <h3 className="text-[#10565C] text-xl md:text-2xl font-extrabold tracking-tight">
                3. Syarat dan proses yang mudah
              </h3>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
