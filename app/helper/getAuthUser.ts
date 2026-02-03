import { AuthDataResponse } from "../interfaces/auth/auth";
import Cookies from "js-cookie";

export function getAuthUser(): AuthDataResponse | null {
  const userCookie = Cookies.get("user");
  if (!userCookie) return null;
  try {
    const parsed: AuthDataResponse = JSON.parse(userCookie);
    return parsed;
  } catch {
    return null;
  }
}
