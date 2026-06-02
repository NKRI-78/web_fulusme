import Cookies from "js-cookie";
import { clearTokenCache } from "@/utils/tokenCache";

export interface SessionData {
  id: string;
  enabled: boolean;
  email: string;
  role: string;
  verify: boolean;
  fulfilled_registration: boolean;
}

// Reads non-sensitive session info from the client-readable 'session' cookie.
// Tokens (access + refresh) are stored httpOnly and never exposed to JS.
export function getUser(): SessionData | null {
  const raw = Cookies.get("session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

// Update non-privileged session fields (fulfilled_registration only).
// Role is explicitly excluded — use syncRole() after a successful backend
// role-assignment call instead.
export async function saveAuthUser(
  updates: Pick<SessionData, "fulfilled_registration">,
): Promise<void> {
  await fetch("/api/auth/session", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

// Sync the user's role into session cookies AFTER the backend has confirmed the
// assignment via /api/v1/auth/assign/role. Only user → assigned-role transitions
// are accepted server-side; lateral movement is blocked.
export async function syncRole(role: string): Promise<void> {
  await fetch("/api/auth/role-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

// Clears all auth cookies (httpOnly + session) via the logout Route Handler,
// and wipes the in-memory token cache so the next request doesn't reuse a
// stale Bearer token.
export async function removeAuthUser(): Promise<void> {
  clearTokenCache();
  await fetch("/api/auth/logout", { method: "POST" });
}
