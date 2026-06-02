import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND;
const SECURE = process.env.NODE_ENV === "production";

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("auth_refresh")?.value;

  if (!refresh) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BACKEND}/api/v1/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!backendRes.ok) {
    const err = await backendRes.json().catch(() => ({}));
    const res = NextResponse.json(err, { status: backendRes.status });
    // Clear tokens on failed refresh so proxy redirects to login
    res.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    res.cookies.set("auth_refresh", "", { maxAge: 0, path: "/" });
    return res;
  }

  const payload = await backendRes.json();
  const newToken: string = payload.data.token;
  const newRefresh: string = payload.data.refresh;

  const res = NextResponse.json({ token: newToken });

  const opts = { httpOnly: true, secure: SECURE, sameSite: "lax" as const, path: "/" };
  res.cookies.set("auth_token", newToken, { ...opts, maxAge: 60 * 60 });
  res.cookies.set("auth_refresh", newRefresh, { ...opts, maxAge: 60 * 60 * 24 * 7 });

  return res;
}
