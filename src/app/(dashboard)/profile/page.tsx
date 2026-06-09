import { Metadata } from "next";
import ProfileView from "@features/profile/components/ProfileView";

export const metadata: Metadata = {
  title: "Profile | FuLusme",
  description: "Profile",
};

export default function ProfilePage() {
  return <ProfileView />;
}