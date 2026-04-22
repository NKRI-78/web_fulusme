import ChangePasswordFormState from "@/app/components/auth/change-password/ChangePasswordFormState";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | Fulusme",
  description:
    "Atur ulang kata sandi akun Fulusme Anda dengan memasukkan email yang terdaftar.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Lupa Kata Sandi | Fulusme",
    description: "Atur ulang kata sandi akun Fulusme Anda.",
    type: "website",
  },
};

export default function page() {
  return <ChangePasswordFormState />;
}
