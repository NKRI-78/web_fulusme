"use client";

import React, { useState } from "react";

type FaqTab = "Umum" | "Pemodal" | "Penerbit";

const faqData: Record<FaqTab, { question: string; answer: string }[]> = {
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
          ●	Pertama kali harus mendaftar di bagian registrasi pemodal. Isi data-data yang diminta, kemudian klik "daftar".\n
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
          ●	Pertama kali harus mendaftar di halaman registrasi Penerbit. Isi data-data yang diminta, kemudian klik "daftar".\n
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

const FaQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FaqTab>("Umum");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
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
                <span className="font-semibold text-base">{item.question}</span>
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
  );
};

export default FaQ;
