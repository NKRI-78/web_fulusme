import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECURE = process.env.NODE_ENV === "production";

// Valid roles the backend can assign to a new user.
const ASSIGNABLE_ROLES = new Set(["investor", "investor institusi", "emiten"]);

// POST /api/auth/role-sync — called AFTER the client has successfully POSTed to
// /api/v1/auth/assign/role on the backend. Syncs the role into our session
// cookies so the UI and proxy reflect the backend-confirmed assignment.
//
// Security constraints:
//  - User must be authenticated (auth_token present)
//  - Only the "user" → {assignable role} transition is allowed (no lateral movement)
//  - Role must be one of the known valid values
//
// TRANSITIONAL: Phase 2 should replace this with a server-to-backend call that
// reads the authoritative role from the backend profile/me endpoint instead of
// trusting the request body.
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const sessionRaw = cookieStore.get("session")?.value;

  if (!token || !sessionRaw) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { role } = await req.json();

  if (typeof role !== "string" || !ASSIGNABLE_ROLES.has(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const current = JSON.parse(sessionRaw);

  // Only allow the transition from the default unassigned role ("user").
  // Prevents lateral movement between assigned roles.
  if (current.role !== "user") {
    return NextResponse.json(
      { message: "Role already assigned" },
      { status: 403 },
    );
  }

  const updated = { ...current, role };

  const res = NextResponse.json({ data: updated });

  const httpOnlyOpts = {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  res.cookies.set("auth_role", role, httpOnlyOpts);
  res.cookies.set("session", JSON.stringify(updated), httpOnlyOpts);

  return res;
}
