import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthDataResponse } from "./app/interfaces/auth/auth";

export function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  // 🔒 Redirect jika sudah login tapi akses login page
  if (userCookie && pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔒 Protect private routes
  if (
    !userCookie &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/create-project") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/dokumen-pelengkap"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔒 Role-based access
  if (userCookie) {
    const session = JSON.parse(userCookie) as AuthDataResponse;

    if (
      (pathname.startsWith("/create-project") ||
        pathname.startsWith("/dokumen-pelengkap")) &&
      session.role !== "emiten"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/dashboard/:path*",
    "/create-project",
    "/dokumen-pelengkap",
    "/profile",
  ],
};
