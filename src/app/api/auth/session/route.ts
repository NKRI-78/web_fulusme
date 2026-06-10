import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECURE = process.env.NODE_ENV === "production";

const SESSION_OPTS = {
  httpOnly: true,
  secure: SECURE,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

// PATCH /api/auth/session — update only non-privileged session display fields.
// SECURITY: role is explicitly excluded — role must only be set by the
// login/refresh Route Handlers which get it from the backend response.
// Accepting role from the client body would allow any authenticated user to
// escalate to "emiten" by POSTing {"role": "emiten"}.
export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionRaw = cookieStore.get("session")?.value;

  if (!sessionRaw || !cookieStore.get("auth_token")?.value) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const current = JSON.parse(sessionRaw);
  const body: Record<string, unknown> = await req.json();

  // Whitelist: only fields that don't affect authorization decisions
  const allowed = {
    ...(typeof body.fulfilled_registration === "boolean" && {
      fulfilled_registration: body.fulfilled_registration,
    }),
  };

  const merged = { ...current, ...allowed };

  const res = NextResponse.json({ data: merged });
  res.cookies.set("session", JSON.stringify(merged), SESSION_OPTS);

  return res;
}
