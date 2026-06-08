import ProfileView from "@features/profile/components/ProfileView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fulusme | Profile",
  description: "Profile",
};

const ProfilePage: React.FC = () => {
  return <ProfileView />;
};

export default ProfilePage;
