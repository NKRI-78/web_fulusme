import { NextRequest, NextResponse } from "next/server";

const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND;

const SECURE = process.env.NODE_ENV === "production";

const httpOnlyOpts = {
  httpOnly: true,
  secure: SECURE,
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(req: NextRequest) {
  const { fullname, email, phone, password } = await req.json();

  const backendRes = await fetch(`${API_BACKEND}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, phone, password }),
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
  res.cookies.set("auth_token", auth.token, {
    ...httpOnlyOpts,
    maxAge: 60 * 60, // 1 hour
  });
  res.cookies.set("auth_refresh", auth.refresh, {
    ...httpOnlyOpts,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  res.cookies.set("auth_role", auth.role, {
    ...httpOnlyOpts,
    maxAge: 60 * 60 * 24 * 7,
  });

  // Non-sensitive session info for client display (no tokens)
  res.cookies.set("session", JSON.stringify(session), {
    ...httpOnlyOpts,
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
