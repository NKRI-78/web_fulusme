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
    "Umum",
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
        answer: `Fulusme adalah platform Securities Crowd Funding SCF adalah salah satu wadah tempat bertemunya Pemodal dan Penerbit yang dihubungkan dengan teknologi aplikasi, sehingga berikutnya disebut teknologi finansial (Financial Technology/FinTech). Selain itu, sejak tanggal 04 Juli 2022 lalu, Fulusme telah terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK) dengan Nomor SK KEP-45/D.04/2022.`,
      },
      {
        question:
          "Apakah Fulusme merupakan bank atau perusahaan finansial lainnya?",
        answer: `Fulusme bukanlah bank. Fulusme adalah platform yang Mempertemukan Pemodal dan Penerbit Secara Gotong Royong untuk mendanai proyek yang spesifik saja dan tidak ada proses penyimpanan uang seperti bank. Fulusme bisa dijadikan alternatif bisnis yang menguntungkan seperti layaknya pendanaan di pasar modal, karena selain aman, juga memiliki tingkat bagi hasil/bunga yang menarik dalam periode yang cepat/pendek 1- 24 bulan.`,
      },
      {
        question: "Jika bukan bank, apakah aman mendanai di Fulusme?",
        answer: `Meskipun Fulusme bukan bank, tetapi memiliki sistem yang ketat dalam melakukan verifikasi proyek sebelum di danai. Fulusme juga memilki tim yang melakukan analisa resiko berdasarkan hasil kompilasi dan verifikasi data untuk memastikan bahwa proyek yang akan didanai adalah valid dan menguntungkan bagi Pemodal.`,
      },
      {
        question:
          "Mengapa harus mendanai dan mengajukan Pendanaan permodalan di Fulusme?",
        answer: `Dibandingkan lembaga keuangan konvensional, proses pengajuan Pendanaan di Fulusme lebih fleksibel, mudah dan akan dibantu oleh tim kami yang berpengalaman dalam membantu penyiapan dokumen apabila diperlukan. Kecepatan respon terhadap kebutuhan calon Penerbit dan syarat yang mudah, juga merupakan kunci utama. Selain hal tersebut, yang paling penting juga adalah keamanan pendanaan bagi Pendana dan imbal hasil /bunga yang menarik.`,
      },
      {
        question: "Apakah ada denda jika terjadi keterlambatan pembayaran?",
        answer: "Ya, denda ajakan dikenakan sesuai ketentuan yang berlaku",
      },
      {
        question: "Apakah mungkin terjadi gagal bayar (default)?",
        answer: `Segala kemungkinan bisa saja terjadi pada setiap alternatif model pendanaan. Sedari awal, Fulusme berusaha memitigasi segala resiko yang mungkin timbul. Fulusme sedapat mungkin juga melakukan screening yang ketat sebelum memberikan permodalan. Kalaupun akhirnya terjadi gagal bayar, Fulusme akan melakukan pendekatan kepada Penerbit untuk melakukan kewajibannya.`,
      },
      {
        question: "Berapa lama waktu pendanaan/Pendanaan di Fulusme?",
        answer: "Berkisar dari 1 bulan hingga 24 bulan.",
      },
      {
        question: "Apakah Fulusme dapat membantu semua kebutuhan permodalan?",
        answer:
          "Ya, tetapi untuk saat ini hanya membiayai kebutuhan permodalan untuk bisnis/Proyek (B2B) dan UMKM dan melalui proses assesmen tim terlebih dahulu.",
      },
      {
        question: "Berapa besar Pendanaan yang bisa di ajukan?",
        answer:
          "Peminjaman bisa dimulai dari Rp 100 juta hingga maksimal Rp 10 milyar.",
      },
    ],

    Pemodal: [
      {
        question: "Siapa saja yang dapat mendanai di Fulusme?",
        answer: `Warga Negara Indonesia (WNI) atau Warga Negara Asing (WNA) minimal berusia 18 tahun dan Badan Usaha di wilayah Republik Indonesia. Bagi WNI, keabsahan identitas diri akan dibuktikan melalui dokumen KTP dan NPWP. Sedangkan bagi WNA melalui paspor dan rekening bank yang ada di Indonesia. Badan Usaha dibuktikan dengan dokumen lengkap perusahaan yang sah.`,
      },
      {
        question: "Bagaimana proses untuk menjadi pendana?",
        answer: `
          ●	Pertama kali harus mendaftar di bagian registrasi pemodal. Isi data-data yang diminta, kemudian klik “daftar”.\n
          ●	Selanjutnya periksa email anda dan klik link verifikasi yang dikirimkan Fulusme, untuk memastikan bahwa email itu adalah benar milik anda.\n
          ●	Berikutnya anda akan memiliki akun pribadi di Fulusme. Di akun itu anda dapat melihat semua profile proyek yang siap untuk didanaiz.
          `,
      },
      {
        question: "Apakah bisa mendanai beberapa proyek dalam satu waktu?",
        answer:
          "Ya, siapapun bisa mendanai beberapa proyek dalam waktu yang bersamaan (selama quota pendanaan cukup).",
      },
      {
        question: "Bagaimana nilai perhitungan bagi hasil/bunga untuk Pemodal?",
        answer: `Nilai persentase bagi hasil dapat dilihat langsung di setiap marketplace yang ditayangkan. Tetapi nilai tersebut sangat bergantung dari hasil akhir pengelolaan proyek. Oleh karena itu tim Fulusme berusaha sedetil mungkin dalam melakukan analisis, sehingga nilai akhir yang dipersentasekan sebagai nisbah/bunga tidak jauh menyimpang dari yang ditayangkan di awal marketplace.`,
      },
      {
        question:
          "Berapa nilai minimal dan maksimal yang ditetapkan untuk pendanaan di Fulusme?",
        answer: `Model Pendanaan di Fulusme menggunakan istilah Lot, yang nilainya bisa dilihat di halaman marketplace. Untuk minimal dan maksimalnya tergantung dari pendana, berapa banyak mereka akan mendanai Lot nya. Jumlah Lot bisa dilihat di tiap halaman proyek di marketplace.`,
      },
      {
        question: "Apa saja biaya yang timbul saat mendanai di Fulusme?",
        answer: `Untuk saat ini, tidak ada pungutan atau biaya apapun ke pihak Pemodal, terkecuali jika pendanaan tidak terkumpul maksimal disuatu proyek, sehingga terpaksa dilakukan pengembalian/retur oleh pihak Fulusme. Jika ini terjadi, maka biaya transfer retur antar bank akan dibebankan ke pihak Pemodal, sesuai dengan kebijakan biaya antar bank secara real dan Fulusme tidak mengutip sedikitpun dalam hal ini.`,
      },
      {
        question: "Kapankah Pemodal bisa mendapatkan keuntungannya?",
        answer: `Pada akhir periode pendanaan, Pemodal akan menerima pengembalian berupa jumlah dana pokok yang disalurkan dalam Pendanaan kepada Pemodal, serta keuntungan berupa imbal hasil/bunga. Seluruh dana akan ditransfer ke rekening milik Pemodal.`,
      },
      {
        question: "Apakah ada risiko mendanai di Fulusme?",
        answer: `Skenario terburuk tetap mungkin terjadi dan perlu dipertimbangkan. Fulusme menyarankan calon Pemodal untuk berkonsultasi dengan penasihat keuangan sebelum mengambil keputusan. Risiko terbesar yang mungkin terjadi dalam Pendanaan SCF adalah Pemodal tidak menerima kembali dana yang disalurkan dan imbal hasil atau bunga dikarenakan kegagalan pembayaran.`,
      },
      {
        question:
          "Bagaimana antisipasi untuk menekan terjadinya kerugian Pemodal  akibat Penerbit yang mengalami kegagalan pembayaran?",
        answer: `Untuk meminimalisasi risiko kegagalan, Fulusme akan melakukan analisis, seleksi, dan persetujuan berdasarkan sistem credit-scoring dan meminta Jaminan terhadap setiap Pendanaan yang diajukan.`,
      },
    ],
    Penerbit: [
      {
        question: "Apakah yang dimaksud dengan Penerbit?",
        answer:
          "Yang dimaksud dengan Penerbit adalah badan usaha yang memilki proyek atau usaha yang layak untuk dikerjakan dan memiliki nilai bisnis tetapi terkendala dengan permodalan, sehingga membutuhkan dana untuk dikelola sehingga menghasilkan keuntungan secara bisnis.",
      },
      {
        question: "Siapa sajakah yang berhak sebagai Penerbit?",
        answer:
          "Semua perusahaan yang memiliki badan hukum di wilayah negara Republik Indonesia dan dibuktikan dengan dokumen lengkap perusahaan yang sah.",
      },
      {
        question: "Bagaimanakah proses untuk mendapatkan Pendanaan?",
        answer: `
          ●	Pertama kali harus mendaftar di halaman registrasi Penerbit. Isi data-data yang diminta, kemudian klik “daftar”.\n
          ●	Selanjutnya periksa email anda dan klik link verifikasi yang dikirimkan Fulusme, untuk memastikan bahwa email itu adalah benar milik anda.\n
          ●	Berikutnya anda akan memiliki akun pribadi di Fulusme.\n
          ●	Setelah itu anda dapat mengajukan Pendanaan permodalan dengan mengisi aplikasi dan syarat – syarat yang dibutuhkan.
          `,
      },
      {
        question: "Apa saja syarat untuk menjadi Penerbit?",
        answer: `
          ●	Mengisi form  Pengajuan Pendanaan.\n
          ●	Melengkapi dokumen tanda pengenal yang dibutuhkan, seperti KTP.\n
          ●	Melengkapi dokumen perusahaan seperti AKTA dll.\n
          ●	Melengkapi dokumen proyek seperti SPK/Invoice dan dokumen pendukung lainnya, jika ada.
          `,
      },
      {
        question:
          "Berapa lama proses dari mulai submit dokumen hingga pencairan dana?",
        answer: `
          ●	Sejak dari form aplikasi di submit, maka tim kami akan segera mengunjungi perusahaan anda untuk melakukan pencocokan data dan verifikasi.\n
          ●	Jika sudah lolos verifikasi, maka tim internal kami akan melakukan kredit analis untuk menentukan scoring perusahaan anda.\n
          ●	Proses dari mulai aplikasi di submit hingga tayang di marketplace membutuhkan waktu sekitar 4 hari. Jika proyek anda telah lolos verifikasi dan analisis kredit, maka Fulusme akan menayangkan proyek anda di marketplace selama 45 hari. Jika sudah mencukupi/Fully Funded, maka 2 (dua) hari berikutnya kami akan mentransfernya ke rekening Penerbit. Jadi proses yang dibutuhkan adalah sekitar 20 hari.\n
          ●	Apabila sebelum masa tayang 45 hari selesai tetapi dana sudah terkumpul, maka pihak Fulusme akan langsung mentransfer ke pihak Penerbit paling lambat 2 hari setelah dana terkumpul.\n
          `,
      },
      {
        question:
          "Apakah ada fee/biaya untuk mendapatkan Pendanaan bagi Penerbit?",
        answer: `
          Ada. Sejak awal proses pengajuan Pendanaan, semua biaya yang akan dikenakan ke pihak Penerbit adalah biaya yang sudah tersebut di Perjanjian awal dan tidak ada biaya tiba-tiba atau yang disembunyikan. Biaya – biaya tersebut adalah :\n
          ●	Fee Platform untuk Fulusme sebagai penyelenggara layanan Pendanaan SCF sebesar 5% dari total nilai Pendanaan yang disetujui, sebelum di transfer ke Penerbit.\n
          ●	Provisi Asuransi. Jika calon Penerbit tidak memiliki jaminan, maka Fulusme akan merekomendasikan calon Penerbit ke rekanan asuransi Pendanaan yang menjadi rekanan Fulusme. Besarnya nilai provisi yang harus dibayar merupakan tanggungan pihak Penerbit dan nilainya sangat tergantung pada taksiran yang dilakukan oleh pihak asuransi terhadap proyek calon Penerbit.\n
          ● Biaya Notarial.\n
          ● Biaya keanggotaan KSEI.
          `,
      },
      {
        question:
          "Apakah bisa mengajukan Pendanaan lagi di saat Pendanaan proyek sedang berjalan?",
        answer: `TIDAK, anda harus menyelesaikan Pendanaan proyek pertama, dan pengajuan Proyek berikutnya tetapi tetap dengan prosedur dan verifikasi sebagaimana layaknya Pendanaan baru.`,
      },
      {
        question:
          "Apakah seluruh jenis bisnis dapat mengajukan Pendanaan di Fulusme?",
        answer: `Tidak, Fulusme akan berusaha semaksimal mungkin untuk menjaga konsistensi bisnis kami sesuai dengan kaidah . Beberapa contoh industri yang tidak didukung oleh Fulusme adalah yang berasal dari industri perjudian, peternakan babi dan segala turunannya, rokok, segala hal yang terkait dengan minuman keras dan yang memabukkan, obat terlarang, prostitusi, perjudian dan kegiatan yang mengandung keraguan dan spekulasi.`,
      },
      {
        question:
          "Siapa saja instansi yang proyeknya berpotensi memiliki peluang untuk  bisa mendapatkan Pendanaan di Fulusme?",
        answer: `Beberapa contoh proyek yang berasal dari instansi yang memiliki peluang besar  untuk bisa didanai oleh Fulusme adalah Perusahaan Multinasional, perusahaan yang terdaftar di bursa saham, Instansi Pemerintah, Perusahaan swasta dengan riwayat pembayaran yang terkenal baik, dan lain lain.`,
      },
      {
        question:
          "Apakah saya harus memberikan jaminan agar bisa memperoleh  Pendanaan di Fulusme?",
        answer: `Ya. Selain menggunakan jaminan aset (collateral), Untuk lebih mengetahui lebih dalam tentang Fulusme, silakan mengirimkan pesan melalui Contact Us.`,
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
      <section className="relative grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-20 py-20 md:py-40 bg-[url(/images/bg-capbridge.webp)] bg-cover bg-center bg-no-repeat">
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
              src="/images/fulusme-mobile-mockup.webp"
              alt="mockup"
              className="w-56 md:w-[72%] absolute -top-0 md:-top-10 left-1/2 -translate-x-1/2 z-20"
            />

            {/* Gambar investment di bawah */}
            <img
              src="/images/investment-illustration.webp"
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
              src="/images/secure-investment-illustration.webp"
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

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#10565C]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-[#10565C]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <p className="font-semibold text-lg mb-1">
              Belum ada proyek yang berjalan
            </p>
            <p className="text-sm text-gray-500 max-w-md">
              Saat ini belum tersedia proyek investasi aktif. Silakan cek
              kembali dalam waktu dekat untuk peluang investasi terbaru.
            </p>
          </div>
        ) : (
          <GridView
            items={projects}
            gapClass="gap-4"
            breakpointCols={{ sm: 2, md: 3, lg: 4 }}
            itemKey={(p) => p.id}
            renderItem={(p) => <ProjectCard project={p} />}
          />
        )}

        {projects.length > 1 && (
          <button
            onClick={() => {
              router.push("/business-list");
            }}
            className="bg-[#10565C] relative hover:bg-[#0d464b] text-white px-6 py-2 rounded-full font-semibold my-10"
          >
            Lihat Proyek Selengkapnya
          </button>
        )}
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
            FuLusme TIDAK BERTANGGUNG JAWAB terhadap risiko kerugian dan gugatan
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
