import Cookies from "js-cookie";
import { AuthDataResponse } from "../interfaces/auth/auth";

export function getUser(): AuthDataResponse | null {
  const userCookie = Cookies.get("user");
  if (!userCookie) return null;

  try {
    const user: AuthDataResponse = JSON.parse(userCookie);
    return user;
  } catch (error) {
    return null;
  }
}
