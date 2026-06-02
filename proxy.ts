import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Read httpOnly cookies — not forgeable by client JS
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("auth_role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = Boolean(token);

  // Redirect already-logged-in users away from login page
  if (isAuthenticated && pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect private routes
  if (
    !isAuthenticated &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/create-project") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/dokumen-pelengkap"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role-based access: only emiten may access project creation / supplemental docs
  if (
    isAuthenticated &&
    (pathname.startsWith("/create-project") ||
      pathname.startsWith("/dokumen-pelengkap")) &&
    role !== "emiten"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
