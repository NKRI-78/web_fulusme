"use client";

import React, { useEffect } from "react";

const TermsConditions: React.FC = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold text-[#10565C] pt-20 py-6">
        Syarat dan Ketentuan
      </h1>

      <div className="w-full max-w-4xl flex-1 rounded-lg overflow-hidden shadow-md border">
        <iframe
          src="/document/syarat.html"
          width="100%"
          height="100%"
          style={{
            border: "none",
            background: "white",
          }}
          title="Syarat dan Ketentuan"
        />
      </div>
    </div>
  );
};

export default TermsConditions;
