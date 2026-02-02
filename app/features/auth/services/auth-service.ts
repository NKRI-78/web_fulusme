import { UserSession } from "../types/session";
import { mutate } from "swr";

type ErrorCase =
  | "user_not_found"
  | "password_incorrect"
  | "email_or_password_is_empty"
  | "error";

type LoginServiceResponse = {
  ok: boolean;
  title: string;
  message: string;
  session?: UserSession;
  case?: ErrorCase;
  originalMessage?: string;
};

export async function loginUser(
  email?: string,
  password?: string,
): Promise<LoginServiceResponse> {
  if (!email || !password) {
    return {
      ok: false,
      title: "Form Belum Lengkap",
      message:
        "Email atau password belum diisi. Silakan lengkapi terlebih dahulu.",
      case: "email_or_password_is_empty",
    };
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Login gagal");
    }

    const message = data.session.email
      ? `Berhasil masuk sebagai ${data.session.email}`
      : "Selamat datang kembali. Anda berhasil masuk ke akun Anda.";

    return {
      ok: true,
      title: "Login Berhasil",
      message: message,
      session: data.session,
    };
  } catch (error: any) {
    const incorrectPassword = error.message === "CREDENTIALS_IS_INCORRECT";
    const userNotFound = error.message === "USER_NOT_FOUND";

    const errTitle = incorrectPassword
      ? "Kata Sandi Salah"
      : userNotFound
        ? "Email Tidak Ditemukan"
        : "Login Gagal";

    const errMessage = incorrectPassword
      ? "Kata sandi yang Anda masukkan tidak sesuai. Silakan periksa kembali dan coba lagi."
      : userNotFound
        ? "Email yang Anda masukkan tidak terdaftar atau tidak sesuai. Silakan periksa kembali alamat email Anda."
        : (error.message ?? "Terjadi kesalahan saat login.");

    const errCase = incorrectPassword
      ? "password_incorrect"
      : userNotFound
        ? "user_not_found"
        : "error";

    return {
      ok: false,
      title: errTitle,
      message: errMessage,
      originalMessage: error.message,
      case: errCase,
    };
  }
}

export async function logoutUser() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  mutate("/api/auth/me", null, false);
}
