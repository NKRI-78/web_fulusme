"use client";

import CircularProgressIndicator from "@/app/components/CircularProgressIndicator";
import { Broadcast } from "@/app/interfaces/broadcast/IBroadcast";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/id";
import { useParams } from "next/navigation";

const BroadcastDetailView = () => {
  const params = useParams();

  const { broadcastId } = params;

  const [loading, setLoading] = useState(true);

  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);

  //* fetch data
  useEffect(() => {
    setLoading(true);
    const fetchBroadcast = async () => {
      try {
        const res = await axios.get(
          `${API_BACKEND}/api/v1/broadcast/detail/${broadcastId}`
        );
        const broadcastData = res.data.data;
        setBroadcast(broadcastData);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Mendapatkan Broadcast",
          text: "Terjadi kesalahan saat mengambil data broadcast. Silakan coba lagi.",
          confirmButtonText: "Coba Lagi 🔄",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            fetchBroadcast();
          }
        });
      }
    };
    fetchBroadcast();
  }, [broadcastId]);

  return (
    <div className="py-28 px-8 lg:px-24 bg-white">
      {loading ? (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center">
          <CircularProgressIndicator textDescription="Memuat Halaman" />
        </div>
      ) : (
        <div className="w-full space-y-4 text-black">
          <img
            src={broadcast?.path}
            alt={`Gambar ${broadcast?.title}`}
            className="w-full max-h-[350px] object-cover border border-gray-300 rounded-lg"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== window.location.origin + "/images/img.jpg") {
                target.src = "/images/img.jpg";
              }
            }}
          />

          <p className="text-lg md:text-2xl lg:text-3xl font-black">
            {broadcast?.title}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {moment(broadcast?.created_at).locale("id").format("LLLL")}
          </p>

          <p className="text-sm text-gray-600">{broadcast?.content}</p>
        </div>
      )}
    </div>
  );
};

export default BroadcastDetailView;
