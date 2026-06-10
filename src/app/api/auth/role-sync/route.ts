import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND;
const SECURE = process.env.NODE_ENV === "production";

// Valid roles the backend can assign to a new user.
const ASSIGNABLE_ROLES = new Set(["investor", "investor institusi", "emiten"]);

// POST /api/auth/role-sync — called AFTER the client has successfully POSTed to
// /api/v1/auth/assign/role on the backend. Fetches the authoritative role from
// the backend profile endpoint and syncs it into our session cookies so the UI
// and proxy reflect the backend-confirmed assignment.
//
// Security: role is NOT accepted from request body. Instead, we fetch the user's
// current profile from the backend using their auth token, extract the role from
// the backend's response, and validate it before writing to cookies. This ensures
// the backend actually granted the role — client cannot forge role assignment.
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const sessionRaw = cookieStore.get("session")?.value;

  if (!token || !sessionRaw) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
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

  // Fetch authoritative role from backend using the user's token
  const backendRes = await fetch(`${API_BACKEND}/api/v1/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: "Failed to fetch user profile from backend" },
      { status: backendRes.status },
    );
  }

  const profileData = await backendRes.json().catch(() => ({}));
  const role = profileData.data?.role;

  if (typeof role !== "string" || !ASSIGNABLE_ROLES.has(role)) {
    return NextResponse.json(
      { message: "Invalid role from backend" },
      { status: 400 },
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
