import React from "react";

const PartnersAndMedia: React.FC = () => {
  return (
    <section className="bg-white text-black py-16 px-6 md:px-20 text-center">
      <div className="grid md:grid-cols-2 items-center gap-8 text-left">
        <h2 className="text-2xl relative md:text-3xl font-bold">
          Apa itu Securities <span className="text-[#4CD137]">Crowd</span>{" "}
          <span className="text-[#3C2B90]">Funding?</span>
        </h2>
        <p className="text-gray-600 relative text-sm leading-relaxed">
          <strong>Securities Crowd Funding</strong> merupakan langkah mudah
          bagi Pemodal untuk memilik i bisnis dengan cara cepat dan dijalankan
          oleh praktisi yang berpengalaman di bidangnya, tanpa harus repot
          membangun bisnis baru.
        </p>
      </div>

      <div className="mt-16">
        <h3 className="text-sm relative font-bold text-gray-500 mb-4">
          TELAH DILIPUT OLEH
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <img src="/images/covered/kompas.png" alt="Kompas" className="h-6" />
          <img src="/images/covered/detikcom.png" alt="Detik" className="h-6" />
          <img src="/images/covered/cnbc.png" alt="CNBC" className="h-10" />
          <img
            src="/images/covered/salaam.png"
            alt="Salaam Gateway"
            className="h-6"
          />
          <img
            src="/images/covered/kontancoid.png"
            alt="Kontan"
            className="h-6"
          />
          <img
            src="/images/covered/dailysocialid.png"
            alt="Dailysocial"
            className="h-6"
          />
          <img
            src="/images/covered/bisnis.png"
            alt="Bisnis.com"
            className="h-6"
          />
        </div>

        <h3 className="text-sm relative text-center font-bold text-gray-500 mt-10">
          DIDUKUNG OLEH
        </h3>

        <div className="flex flex-wrap justify-center items-center gap-8 mt-6">
          <img
            src="/images/supportby/kominfo.png"
            alt="Kominfo"
            className="h-32"
          />
          <img
            src="/images/supportby/danamon.png"
            alt="Danamon"
            className="h-24"
          />
          <img src="/images/supportby/aludi.png" alt="ALUDI" className="h-24" />
          <img src="/images/supportby/ksei.png" alt="KSEI" className="h-24" />
          <img src="/images/supportby/pse.png" alt="PSE" className="h-24" />
          <img
            src="/images/supportby/pefindo.png"
            alt="PEFINDO"
            className="h-24"
          />
          <img
            src="/images/supportby/rapidssl.png"
            alt="RapidSSL"
            className="h-24"
          />
        </div>
      </div>
    </section>
  );
};

export default PartnersAndMedia;
