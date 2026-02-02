import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth";

export async function GET() {
  const session = await getAuthCookie();

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        session: null,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      session,
    },
    { status: 200 },
  );
}
