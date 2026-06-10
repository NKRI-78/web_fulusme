"use client";

import React from "react";

type NpwpProps = {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  onDetected?: (npwp: string) => void;
  onFail?: (reason?: string) => void;
};

export default function NPWPOCR({ onUpload }: NpwpProps) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    try {
      await onUpload(e);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="max-w-2xl space-y-4 my-3">
      <h1 className="text-lg font-semibold">NPWP FILE</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}
