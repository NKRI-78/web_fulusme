"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "@/app/components/project/ProjectCard";
// import { IProjectData } from "@/app/interface/IProject";
import Cookies from "js-cookie";
import { getAllProject } from "@/actions/GetAllProject";
import Modal from "@/app/helper/Modal";
import RegisterOtp from "../auth/register/RegisterOtp";
import RegisterSelectRole from "../auth/register/RegisterSelectRole";
import RegisterV2 from "../auth/register/RegisterV2";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { InboxResponse } from "../notif/inbox-interface";
import { useDispatch } from "react-redux";
import { setBadge } from "@/redux/slices/badgeSlice";
import { Project } from "@/app/interfaces/project/IProject";
import GridView from "../GridView";
import { HelpButton, HelpButtonPosition } from "./HelpButton";

const HomeV2: React.FC = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"Umum" | "Pemodal" | "Penerbit">(
    "Umum"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [step, setStep] = useState<"register" | "otp" | "role" | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTopVideos = async () => {
      setLoading(true);
      const res = await getAllProject();
      setProjects(res?.data ?? []);
      setLoading(false);
    };

    fetchTopVideos();
  }, []);

  function getUserToken(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;

    const userJson = JSON.parse(userCookie);
    return userJson.token;
  }

  function getUserId(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null; // ✅ tambahkan return

    const userJson = JSON.parse(userCookie);
    return userJson.id;
  }

  const faqData = {
    Umum: [
      {
        question: "Apa itu FuLusme?",
        answer:
          "FuLusme adalah Penyelenggara Layanan Urun Dana Berbasis Teknologi Informasi (Securities Crowdfunding) yang merupakan tempat bertemunya Pemodal dan Penerbit dalam satu wadah platform.",
      },
      {
        question: "Apa itu Efek?",
        answer:
          "Efek adalah surat berharga seperti saham, obligasi, atau surat utang lainnya yang dapat diperdagangkan di pasar modal.",
      },
      {
        question: "Apa itu Lembaga Penyimpanan dan Penyelesaian?",
        answer:
          "• Lembaga Penyimpanan dan Penyelesaian (LPP) adalah pihak yang menyelenggarakan kegiatan kustodian sentral bagi bank kustodian, perusahaan efek, dan pihak lain.\n • Fungsi LPP pada kegiatan Layanan Urun Dana antara lain: \n - Mengadministrasikan efek yang ditawarkan Penerbit \n - Menyelesaikan transaksi efek setelah terjadi pembelian oleh Pemodal \n - Mendistribusikan efek yang telah dibeli untuk dapat disimpan di rekening efek milik Pemodal yang ada Bank Kustodian \n • LPP dalam Layanan Urun Dana ini menggunakan Kustodian Sentral Efek Indonesia (KSEI).",
      },
    ],
    Pemodal: [
      {
        question: "Apa itu Pemodal?",
        answer:
          "Anda bisa mendaftar di platform FuLusme, melakukan verifikasi, dan mulai berinvestasi pada proyek yang tersedia.",
      },
      {
        question: "Bagaimana cara berinvestasi di FuLusme?",
        answer:
          "Untuk berinvestasi, langkah pertama Anda harus memiliki akun di FuLusme. Berikut tata cara pembuatan Akun Pemodal : \n • Daftarkan diri Anda pada tautan berikut. \n • Masukkan data diri anda, email, dan nomor ponsel yang anda pakai \n • Setelah memasukkan nomor ponsel pada langkah pertama, anda akan diminta memasukkan kode OTP yang dikirimkan ke nomor ponsel anda \n • Kemudian masukkan kata sandi yang ingin anda gunakan \n • Anda harus membaca dan menyetujui syarat dan ketentuan kami sebelum mendaftarkan diri. Kemudian akan dikirimkan email verifikasi pada email yang anda masukkan \n • Verifikasi email dan kemudian masuk menggunakan Email dan kata sandi anda. \n • Langkah berikutnya adalah proses KYC yang berada di posisi sebelah kiri Dashboard, dimana Anda harus mengisi semua tahapan dan pertanyaan yang ada. Setelah Anda mengisi semua data pada proses KYC, maka akan dilakukan verifikasi data oleh tim FuLusme yang memerlukan waktu 2x24 jam di hari kerja. \n • Anda akan menerima pemberitahuan via email terkait status verifikasi data Anda. Jika data Anda sudah terverifikasi, maka Anda dapat mulai berinvestasi di FuLusme.",
      },
      {
        question: "Apa yang dimaksud dengan Prospekstus?",
        answer:
          "Prospektus adalah seluruh informasi penting dan relevan mengenai penawaran investasi yang ditawarkan Penerbit untuk membantu Pemodal dalam membuat keputusan investasi.",
      },
    ],
    Penerbit: [
      {
        question: "Apa itu Penerbit?",
        answer:
          "Penerbit adalah pihak yang mencari pendanaan melalui platform FuLusme dengan menawarkan efek kepada publik.",
      },
      {
        question:
          "Bagaimana jika masa penawaran (45 Hari) berakhir namun pendanaan belum terkumpul?",
        answer:
          "• TIDAK ada masa penambahan jangka waktu penawaran sesuai dengan POJK Nomor 57/2020. \n • Jika penghimpunan dana tidak mencapai batas minimum pendanaan yang telah disepakati, maka proses kerjasama batal demi hukum dan dana investasi akan dikembalikan 100% kepada Pemodal. \n • Jika penghimpunan dana telah mencapai batas minimum pendanaan yang telah disepakati, maka kerjasama akan tetap dilanjutkan sesuai minimum pendanaan yang terkumpul",
      },
    ],
  };

  useEffect(() => {
    const shouldShowOtp = localStorage.getItem("showOtp");
    if (shouldShowOtp === "true") {
      setShowOtpModal(true);
      setStep("otp");
      localStorage.removeItem("showOtp");
    }

    const shouldShowRole = localStorage.getItem("showSelectRole");
    if (shouldShowRole === "true") {
      setShowOtpModal(true);
      setStep("role");
      localStorage.removeItem("showSelectRole");
    }
  }, []);

  const handleClose = () => {
    setShowOtpModal(false);
    setStep(null);
  };

  const userToken = getUserToken();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-20 py-20 md:py-40 bg-[url(/images/bg-capbridge.png)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-[#218AC2]/70 to-[#10565C]/70 z-0" />
        {/* Left content */}
        <div className="space-y-6 z-10 relative text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight ">
            Fund the Future <br /> Together
          </h1>
          <p className="text-white text-base md:text-lg leading-relaxed italic">
            "Ide Hebat Layak Diperjuangkan. Bantu wujudkan mimpi besar, satu
            kontribusi kecil pada satu waktu. Gabung bersama ribuan pendukung
            yang percaya pada perubahan."
          </p>

          {isClient && !getUserToken() && (
            <button
              className="text-white text-lg bg-[#10565C] hover:bg-[#0c4246] focus:ring-1 focus:ring-white rounded-lg px-6 py-3 me-2 mb-2 dark:bg-[#10565C] dark:hover:bg-[#0c4246] focus:outline-none dark:focus:ring-white font-extrabold"
              onClick={() => {
                setStep("register");
                setShowOtpModal(true);
              }}
            >
              DAFTAR SEKARANG
            </button>
          )}

          {/* Logos */}
          <div className="flex justify-center md:justify-start gap-6 items-center">
            <h3>Berizin & Diawasi oleh: </h3>
            <img src="/images/ojk.png" alt="OJK Logo" className="h-12" />
            <img
              src="/images/kominfo.png"
              alt="kominfo Logo"
              className="h-12"
            />
            <img src="/images/ksei.png" alt="ksei Logo" className="h-12 w-28" />
          </div>
        </div>

        {/* Right Stats */}
        <div className="mt-10 md:mt-0 z-10 relative text-white flex justify-center md:justify-end">
          <div className="relative w-fit">
            {/* Mockup HP di atas */}
            <img
              src="/images/IPHONEMOCKUP.png"
              alt="mockup"
              className="w-56 md:w-[72%] absolute -top-0 md:-top-10 left-1/2 -translate-x-1/2 z-20"
            />

            {/* Gambar investment di bawah */}
            <img
              src="/images/investment.png"
              alt="investment"
              className="w-72 md:w-[150%] relative z-10"
            />
          </div>
        </div>
      </section>

      <section className="bg-white relative text-black pt-14 pb-5 px-6 text-center md:px-16">
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-10 md:gap-y-0">
          {/* Gambar */}
          <div className="basis-full md:basis-6/12">
            <img
              className="w-3/4 md:w-full mx-auto"
              src="/images/secure-investment.png"
              alt="Secure Investment"
            />
          </div>

          {/* Konten */}
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

      {/* Investment Project Section */}
      <section className="bg-white relative text-black py-12 px-6 text-center md:px-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          Investasi Proyek Yang Sedang Berjalan
        </h2>
        <p className="text-center text-sm mb-10">
          Lihat daftar investasi bisnis terbaru yang sedang berlangsung dan
          temukan peluang untuk berinvestasi hari ini.
        </p>

        <GridView
          items={projects}
          gapClass="gap-4"
          breakpointCols={{ sm: 2, md: 3, lg: 4 }}
          itemKey={(p) => p.id}
          renderItem={(p, i) => {
            return <ProjectCard project={p} />;
          }}
        />

        <button
          onClick={() => {
            router.push("/business-list");
          }}
          className="bg-[#10565C] relative hover:bg-[#0d464b] text-white px-6 py-2 rounded-full font-semibold my-10"
        >
          Lihat Proyek Selengkapnya
        </button>
      </section>

      <section className="bg-white text-black py-16 px-6 md:px-20 text-center">
        <div className="grid md:grid-cols-2 items-center gap-8 text-left">
          <h2 className="text-2xl relative md:text-3xl font-bold">
            Apa itu Securities <span className="text-[#4CD137]">Crowd</span>{" "}
            <span className="text-[#3C2B90]">Funding?</span>
          </h2>
          <p className="text-gray-600 relative text-sm leading-relaxed">
            <strong>Securities Crowd Funding</strong> merupakan langkah mudah
            bagi Pemodal untuk memiliki bisnis dengan cara cepat dan dijalankan
            oleh praktisi yang berpengalaman di bidangnya, tanpa harus repot
            membangun bisnis baru.
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-sm relative font-bold text-gray-500 mb-4">
            TELAH DILIPUT OLEH
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <img
              src="/images/covered/kompas.png"
              alt="Kompas"
              className="h-6"
            />
            <img
              src="/images/covered/detikcom.png"
              alt="Detik"
              className="h-6"
            />
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
            <img
              src="/images/supportby/aludi.png"
              alt="ALUDI"
              className="h-24"
            />
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

      <section className="text-black py-16 px-6 md:px-20" id="faq">
        <div className="text-center mb-10">
          <h2 className="relative text-2xl font-bold mb-2">FAQ</h2>
          <p className="relative text-sm text-gray-600">
            Pertanyaan yang sering ditanyakan
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {(["Umum", "Pemodal", "Penerbit"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setOpenIndex(null);
              }}
              className={`px-6 py-2 relative cursor-pointer rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#10565C] text-white"
                  : "border border-[#10565C] text-[#10565C] hover:bg-[#0d464b] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqData[activeTab].map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group relative cursor-pointer bg-white rounded-lg border border-gray-300 shadow-sm transition hover:bg-gray-50"
              >
                <div className="flex justify-between items-center px-6 py-5">
                  <span className="font-semibold text-base">
                    {item.question}
                  </span>
                  <span
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                <div
                  className={`px-6 text-sm text-gray-600 transition-all duration-300 ${
                    isOpen
                      ? "max-h-[500px] py-4 opacity-100"
                      : "max-h-0 py-0 opacity-0"
                  } overflow-hidden`}
                >
                  {item.answer.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white text-black px-6 md:px-20 py-16">
        <h2 className="text-2xl relative font-bold text-center mb-6">
          DISCLAIMER
        </h2>
        <div className="max-h-[500px] relative  overflow-y-scroll p-6 border border-gray-300 rounded-lg space-y-4 text-justify text-sm leading-relaxed">
          <p className="text-1xl">
            PT Fintek Andalan Solusi Teknologi (FuLusme) adalah Penyelenggara
            Layanan Urun Dana melalui Penawaran Efek Berbasis Teknologi
            Informasi (Securities Crowdfunding) sebagaimana tunduk pada
            ketentuan Peraturan Otoritas Jasa Keuangan NOMOR 57/POJK.04/2020
            tentang Penawaran Efek Melalui Layanan Urun Dana Berbasis Teknologi
            Informasi atau Securities Crowdfunding (“POJK 57/2020”), yang telah
            berizin dan diawasi OJK, kami menyatakan bahwa :
          </p>
          <p>
            “OTORITAS JASA KEUANGAN TIDAK MEMBERIKAN PERNYATAAN MENYETUJUI ATAU
            TIDAK MENYETUJUI EFEK INI, TIDAK JUGA MENYATAKAN KEBENARAN ATAU
            KECUKUPAN INFORMASI DALAM LAYANAN URUN DANA INI. SETIAP PERNYATAAN
            YANG BERTENTANGAN DENGAN HAL TERSEBUT ADALAH PERBUATAN MELANGGAR
            HUKUM”;
          </p>
          <p>
            “INFORMASI DALAM LAYANAN URUN DANA INI PENTING DAN PERLU MENDAPAT
            PERHATIAN SEGERA. APABILA TERDAPAT KERAGUAN PADA TINDAKAN YANG AKAN
            DIAMBIL, SEBAIKNYA BERKONSULTASI DENGAN PENYELENGGARA.”; dan
          </p>
          <p>
            PENERBIT DAN PENYELENGGARA, BAIK SENDIRI-SENDIRI MAUPUN
            BERSAMA-SAMA, BERTANGGUNG JAWAB SEPENUHNYA ATAS KEBENARAN SEMUA
            INFORMASI YANG TERCANTUM DALAM LAYANAN URUN DANA INI
          </p>
          <p>
            1. Anda perlu mempertimbangkan dengan cermat, teliti dan seksama
            setiap investasi bisnis yang akan Anda lakukan di FuLusme,
            berdasarkan pengetahuan, keilmuan serta pengalaman yang Anda miliki
            dalam hal keuangan dan bisnis. Dibutuhkan kajian/penelaahan laporan
            keuangan, target tujuan investasi, kemampuan analisis, serta
            pertimbangan risiko yang akan Anda ambil.
          </p>
          <p>
            Anda menyadari bahwa setiap bisnis pasti memiliki risikonya
            masing-masing. Untuk itu, dengan berinvestasi melalui FuLusme, Anda
            sudah mengerti akan segala resiko yang dapat terjadi di kemudian
            hari, seperti penurunan performa bisnis, hingga kebangkrutan dari
            bisnis yang anda investasikan tersebut.
          </p>
          <p>
            FuLusmeTIDAK BERTANGGUNG JAWAB terhadap risiko kerugian dan gugatan
            hukum serta segala bentuk risiko lain yang timbul dikemudian hari
            atas hasil investasi bisnis yang anda tentukan sendiri saat ini.
            Beberapa risiko yang dapat terjadi saat Anda berinvestasi yaitu :
          </p>
          <div>
            <p className="font-bold text-md">Risiko Usaha</p>
            <p className="my-1">
              {" "}
              Risiko adalah suatu hal yang tidak dapat dihindari dalam suatu
              usaha/bisnis. Beberapa risiko bisa terjadi karena berubahnya
              permintaan pasar dan proyeksi keuangan bisnis bisa saja tidak
              sesuai dengan proposal bisnis ketika dijalankan{" "}
            </p>
          </div>
          <div>
            <p className="font-bold text-md">Kerugian Investasi</p>
            <p className="my-1">
              Setiap investasi memiliki tingkat risiko yang bervariasi seperti
              tidak terkumpulnya dana investasi yang dibutuhkan selama proses
              pengumpulan dana atau proyek yang dijalankan tidak menghasilkan
              keuntungan sesuai yang diharapkan.
            </p>
          </div>
          <div>
            <p className="font-bold text-md">Kekurangan Likuiditas</p>
            <p className="my-1">
              Investasi Anda di suatu Penerbit, mungkin saja tidak likuid dan
              tidak mudah dijual kembali karena Efek yang ditawarkan tidak
              terdaftar di bursa umum secara publik. Ini berarti bahwa Anda
              mungkin tidak dapat dengan mudah menjual Efek Anda di bisnis
              tertentu atau Anda mungkin tidak dapat menemukan pembeli sebelum
              berakhirnya jangka waktu investasi di pasar sekunder.
            </p>
          </div>
          <div>
            <p className="font-bold text-md">Kelangkaan Pembagian Dividen</p>
            <p className="my-1">
              Setiap Pemodal yang ikut berinvestasi berhak untuk mendapatkan
              dividen sesuai dengan jumlah kepemilikan Efek. Dividen (imbal
              hasil) ini akan diberikan oleh Penerbit dengan jadwal pembagian
              yang telah disepakati di awal dan dapat dicek di detail bisnis.
              Kelangkaan pembagian dividen bahkan gagal bayar dapat terjadi
              karena kinerja bisnis yang Anda investasikan bisa jadi kurang
              berjalan dengan baik.
            </p>
          </div>
          <div>
            <p className="font-bold text-md">Dilusi Kepemilikan Efek</p>
            <p className="my-1">
              Dilusi kepemilikan Efek adalah penurunan persentase kepemilikan
              Efek yang terjadi karena bertambahnya total jumlah Efek yang
              beredar, dimana Investor yang bersangkutan tidak ikut membeli Efek
              yang baru diterbitkan tersebut. Penerbit dapat menerbitkan Efek
              baru jika jumlah penawaran yang diajukan masih dibawah batas
              maksimum. Jika Penerbit mengadakan urun dana lagi dan terjadi
              penerbitan Efek baru, maka FuLusme akan membuka bisnis tersebut di
              website FuLusme dan menginformasikan kepada semua pemegang Efek.
            </p>
          </div>
          <div>
            <p className="font-bold text-md">Perubahan Status Efek Syariah</p>
            <p className="my-1">
              Risiko yang timbul adanya Penerbit melanggar atau tidak lagi
              memenuhi kriteria Efek Syariah. Penerbit yang listing di platform
              FuLusme sudah melalui proses screening dari tim analis bisnis
              FuLusme. Penerbit yang dipilih berdasarkan rekam jejak bisnis yang
              baik dan memenuhi standar dalam kesesuaian kriteria prinsip
              syariah yang diputuskan dalam persetujuan akhir oleh Dewan
              Pengawas Syariah. Dalam hal ini FuLusme sebagai penyelenggara akan
              memonitoring kepada Penerbit secara berkala.
            </p>
          </div>
          <div>
            <p className="font-bold text-md">Kegagalan Sistem Elektronik</p>
            <p className="my-1">
              FuLusme telah menerapkan sistem teknologi informasi dan keamanan
              data yang handal. Namun bagaimanapun juga tetap memungkinkan jika
              terjadi gangguan sistem teknologi informasi dan kegagalan sistem,
              jika ini terjadi maka akan menyebabkan aktivitas bisnis Anda di
              platform FuLusme menjadi tertunda.
            </p>
            <p className="my-1">
              2. Semua materi terkait pilihan investasi yang tercantum dalam
              situs ini sebatas informasi dan tidak dapat dianggap sebagai
              nasihat, dukungan, ataupun rekomendasi investasi. Perusahaan
              sebagai penyedia layanan urun dana hanya terbatas pada fungsi
              administratif. Pemodal harus sepenuhnya menyadari adanya risiko
              kelangkaan pembayaran dividen di kemudian hari dan risiko-risiko
              lainnya{" "}
            </p>
            <p className="my-1">
              3. Penyelenggara dengan persetujuan dari masing-masing Pengguna
              (Pemodal dan / atau Penerbit) mengakses, memperoleh, menyimpan,
              mengelola, dan / atau menggunakan data pribadi Pengguna
              ("Pemanfaatan Data") pada atau di dalam benda, perangkat
              elektronik (termasuk smartphone atau telepon seluler), perangkat
              keras (hardware) maupun lunak (software), dokumen elektronik,
              aplikasi atau sistem elektronik milik Pengguna atau yang dikuasai
              Pengguna, dengan memberitahukan tujuan, batasan, dan mekanisme
              Pemanfaatan Data tersebut kepada Pengguna yang bersangkutan
              sebelum memperoleh persetujuan yang dimaksud sesuai kebutuhan
              layanan urun dana
            </p>
            <p className="my-1">
              4. Semua materi terkait pilihan investasi yang tercantum dalam
              situs ini sebatas informasi dan tidak dapat dianggap sebagai
              nasihat, dukungan, ataupun rekomendasi investasi. Perusahaan
              sebagai penyedia layanan urun dana hanya terbatas pada fungsi
              administratif. Pemodal harus sepenuhnya menyadari adanya risiko
              kelangkaan pembayaran dividen di kemudian hari dan risiko-risiko
              lainnya{" "}
            </p>
            <p className="my-1">
              5. FuLusme bertindak sebagai Penyelenggara Layanan Urun Dana,
              bukan sebagai pihak yang menjalankan kegiatan usaha atau proyek
              Penerbit. Otoritas Jasa Keuangan bertindak sebagai regulator dan
              pemberi izin, pengawas Penyelenggara, bukan sebagai penjamin
              investasi.
            </p>
          </div>
        </div>
      </section>
      {/* <section className="bg-white text-black px-6 md:px-20 py-10">
        <h2 className="text-2xl relative font-bold text-center mb-6">
          DISCLAIMER
        </h2>

        <div className="h-[80vh] relative overflow-hidden p-2 border border-gray-300 rounded-lg space-y-4 text-justify text-sm leading-relaxed shadow-md">
          <iframe
            src="/document/disclaimer.html"
            width="100%"
            height="100%"
            style={{
              border: "none",
              background: "white",
              minHeight: "80vh",
            }}
            title="Disclaimer"
          />
        </div>
      </section> */}

      {/* <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://wa.me/6283814333442"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-[#29a71a] text-white px-4 py-2 font-bold rounded-full shadow-lg"
        >
          <img src="/images/wa.png" alt="WA" className="w-5 h-5 mr-2" />
          Butuh Bantuan?
        </a>
      </div> */}
      <HelpButtonPosition>
        <HelpButton />
      </HelpButtonPosition>

      <Modal
        isOpen={showOtpModal}
        onClose={handleClose}
        // title={step === "otp" ? "Verifikasi OTP" : "Pilih Role"}
      >
        {step === "register" && (
          <RegisterV2 onNext={() => setStep("otp")} onClose={handleClose} />
        )}
        {step === "otp" && (
          <RegisterOtp onNext={() => setStep("role")} onClose={handleClose} />
        )}
        {step === "role" && <RegisterSelectRole onClose={handleClose} />}
      </Modal>
    </div>
  );
};

export default HomeV2;
