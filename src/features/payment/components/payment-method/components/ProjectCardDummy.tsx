"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface ProjectCheckoutProps {
  title: string;
  company: string;
  location: string;
  locationUrl?: string;
  unitPrice: number;
  minInvest: number;
  roi: string;
  tenor: string;
  image: string;
  amountInvested: number; // 🔹 Nominal investasi
}

const ProjectCardCheckout: React.FC<ProjectCheckoutProps> = ({
  title,
  company,
  location,
  locationUrl,
  unitPrice,
  minInvest,
  roi,
  tenor,
  image,
  amountInvested,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Gambar */}
        <div className="relative w-full h-40 md:h-full md:col-span-1">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Detail */}
        <div className="p-5 md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{company}</p>

            {/* Nominal Investasi */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 text-white">
              <span className="text-xs opacity-90 text-gray-500">
                Nominal Investasi Anda
              </span>
              <p className="text-xl font-extrabold text-[#10565C]">
                Rp{amountInvested.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500 text-xs">Harga Unit</span>
                <p className="font-semibold text-gray-900">
                  Rp{unitPrice.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500 text-xs">Minimal Investasi</span>
                <p className="font-semibold text-gray-900">
                  Rp{minInvest.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500 text-xs">Tenor</span>
                <p className="font-semibold text-gray-900">{tenor}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500 text-xs">ROI (Proyeksi)</span>
                <p className="font-semibold text-green-600">{roi}%</p>
              </div>

              {/* Lokasi */}
              <div className="col-span-2 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-gray-500 text-xs block">Lokasi</span>
                  <p className="font-semibold text-gray-900">{location}</p>
                </div>
                {locationUrl && (
                  <a
                    href={locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 text-xs font-medium hover:bg-blue-600 hover:text-white transition"
                  >
                    <MapPin className="h-4 w-4" />
                    Lihat Lokasi
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardCheckout;
