"use client";

import React, { useEffect } from "react";
import { Download } from "lucide-react";

const TermsConditions: React.FC = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="w-full py-28 bg-white flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-[#10565C] mb-6">
        Syarat dan Ketentuan
      </h1>

      <div className="relative w-full max-w-4xl h-[500px]">
        <a
          href="/document/terms-and-conditions.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
          title="Download PDF"
          className="
        absolute top-3 right-4 z-10
        p-2 rounded-full
        bg-white border border-[#10565C]
        text-[#10565C]
        shadow-sm
        hover:bg-[#10565C] hover:text-white
        transition
      "
        >
          <Download size={18} />
        </a>

        <div className="w-full h-full rounded-lg overflow-hidden shadow-md border">
          <iframe
            src="/document/terms-and-conditions.html"
            className="w-full h-full"
            style={{ border: "none", background: "white" }}
            title="Syarat dan Ketentuan"
          />
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
