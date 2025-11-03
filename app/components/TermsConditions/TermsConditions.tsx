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
    <div className="w-full py-28 bg-white flex flex-col justify-center items-center gap-8">
      <h1 className="text-2xl font-bold text-[#10565C]">
        Syarat dan Ketentuan
      </h1>

      <div className="w-full max-w-4xl h-[500px] rounded-lg overflow-hidden shadow-md border">
        <iframe
          src="/document/syarat.html"
          className="w-full h-full"
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
