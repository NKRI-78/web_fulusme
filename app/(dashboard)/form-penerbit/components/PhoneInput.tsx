import React, { useState, useMemo, useRef, useEffect } from "react";
import { kodeArea } from "../KodeWilayah";

export type PhoneValue = {
  kode: string; // misal "021"
  nomor: string; // misal "12345678"
};

type PhoneInputProps = {
  value?: PhoneValue;
  onChange?: (val: PhoneValue) => void;
};

const flattenKodeArea = Object.entries(kodeArea).flatMap(
  ([kode, wilayahList]) => wilayahList.map((wilayah) => ({ kode, wilayah }))
);

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedCode = value?.kode ?? "62"; // default indonesia
  const phone = value?.nomor ?? "";

  const filteredList = useMemo(() => {
    return flattenKodeArea.filter((item) =>
      item.wilayah.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // dismiss on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nomor = e.target.value.replace(/\D/g, "");
    onChange?.({ kode: selectedCode, nomor });
  };

  const handleSelectCode = (kode: string) => {
    onChange?.({ kode, nomor: phone });
    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex border rounded-lg">
        {/* Dropdown kode area */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="px-3 py-2 bg-gray-100 border-r flex items-center gap-2"
          >
            <span>+{selectedCode}</span>
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Cari wilayah..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm focus:outline-none"
                />
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {filteredList.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectCode(item.kode)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <span className="font-medium">+{item.kode}</span> –{" "}
                    <span className="text-gray-600">{item.wilayah}</span>
                  </li>
                ))}
                {filteredList.length === 0 && (
                  <li className="px-3 py-2 text-gray-400 text-sm">
                    Tidak ditemukan
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Input nomor telp */}
        <input
          type="tel"
          placeholder="812 **** ****"
          value={phone}
          onChange={handlePhoneChange}
          className="flex-1 px-3 py-2 focus:outline-none"
        />
      </div>
    </div>
  );
};
