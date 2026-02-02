import { getAuthCookie } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function NavbarServer() {
  const session = await getAuthCookie();
  return <NavbarClient session={session} />;
}
