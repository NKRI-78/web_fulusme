import { Construction } from "lucide-react";

export default function PasarSekunderPage() {
  return (
    <div className="py-28 bg-white">
      <div className="max-w-3xl h-96 mx-auto px-4 flex flex-col items-center text-center justify-center gap-4">
        <Construction size={56} className="text-[#10565C]" strokeWidth={1.75} />

        <h1 className="text-2xl sm:text-3xl font-semibold text-[#10565C]">
          Pasar Sekunder
        </h1>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Fitur Pasar Sekunder saat ini masih dalam tahap pengembangan.
          Nantinya, fitur ini memungkinkan investor untuk memperjualbelikan
          kepemilikan investasi secara aman dan transparan antar pengguna.
        </p>
      </div>
    </div>
  );
}
