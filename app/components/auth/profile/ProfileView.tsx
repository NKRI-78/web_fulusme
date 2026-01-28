"use client";

import { User } from "@/app/interfaces/user/IUser";
import { getUser } from "@/app/lib/auth";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CircularProgressIndicator from "../../CircularProgressIndicator";
import ProfilePenerbitView from "./ProfilePenerbitView";
import ProfilePemodalPribadi from "./ProfilePemodalPribadiView";
import ProfilePemodalPerusahaan from "./ProfilePemodalPerusahaanView";

const ProfileView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [userSession, setUserSession] = useState<AuthDataResponse | null>(null);

  useEffect(() => {
    const session = getUser();
    if (session) {
      setUserSession(session);
      const fetchProfile = async () => {
        try {
          const res = await axios(`${API_BACKEND}/api/v1/profile`, {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          });
          const profile: User = res.data.data;
          setProfile(profile);
          setLoading(false);
        } catch (error: any) {
          Swal.fire({
            title: "Terjadi Kesalahan",
            text: error.message,
            confirmButtonText: "Coba Lagi",
          }).then((result) => {
            if (result.isConfirmed) fetchProfile();
          });
        }
      };
      fetchProfile();
    }
  }, []);

  const getAvatar = (): string => {
    if (profile) {
      if (profile.avatar !== "-") return profile.avatar;
      if (profile.selfie !== "-") return profile.selfie;
    }
    return "/images/default-image.png";
  };

  if (loading) {
    return (
      <div className="w-full p-44 flex flex-col items-center justify-center">
        <CircularProgressIndicator />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-28 px-8 lg:px-32 text-gray-800">
      {userSession?.role === "emiten" ? (
        <ProfilePenerbitView avatar={getAvatar()} profile={profile} />
      ) : userSession?.role === "investor" ? (
        <ProfilePemodalPribadi avatar={getAvatar()} profile={profile} />
      ) : userSession?.role === "investor institusi" ? (
        <ProfilePemodalPerusahaan avatar={getAvatar()} profile={profile} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfileView;
