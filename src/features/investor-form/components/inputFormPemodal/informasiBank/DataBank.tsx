import React from "react";

interface DataBankProps {
  data: {
    namaBank: string;
    nomorRekening: string;
    namaPemilik: string;
    cabangBank: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DataBank: React.FC<DataBankProps> = ({ data, onChange }) => {
  const handleNorekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,15}$/.test(value)) {
      onChange(e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Informasi Rekening Bank</h2>

      <input
        type="text"
        name="namaBank"
        placeholder="Nama Bank (misal: BCA)"
        value={data.namaBank}
        onChange={onChange}
        className="border p-2 w-full mb-4"
      />

      <input
        type="text"
        name="nomorRekening"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Masukkan Nomor Rekening (maks 15 digit)"
        value={data.nomorRekening}
        onChange={handleNorekChange}
        className="border p-2 w-full mb-4"
      />

      <input
        type="text"
        name="namaPemilik"
        placeholder="Masukkan Nama Pemilik Rekening"
        value={data.namaPemilik}
        onChange={onChange}
        className="border p-2 w-full mb-4"
      />

      <input
        type="text"
        name="cabangBank"
        placeholder="Masukkan Cabang Bank"
        value={data.cabangBank}
        onChange={onChange}
        className="border p-2 w-full"
      />
    </div>
  );
};

export default DataBank;
