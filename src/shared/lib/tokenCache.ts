// Shared in-memory token cache used by both axios instances.
// Bridges the gap between httpOnly cookies (unreadable by JS) and
// the client-side axios Bearer header until Phase 2 (BFF route handlers).

let cachedToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  try {
    const res = await fetch("/api/auth/token");
    if (!res.ok) return null;
    const data: { token: string | null } = await res.json();
    cachedToken = data.token ?? null;
    return cachedToken;
  } catch {
    return null;
  }
}

export async function rotateToken(): Promise<string | null> {
  // Deduplicate concurrent refresh calls — only one inflight at a time
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) {
        cachedToken = null;
        return null;
      }
      const data: { token: string } = await res.json();
      cachedToken = data.token ?? null;
      return cachedToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function clearTokenCache(): void {
  cachedToken = null;
  refreshPromise = null;
}
