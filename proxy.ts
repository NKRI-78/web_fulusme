import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  if (
    !userCookie &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/create-project") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/dokumen-pelengkap"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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
    "/dashboard/:path*",
    "/create-project",
    "/dokumen-pelengkap",
    "/profile",
  ],
};
