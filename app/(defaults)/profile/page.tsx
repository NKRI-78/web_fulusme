import { Metadata } from "next";
import ProfilePage from "../auth/profile/page";

export const metadata: Metadata = {
  title: "Profile | FuLusme",
  description: "Form Penerbit",
};

export default function page() {
  return <ProfilePage />;
}
