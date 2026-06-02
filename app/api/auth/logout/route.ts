import { NextResponse } from "next/server";

const CLEAR = { value: "", maxAge: 0, path: "/" } as const;

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth_token", CLEAR.value, CLEAR);
  res.cookies.set("auth_refresh", CLEAR.value, CLEAR);
  res.cookies.set("auth_role", CLEAR.value, CLEAR);
  res.cookies.set("session", CLEAR.value, CLEAR);
  // Clear legacy cookies from the old plaintext scheme
  res.cookies.set("user", CLEAR.value, CLEAR);
  res.cookies.set("token", CLEAR.value, CLEAR);
  return res;
}
