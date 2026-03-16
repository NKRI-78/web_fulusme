import api from "@/utils/axios";
import { InboxResponse } from "../components/notif/inbox-interface";

export async function fetchInboxClient(
  token: string,
): Promise<InboxResponse[]> {
  try {
    if (!token) return [];

    const res = await api.get(`/api/v1/inbox/list`);

    if (!res.data?.data) return [];

    const filteredInboxes = (res.data.data as InboxResponse[])
      .filter(
        (inbox) => inbox.type === "billing" && inbox.status !== "REJECTED",
      )
      .reverse();

    return filteredInboxes;
  } catch (error) {
    throw error;
  }
}
