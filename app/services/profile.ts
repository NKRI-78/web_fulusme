import { api } from "@shared/lib/api-client";
import { User } from "@shared/types/user/IUser";

interface ProfileResponse {
  status: number;
  error: boolean;
  message: string;
  data: User;
}

export interface UpdateProfilePayload {
  fullname?: string;
  phone?: string;
  avatar_link?: string;
}

export async function getProfile(): Promise<User> {
  const res = await api.get<ProfileResponse>("/api/v1/profile");
  return res.data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const res = await api.post<ProfileResponse>("/api/v1/profile", payload);
  return res.data.data;
}
