"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import type { Swiper as SwiperType } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import Custom404 from "@/app/not-found";

type Project = {
  id: string;
  title: string;
  goal: string;
  medias: {
    id: number;
    path: string;
  }[];
  location: {
    id: number;
    name: string;
    url: string;
    lat: string;
    lng: string;
  };
  doc: {
    id: string;
    path: string;
  };
  capital: string;
  roi: string;
  min_invest: string;
  unit_price: string;
  unit_total: string;
  number_of_unit: string;
  periode: string;
  type_of_bond: string;
  nominal_value: string;
  time_periode: string;
  interest_rate: string;
  interest_payment_schedule: string;
  principal_payment_schedule: string;
  use_of_funds: string;
  collateral_guarantee: string;
  desc_job: string;
  is_apbn: boolean;
  is_approved: boolean;
  company: {
    name: string;
  };
  created_at: string;
  updated_at: string;
};

type Props = {
  id: string;
};

const Sukuk = ({ id }: Props) => {
  console.log(id, "id");

  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [mode, setMode] = useState<"unit" | "nominal">("unit");
  const [unit, setUnit] = useState(1);
  const [nominalInput, setNominalInput] = useState("");

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const hargaUnit = 100000;
  const nominal = unit * hargaUnit;
  const roi = 0.095;
  const keuntungan = nominal * roi;

  const params = useParams();
  // const id = params.id;
  // const id = "fe973f69-6ff4-4157-a3bc-0e04054cf101";
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const handleInputChange = (value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    if (mode === "unit") {
      setUnit(parseInt(numeric) || 0);
    } else {
      setNominalInput(numeric);
      setUnit(Math.floor((parseInt(numeric) || 0) / hargaUnit));
    }
  };

  const formattedKeuntungan = new Intl.NumberFormat("id-ID").format(keuntungan);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${API_BACKEND}/api/v1/project/detail/${id}`,
        );
        setProject(response.data.data);
      } catch (error: any) {
        console.error("Gagal ambil data project:", error);

        // Cek jika error 404
        if (error.response?.status === 400) {
          setIsNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const formatRupiah = (value?: string | number): string => {
    if (value === undefined || value === null) return "-";

    const number = typeof value === "string" ? parseInt(value) : value;

    if (isNaN(number)) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    setHydrated(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (err) {
        console.error("Gagal parsing user dari localStorage", err);
      }
    }
  }, []);

  return isNotFound ? (
    <>
      <Custom404 />
    </>
  ) : (
    <section className="py-28 px-4 md:px-12">
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4 flex text-black items-center gap-2">
              📊 Simulasi
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode("unit")}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    mode === "unit"
                      ? "bg-[#3E268D] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Unit
                </button>
                <button
                  onClick={() => setMode("nominal")}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    mode === "nominal"
                      ? "bg-[#3E268D] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Nominal (Rp)
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="text-black font-medium">
                  Masukkan {mode === "unit" ? "Unit" : "Nominal"}
                </label>
                <input
                  type="text"
                  value={
                    mode === "unit"
                      ? unit.toString()
                      : new Intl.NumberFormat("id-ID").format(
                          parseInt(nominalInput || "0"),
                        )
                  }
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="border px-2 py-1 rounded-md w-40 text-black text-right"
                />
              </div>

              <div className="border-t pt-2">
                <p className="text-xs text-[#677AB9] font-medium">
                  Estimasi ROI (Berdasarkan Proyeksi)
                </p>
                <p className="font-bold text-black">9.5%</p>
              </div>

              <div>
                <p className="text-xs text-[#677AB9] font-medium">Tenor</p>
                <p className="font-bold text-black">{project?.time_periode}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-[#677AB9] font-medium mb-1">
                  Estimasi Keuntungan (Berdasarkan Proyeksi)
                </p>
                <p className="text-black font-bold text-xl">
                  Rp {formattedKeuntungan}
                </p>
              </div>

              <p className="text-[10px] text-gray-500 mt-1">
                * Kinerja Masa lalu tidak menjamin Kinerja Masa depan
              </p>
            </div>
          </div>
        </div>
      )}

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-xl">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              📍 Lokasi
            </h2>

            <p className="text-sm text-black mb-4">
              Blok, Jl. Komp. BSD Blok Rp No.90, Lengkong Wetan, Serpong
              Sub-District, South Tangerang City, Banten 15310
            </p>

            <div className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center text-sm mb-4">
              <input
                type="text"
                value="https://maps.app.goo.gl/Zcm3fjeKTwzKN9Qs9"
                readOnly
                className="bg-transparent w-full outline-none text-black"
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    "https://maps.app.goo.gl/Zcm3fjeKTwzKN9Qs9",
                  )
                }
                className="ml-2 px-2 py-1 text-sm bg-[#677AB9] hover:bg-[#2a1a6a] text-white rounded"
              >
                Salin
              </button>
            </div>
            <a
              href="https://maps.app.goo.gl/Zcm3fjeKTwzKN9Qs9"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm w-full bg-[#677AB9] hover:bg-[#2a1a6a] text-white py-2 rounded-lg font-semibold"
            >
              Go To Maps
            </a>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative rounded-xl overflow-hidden">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              spaceBetween={10}
              thumbs={{ swiper: thumbsSwiper }}
              slidesPerView={1}
              className="rounded-xl"
            >
              {project?.medias.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative">
                    <img
                      src={
                        item.path && item.path.startsWith("https")
                          ? item.path
                          : "/images/default-image.png"
                      }
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    {/* <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                      {item.tags.map((tag, i) => (
                                        <span
                                        key={i}
                                        className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
                                            i === 0 ? 'bg-red-600' : 'bg-indigo-800'
                                        }`}
                                        >
                                        {tag}
                                        </span>
                                    ))}
                    </div> */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mt-4">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={3}
              watchSlidesProgress
              className="cursor-pointer"
            >
              {/* {project.medias.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={item.path}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-md border-2 border-transparent hover:border-blue-500 transition"
                  />
                </SwiperSlide>
              ))} */}
            </Swiper>
          </div>

          <div className="mt-6">
            <h2 className="text-lg text-black font-semibold mb-2">
              Tentang Bisnis
            </h2>
            <p className="text-sm mb-4">{project?.desc_job}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-3 shadow-md space-y-2">
          <div className="bg-white rounded-lg p-2">
            <h3 className="text-xl text-black font-bold">{project?.title}</h3>
            <div className="my-2">
              <div className="flex flex-wrap justify-between">
                <p className="text-xs text-[#677AB9]">Perusahaan</p>
                <p className="text-sm">{project?.company.name}</p>
              </div>
              <div className="flex flex-wrap justify-between">
                <p className="text-xs text-[#677AB9]">Kode Efek</p>
                <p className="text-sm">PPJA1</p>
              </div>
              <div className="flex flex-wrap justify-between">
                <p className="text-xs text-[#677AB9]">Jenis Akad</p>
                <p className="text-sm">Efek Bersifat Utang</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-2 rounded-lg space-y-1">
            <div className="relative w-[90%] h-4 bg-purple-200 rounded-full my-2">
              <div
                className="absolute top-0 left-0 h-4 bg-[#3E268D] rounded-full"
                style={{ width: "100%" }}
              ></div>
              <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 translate-x-full bg-green-500 text-white text-xs font-bold px-2 rounded-full shadow">
                100%
              </span>
            </div>
            <div className="flex flex-wrap justify-between">
              <p className="text-xs font-bold text-[#677AB9]">Dana Terkumpul</p>
              {/* <p className="text-xs font-bold">{project?.danaTerkumpul}</p> */}
            </div>
          </div>

          <div className="bg-white rounded-lg p-2 flex justify-evenly">
            <div className="flex gap-1 flex-col items-center">
              <div className="rounded-full w-4 h-4 flex items-center justify-center bg-[#3E268D] text-white"></div>
              <div className="text-xs text-center font-medium text-gray-900">
                Prelisting
              </div>
            </div>
            <div className="flex gap-1 flex-col items-center">
              <div className="rounded-full w-4 h-4 flex items-center justify-center bg-[#3E268D] text-white"></div>
              <div className="text-xs text-center font-medium text-gray-900">
                Listing
              </div>
            </div>
            <div className="flex gap-1 flex-col items-center">
              <div className="rounded-full w-4 h-4 flex items-center justify-center bg-[#3E268D] text-white"></div>
              <div className="text-xs text-center font-medium text-gray-900">
                Pendanaan Terpenuhi
              </div>
            </div>
            <div className="flex gap-1 flex-col items-center">
              <div className="rounded-full w-4 h-4 flex items-center justify-center bg-[#3E268D] text-white"></div>
              <div className="text-xs text-center font-medium text-gray-900">
                Berjalan
              </div>
            </div>
          </div>

          <div className="bg-white p-2 rounded-lg">
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]"> Kategori Bisnis</p>
              <p className="text-xs">KONTRAKTOR</p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]">Minimal Investasi:</p>
              <p className="text-xs">{formatRupiah(project?.min_invest)}</p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]">Harga Unit:</p>
              <p className="text-xs">{formatRupiah(project?.nominal_value)}</p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]"> Jumlah Unit </p>
              <p className="text-xs">{formatRupiah(project?.number_of_unit)}</p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]"> Total Unit (Rp) </p>
              <p className="text-xs"> {formatRupiah(project?.unit_total)} </p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]">Periode Pengembalian:</p>
              <p className="text-xs">{project?.interest_payment_schedule}</p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]">Tenor:</p>
              <p className="text-xs">{project?.time_periode}</p>
            </div>
            <div className="flex flex-wrap my-2 justify-between">
              <p className="text-xs text-[#677AB9]">ROI (Proyeksi):</p>
              {/* <p className="text-xs">{project.proyeksiROI}</p> */}
            </div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-4 mt-4 text-sm">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-xs text-black border px-4 py-2 rounded-md"
            >
              Simulasi
            </button>
            <button
              className="bg-white text-xs text-black border px-4 py-2 rounded-md"
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => {
                    alert("Link berhasil disalin!");
                    setTimeout(() => {
                      console.log("Alert selesai");
                    }, 2000);
                  })
                  .catch(() => {
                    alert("Gagal menyalin link");
                  });
              }}
            >
              Bagikan
            </button>
            <button
              className="bg-white text-xs text-black border px-4 py-2 rounded-md"
              onClick={() => window.open(project?.doc.path, "_blank")}
            >
              Proposal
            </button>
            <button
              onClick={() => setShowLocationModal(true)}
              className="bg-white text-xs text-black border px-4 py-2 rounded-md"
            >
              Lokasi
            </button>
          </div>

          {hydrated && userData !== null ? (
            <button className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 rounded-md mt-4 cursor-pointer">
              Beli Efek
            </button>
          ) : (
            <button className="w-full bg-gray-300 text-white font-semibold py-2 rounded-md mt-4 cursor-not-allowed">
              Beli Efek
            </button>
          )}

          <p className="text-xs text-center mt-2">
            Butuh Pertanyaan?{" "}
            <a href="#" className="text-blue-600 font-semibold">
              Hubungi Kami
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Sukuk;
