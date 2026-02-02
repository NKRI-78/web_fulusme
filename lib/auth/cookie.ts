import { cookies } from "next/headers";
import { encrypt, decrypt } from "./crypto";
import { IS_PROD } from "@/app/utils/constant";
import { UserSession } from "../../app/features/auth/types/session";

export const AUTH_COOKIE_NAME = IS_PROD ? "__Host-session" : "session";
const ONE_WEEK = 60 * 60 * 24 * 7;

type CookieOptions = {
  maxAge?: number;
};

export async function setAuthCookie(
  user: UserSession,
  options?: CookieOptions,
) {
  const encrypted = encrypt(user);
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: encrypted,
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: options?.maxAge ?? ONE_WEEK,
  });
}

export async function getAuthCookie(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const encrypted = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!encrypted) return null;

  try {
    return decrypt(encrypted);
  } catch {
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
