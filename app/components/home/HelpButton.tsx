"use client";

import { useState } from "react";
import Image from "next/image";

export function HelpButton() {
  const [expand, setExpand] = useState(false);

  return (
    <a
      href="https://wa.me/6283814333442"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        bg-[#29a71a] text-white rounded-full shadow-md onclick-effect
        flex items-center justify-center overflow-hidden
        transition-all duration-500 ease-in-out
        h-12
        ${expand ? "md:w-[170px] md:px-4" : "w-12"}
      `}
      onMouseEnter={() => window.innerWidth >= 768 && setExpand(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setExpand(false)}
    >
      {expand ? (
        <span className="hidden md:inline whitespace-nowrap text-sm font-semibold">
          Butuh Bantuan?
        </span>
      ) : (
        <Image
          src={"/images/logo-whatsapp.webp"}
          alt="Logo WA"
          width={24}
          height={24}
          className="invert"
        />
      )}
    </a>
  );
}

export function HelpButtonPosition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="fixed bottom-6 right-6 z-20">{children}</div>;
}
