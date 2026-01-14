"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BellRing, Menu, X } from "lucide-react";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadSession } from "@redux/slices/authSlice";
import Link from "next/link";
import Modal from "@/app/helper/Modal";
import RegisterV2 from "../auth/register/RegisterV2";
import RegisterOtp from "../auth/register/RegisterOtp";
import RegisterSelectRole from "../auth/register/RegisterSelectRole";
import Cookies from "js-cookie";
import axios from "axios";
import Tippy from "@tippyjs/react";
import { User } from "@/app/interfaces/user/IUser";
import {
  FORM_INDEX_CACHE_KEY,
  FORM_PENERBIT_1_CACHE_KEY,
  FORM_PENERBIT_2_CACHE_KEY,
  FORM_PIC_CACHE_KEY,
} from "@/app/(defaults)/form-penerbit/form-cache-key";
import { getUser } from "@/app/lib/auth";
import { createSocket } from "@/app/utils/sockets";
import { fetchInboxThunk } from "@/redux/slices/inboxSlice";
import { API_BACKEND } from "@/app/utils/constant";
import { setBadge } from "@/redux/slices/badgeSlice";
import Image from "next/image";

const PRIMARY_COLOR = "#10565C";
const ON_PRIMARY_COLOR = "#FFFFFF";
const ACTIVE_COLOR = "#16EDFF";

const NavbarV2: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const dispatch = useDispatch<AppDispatch>();

  const [userData, setUserData] = useState<AuthDataResponse | null>(null);

  const [hydrated, setHydrated] = useState(false);

  const [step, setStep] = useState<
    "register" | "otp" | "role" | "login" | null
  >(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const closeModal = () => setStep(null);

  // setLoadingUser(true);

  const user = getUser();

  const badgeCount = useSelector((state: RootState) => state.badge.badgeCount);

  useEffect(() => {
    console.log("user token");
    console.log(user?.id);

    const socket = createSocket(user?.id ?? "-");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("Socket connected user id :", user?.id ?? "-");
    });

    socket.on("inbox-update", async () => {
      console.log("Test");
      const inboxes = await dispatch(fetchInboxThunk(user?.token ?? "-"));

      dispatch(
        setBadge(
          Array.isArray(inboxes?.payload)
            ? inboxes.payload.filter((inbox) => !inbox.is_read).length
            : 0
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(loadSession());
  }, []);

  useEffect(() => {
    setHydrated(true);
    // const userCookie = getUser();

    try {
      setUserData(user);
    } catch (err) {
      console.error("Failed to parse user cookie", err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      axios
        .get(`${API_BACKEND}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then((res) => {
          setProfile(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
        });
    }
  }, [userData]);

  const fetchAndUpdateBadge = async () => {
    if (user?.token) {
      const inboxes = await dispatch(fetchInboxThunk(user?.token));

      dispatch(
        setBadge(
          Array.isArray(inboxes?.payload)
            ? inboxes.payload.filter((inbox) => !inbox.is_read).length
            : 0
        )
      );
    }
  };

  useEffect(() => {
    fetchAndUpdateBadge();
  }, [user?.token, dispatch]);

  //* remove cookie & cache data
  const removeData = () => {
    //* penerbit
    localStorage.removeItem(FORM_INDEX_CACHE_KEY);
    localStorage.removeItem(FORM_PIC_CACHE_KEY);
    localStorage.removeItem(FORM_PENERBIT_1_CACHE_KEY);
    localStorage.removeItem(FORM_PENERBIT_2_CACHE_KEY);

    //* pemodal
    localStorage.removeItem("formPemodal");

    //* user
    Cookies.remove("user");
    localStorage.removeItem("user");
  };

  //* close menu via tombol esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setMenuOpen]);

  const getAvatar = (): string => {
    if (profile) {
      if (profile.avatar !== "-") return profile.avatar;
      if (profile.selfie !== "-") return profile.selfie;
    }
    return "/images/default-image.png";
  };

  return (
    <>
      <Nav sticky={isSticky}>
        <NavLayout>
          <NavLogo sticky={isSticky} />

          {hydrated && loadingUser ? (
            <div className="text-white">loading</div>
          ) : (
            <>
              {hydrated && userData !== null ? (
                //
                // TAMPILAN NAV BAR KETIKA USER SUDAH LOGIN / REGISTER
                //
                <>
                  {/* MUNCUL KETIKA MD KEATAS (TAMPILAN DEKSTOP & TABLET) */}
                  {/* NAMA & BUTTON NOTIFIKASI & BUTTON DRAWER */}
                  <div className="flex items-center gap-4">
                    {userData.role !== "user" ? (
                      <Link href={"/profile"}>
                        <div className="hidden md:flex items-center gap-x-3 px-4 py-2 bg-[#0c484d] rounded-full hover:bg-[#0b363a] transition-colors duration-500">
                          <p className="text-white text-sm">
                            {profile?.fullname}
                          </p>
                          <img
                            src={getAvatar()}
                            alt="Foto Profile"
                            width={28}
                            height={28}
                            loading="lazy"
                            className="rounded-full object-cover w-[30px] h-[30px]"
                          />
                        </div>
                      </Link>
                    ) : (
                      <Link href={"/dashboard/main"}>
                        <div className="hidden md:flex items-center gap-x-3 px-4 py-2 bg-[#0c484d] rounded-full hover:bg-[#0b363a] transition-colors duration-500 cursor-pointer">
                          <p className="text-white text-sm">
                            {profile?.fullname}
                          </p>
                        </div>
                      </Link>
                    )}
                    {/* hanya muncul ketika ia suah register tapi belum memilih role */}
                    {/* {userData && userData.role === "user" && step !== "role" && (
                  <div className="hidden md:block">
                    <button
                      onClick={() => setStep("role")}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold animate-pulse"
                    >
                      Anda Belum Memilih Peran
                    </button>
                  </div>
                )} */}

                    <NotifIcon
                      badgeCount={badgeCount}
                      className={
                        isSticky
                          ? `text-[${PRIMARY_COLOR}]`
                          : `text-[${ON_PRIMARY_COLOR}]`
                      }
                    />

                    <DrawerButton
                      isOpen={menuOpen}
                      onClick={toggleMenu}
                      className={
                        isSticky
                          ? `text-[${PRIMARY_COLOR}]`
                          : `text-[${ON_PRIMARY_COLOR}]`
                      }
                    />
                  </div>

                  {/* DRAWER */}
                  {/* MUNCUL KETIKA MD KEBAWAH (TAMPILAN MOBILE) */}
                  {/* TAMPILAN MENU DALAM BENTUK VERTIKAL */}
                  <div
                    className={`fixed top-0 right-0 h-full w-64 bg-[#10565C] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    `}
                  >
                    {/* tulisan Fulusme navigasi ke home */}
                    <Link
                      href={"/"}
                      className={`text-xl text-center font-bold text-white`}
                    >
                      FuLusme
                    </Link>

                    {/* menu */}
                    <ul className="flex flex-col gap-6 text-white text-base font-semibold pt-16">
                      {/* hanya muncul ketika user belum memilih role */}
                      {/* {userData && userData.role === "user" && step !== "role" && (
                    <div className="block md:hidden">
                      <button
                        onClick={() => setStep("role")}
                        className="px-3 py-1 rounded-md bg-red-500 text-white text-sm font-semibold animate-pulse"
                      >
                        Anda Belum Memilih Peran
                      </button>
                    </div>
                  )} */}

                      {/* <li onClick={toggleMenu}>
                    <Link
                      href="/"
                      className={
                        pathname == "/"
                          ? `text-[${ACTIVE_COLOR}]`
                          : `text-[${ON_PRIMARY_COLOR}]`
                      }
                    >
                      Beranda
                    </Link>
                  </li> */}

                      <li onClick={toggleMenu}>
                        <Link
                          href="/dashboard"
                          className={
                            pathname == "/dashboard"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Dashboard
                        </Link>
                      </li>

                      <li onClick={toggleMenu}>
                        <Link
                          href="/informasi"
                          className={
                            pathname == "/informasi"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Informasi
                        </Link>
                      </li>

                      <li onClick={toggleMenu}>
                        <Link
                          href="/terms-conditions"
                          className={
                            pathname == "/terms-conditions"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Syarat dan Ketentuan
                        </Link>
                      </li>

                      <div className="w-fit flex md:hidden items-center gap-x-3 px-4 py-2 bg-[#0c484d] rounded-full hover:bg-[#0b363a] transition-colors duration-500">
                        <p className="text-white text-sm">
                          {profile?.fullname}
                        </p>
                        <img
                          src={getAvatar()}
                          alt="Foto Profile"
                          width={28}
                          height={28}
                          loading="lazy"
                          className="rounded-full object-cover w-[30px] h-[30px]"
                        />
                      </div>

                      <li
                        onClick={() => {
                          removeData();
                          window.location.href = "/auth/login";
                        }}
                      >
                        <Link
                          href="/auth/login"
                          className="px-5 py-2 rounded-lg bg-red-500 text-white"
                        >
                          Keluar
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* BARRIER OVERLAY KETIKA DRAWER DIBUKA */}
                  {menuOpen && (
                    <div
                      onClick={toggleMenu}
                      className="fixed inset-0 bg-black bg-opacity-40 z-30"
                    />
                  )}
                </>
              ) : (
                //
                // TAMPILAN NAV BAR KETIKA USER BELUM LOGIN / REGISTER
                //
                <>
                  {/* MUNCUL KETIKA MD KEATAS (TAMPILAN DEKSTOP & TABLET) */}
                  {/* TAMPILAN MENU DALAM BENTUK HORIZONTAL */}
                  <ul className="hidden md:flex gap-4 items-center text-sm lg:text-base">
                    {/* <li>
                  <Link
                    href="/"
                    className={pathname == "/" ? "font-semibold" : ""}
                  >
                    Beranda
                  </Link>
                </li> */}
                    <li>
                      <Link
                        href="/informasi"
                        className={
                          pathname == "/informasi" ? "font-semibold" : ""
                        }
                      >
                        Informasi
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/business-list"
                        className={
                          pathname == "/business-list" ? "font-semibold" : ""
                        }
                      >
                        Daftar Bisnis
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about-us"
                        className={
                          pathname == "/about-us" ? "font-semibold" : ""
                        }
                      >
                        Tentang Kami
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms-conditions"
                        className={
                          pathname == "/terms-conditions" ? "font-semibold" : ""
                        }
                      >
                        Syarat dan Ketentuan
                      </Link>
                    </li>
                    <li className="w-fit">
                      <Link
                        href={"/auth/login"}
                        className={`px-5 py-[9px] rounded-md ${
                          isSticky
                            ? `bg-[${PRIMARY_COLOR}] text-white border-2 border-[${PRIMARY_COLOR}]`
                            : `bg-white text-[${PRIMARY_COLOR}] border-2 border-white`
                        }`}
                      >
                        Masuk
                      </Link>
                    </li>
                    <li className="w-fit">
                      <div
                        className={`px-5 py-[6px] rounded-md ${
                          isSticky
                            ? `border-2 border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}]`
                            : `border-2 border-[${ON_PRIMARY_COLOR}] text-[${ON_PRIMARY_COLOR}]`
                        } cursor-pointer`}
                        onClick={() => {
                          setStep("register");
                          // setStep("role");
                        }}
                      >
                        Daftar
                      </div>
                    </li>
                  </ul>

                  {/* MUNCUL KETIKA MD KEBAWAH (TAMPILAN MOBILE) */}
                  {/* BUTTON NOTIFIKASI & BUTTON DRAWER */}
                  <div className="md:hidden flex items-center gap-4">
                    <NotifIcon
                      badgeCount={badgeCount}
                      className={
                        isSticky
                          ? `text-[${PRIMARY_COLOR}]`
                          : `text-[${ON_PRIMARY_COLOR}]`
                      }
                    />
                    <DrawerButton
                      isOpen={menuOpen}
                      onClick={toggleMenu}
                      className={
                        isSticky
                          ? `text-[${PRIMARY_COLOR}]`
                          : `text-[${ON_PRIMARY_COLOR}]`
                      }
                    />
                  </div>

                  {/* DRAWER */}
                  {/* MUNCUL KETIKA MD KEBAWAH (TAMPILAN MOBILE) */}
                  {/* TAMPILAN MENU DALAM BENTUK VERTIKAL */}
                  <div
                    className={`fixed top-0 right-0 h-full w-64 bg-[${PRIMARY_COLOR}] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    md:hidden`}
                  >
                    {/* tulisan Fulusme navigasi ke home */}
                    <Link
                      href={"/"}
                      className={`text-xl text-center font-bold text-white`}
                    >
                      FuLusme
                    </Link>

                    {/* menu */}
                    <ul className="flex flex-col gap-6 text-white text-sm font-semibold pt-16">
                      {/* <li onClick={toggleMenu}>
                    <Link
                      href="/"
                      className={
                        pathname == "/"
                          ? `text-[${ACTIVE_COLOR}]`
                          : `text-[${ON_PRIMARY_COLOR}]`
                      }
                    >
                      Beranda
                    </Link>
                  </li> */}
                      <li onClick={toggleMenu}>
                        <Link
                          href="/informasi"
                          className={
                            pathname == "/informasi"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Informasi
                        </Link>
                      </li>
                      <li onClick={toggleMenu}>
                        <Link
                          href="/business-list"
                          className={
                            pathname == "/business-list"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Daftar Bisnis
                        </Link>
                      </li>
                      <li onClick={toggleMenu}>
                        <Link
                          href="/about-us"
                          className={
                            pathname == "/about-us"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Tentang Kami
                        </Link>
                      </li>
                      <li onClick={toggleMenu}>
                        <Link
                          href="/terms-conditions"
                          className={
                            pathname == "/terms-conditions"
                              ? `text-[${ACTIVE_COLOR}]`
                              : `text-[${ON_PRIMARY_COLOR}]`
                          }
                        >
                          Syarat dan Ketentuan
                        </Link>
                      </li>

                      <li className="w-fit" onClick={toggleMenu}>
                        <Link href="/auth/login">
                          <div
                            className={`px-8 py-2 rounded-md bg-white text-[${PRIMARY_COLOR}]`}
                          >
                            Masuk
                          </div>
                        </Link>
                      </li>

                      <li
                        className="w-fit"
                        onClick={() => {
                          toggleMenu();
                          setStep("register");
                        }}
                      >
                        <div
                          className={`px-8 py-2 rounded-md bg-transparent text-white border border-gray-200`}
                        >
                          Daftar
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* BARRIER OVERLAY KETIKA DRAWER DIBUKA */}
                  {menuOpen && (
                    <div
                      onClick={toggleMenu}
                      className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    />
                  )}
                </>
              )}
            </>
          )}
        </NavLayout>
      </Nav>

      <Modal isOpen={step === "register"} onClose={closeModal}>
        <RegisterV2 onNext={() => setStep("otp")} onClose={closeModal} />
      </Modal>
      <Modal isOpen={step === "otp"} onClose={closeModal}>
        <RegisterOtp onNext={() => setStep("role")} onClose={closeModal} />
      </Modal>
      <Modal isOpen={step === "role"} onClose={closeModal}>
        <RegisterSelectRole onClose={closeModal} />
      </Modal>
    </>
  );
};

//* navbar
const Nav: React.FC<{ children?: React.ReactNode; sticky: boolean }> = ({
  children,
  sticky = false,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        sticky ? "bg-white text-[#10565C] shadow-md" : "bg-[#10565C]"
      }`}
    >
      {children}
    </div>
  );
};

//* navbar layout
const NavLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-between items-center px-10 py-4">
      {children}
    </div>
  );
};

//* navbar logo
const NavLogo: React.FC<{ sticky?: boolean }> = ({ sticky }) => {
  return (
    <Link href={"/"}>
      <img
        src={
          sticky
            ? "/images/logo-fulusme-vertical.png"
            : "/images/logo-fulusme-vertical-white.png"
        }
        alt="FuLusme Logo"
        className="h-9"
      />
    </Link>
  );
};

//* notification icon
const NotifIcon: React.FC<{ className?: string; badgeCount: number }> = ({
  className,
  badgeCount = 0,
}) => {
  return (
    <Tippy
      content="Inbox"
      className="bg-black/50 text-sm font-medium backdrop-blur-md px-4 py-1 rounded-md text-white"
    >
      <Link href="/inbox" className="relative inline-block">
        <BellRing size={18} className={className} />
        {badgeCount > 0 && (
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </Link>
    </Tippy>
  );
};

//* drawer button
const DrawerButton: React.FC<{
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}> = ({ className, onClick, isOpen = false }) => {
  return (
    <button onClick={onClick}>
      {isOpen ? <X size={24} /> : <Menu size={24} className={className} />}
    </button>
  );
};

export default NavbarV2;
