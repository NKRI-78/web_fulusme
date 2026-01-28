"use client";

import CircularProgressIndicator from "@/app/components/CircularProgressIndicator";
import { Broadcast } from "@/app/interfaces/broadcast/IBroadcast";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BroadcastCard from "./BroadcastCard";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";

const BroadcastView = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  //* fetch data
  useEffect(() => {
    setLoading(true);
    const fetchBroadcast = async () => {
      try {
        const res = await axios.get(`${API_BACKEND}/api/v1/broadcast/list`);
        const broadcastData = res.data.data as Broadcast[];
        const mappedBroadcasts = broadcastData.map((broadcast) => ({
          ...broadcast,
          is_read: false,
        }));
        setBroadcasts(mappedBroadcasts);
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
  }, []);

  //* mark as read
  const markAsRead = (id: number) => {
    const updatedBroadcasts = broadcasts.map((broadcast) => {
      if (id === broadcast.id) {
        return { ...broadcast, is_read: true };
      }
      return broadcast;
    });
    setBroadcasts(updatedBroadcasts);
  };

  return (
    <div className="py-28 px-8 lg:px-24">
      {loading ? (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center">
          <CircularProgressIndicator textDescription="Memuat Halaman" />
        </div>
      ) : broadcasts.length === 0 ? (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center text-gray-500">
          <Inbox className="w-16 h-16 mb-4 text-gray-400" />
          <h2 className="text-lg font-semibold">Belum Ada Informasi</h2>
          <p className="text-sm">
            Belum ada informasi atau pengumuman terbaru.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xl font-black">Informasi</p>
          {broadcasts.map((broadcast, i) => (
            <BroadcastCard
              key={i}
              broadcast={broadcast}
              onClick={() => {
                markAsRead(broadcast.id);
                router.push(`/informasi/${broadcast.id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BroadcastView;
