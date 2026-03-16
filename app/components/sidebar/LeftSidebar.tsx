"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";
import { ChevronRight, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { setShowLogoutModal } from "@redux/slices/modalSlice";

const LeftSidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();

  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 z-[110]">
      <div className="flex items-center gap-2 mb-4">
        <img
          src={"/favicon.ico"}
          alt=""
          className="w-10 rounded-full bg-slate-200"
        />
        <h2 className="text-md font-bold">{"fullname"}</h2>
      </div>

      <ul>
        <li className="mb-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="hover:text-gray-400 w-full text-left flex items-center justify-between"
          >
            <span>Features</span>
            {showDropdown ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {showDropdown && (
            <ul className="ml-4 mt-2 max-h-64 overflow-y-auto pr-2">
              {[
                "nik",
                "register",
                "cek-kk",
                "cek-pos",
                "trace-nik",
                "trace-imei",
                "nopol",
                "noka",
                "nosin",
                "pln",
                "e-wallet",
                "cek-rekening",
                "imei-2-phone",
                "phone-2-imei",
                "gsm-tracker",
                "bill",
                "phising",
                "cek-imei",
              ].map((feature) => (
                <li key={feature} className="mb-2">
                  <Link
                    href={`/features/${feature}`}
                    className={`hover:text-gray-300 ${
                      isActive(`/features/${feature}`)
                        ? "text-green-400 font-bold"
                        : ""
                    }`}
                  >
                    {feature
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li className="mb-4">
          <Link
            href="/"
            className={`hover:text-gray-400 ${
              isActive("/") ? "text-green-400 font-bold" : ""
            }`}
          >
            Home
          </Link>
        </li>

        <li className="mb-4">
          <Link
            href="/auth/profile"
            className={`hover:text-gray-400 ${
              isActive("/auth/profile") ? "text-green-400 font-bold" : ""
            }`}
          >
            Profile
          </Link>
        </li>

        <li className="mb-4">
          <Link
            href="/auth/change-password"
            className={`hover:text-gray-400 ${
              isActive("/auth/change-password")
                ? "text-green-400 font-bold"
                : ""
            }`}
          >
            Change Password
          </Link>
        </li>

        <li className="mb-4">
          <button
            onClick={() => dispatch(setShowLogoutModal(true))}
            className="hover:text-gray-400"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
