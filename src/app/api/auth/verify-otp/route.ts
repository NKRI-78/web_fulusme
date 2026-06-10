import { NextRequest, NextResponse } from "next/server";

const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND;

const SECURE = process.env.NODE_ENV === "production";

const httpOnlyOpts = {
  httpOnly: true,
  secure: SECURE,
  sameSite: "lax" as const,
  path: "/",
};

// POST /api/auth/verify-otp — proxies OTP verification to the backend and, on
// success, refreshes the httpOnly auth cookies from the verified payload (the
// backend returns the post-verification account state: verify/enabled flags
// plus rotated tokens).
export async function POST(req: NextRequest) {
  const { val, otp } = await req.json();

  const backendRes = await fetch(`${API_BACKEND}/api/v1/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ val, otp }),
  });

  const payload = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(payload, { status: backendRes.status });
  }

  const auth = payload.data;

  const session = {
    id: auth.id,
    enabled: auth.enabled,
    email: auth.email,
    role: auth.role,
    verify: auth.verify,
    fulfilled_registration: auth.fulfilled_registration,
  };

  const res = NextResponse.json({ data: session });

  // Tokens stored httpOnly — not readable by JS
  if (auth.token) {
    res.cookies.set("auth_token", auth.token, {
      ...httpOnlyOpts,
      maxAge: 60 * 60, // 1 hour
    });
  }
  if (auth.refresh) {
    res.cookies.set("auth_refresh", auth.refresh, {
      ...httpOnlyOpts,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  if (auth.role) {
    res.cookies.set("auth_role", auth.role, {
      ...httpOnlyOpts,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  // Non-sensitive session info for client display (no tokens)
  res.cookies.set("session", JSON.stringify(session), {
    ...httpOnlyOpts,
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
