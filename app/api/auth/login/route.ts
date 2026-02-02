import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { API_BACKEND } from "@/app/utils/constant";
import { ResponseDto } from "@/lib/client";
import { UserSession } from "@/app/features/auth/types/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BACKEND}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result: ResponseDto<UserSession> = await res.json();

    if (!res.ok || result.error) {
      return NextResponse.json(
        {
          success: false,
          message: result.message ?? "Login failed",
        },
        { status: res.status },
      );
    }

    const session = result.data;

    await setAuthCookie(session);

    return NextResponse.json({
      success: true,
      session: session,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
