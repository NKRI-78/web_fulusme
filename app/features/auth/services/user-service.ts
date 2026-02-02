import { User } from "@app/features/auth/types/user";

export async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me");
    const result = await res.json();

    if (!res.ok || !result.success) return null;

    return result.user;
  } catch (error) {
    return null;
  }
}
