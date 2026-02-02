import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth";
import { API_BACKEND } from "@/app/utils/constant";
import { ResponseDto } from "@/lib/client";
import { User } from "@/app/features/auth/types/user";

export async function GET() {
  try {
    const session = await getAuthCookie();

    if (!session?.token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const res = await fetch(`${API_BACKEND}/api/v1/profile`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch user profile",
        },
        { status: res.status },
      );
    }

    const result: ResponseDto<User> = await res.json();

    if (result.error || !result.data) {
      return NextResponse.json(
        {
          success: false,
          message: result.message ?? "User data not found",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 },
    );
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
