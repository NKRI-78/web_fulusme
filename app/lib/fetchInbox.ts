import api from "@/utils/axios";
import { getUser } from "@/app/lib/auth";
import { InboxResponse } from "../components/notif/inbox-interface";

export async function fetchInboxClient(): Promise<InboxResponse[]> {
  if (!getUser()) return [];

  const res = await api.get(`/api/v1/inbox/list`);
  if (!res.data?.data) return [];

  return (res.data.data as InboxResponse[])
    .filter((inbox) => inbox.type === "billing" && inbox.status !== "REJECTED")
    .reverse();
}
