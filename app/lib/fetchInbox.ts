import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { InboxResponse } from "../components/notif/inbox-interface";

export async function fetchInboxClient(
  token: string,
): Promise<InboxResponse[]> {
  try {
    if (!token) return [];

    const res = await axios.get(`${API_BACKEND}/api/v1/inbox/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data?.data) return [];

    const filteredInboxes = (res.data.data as InboxResponse[])
      .filter(
        (inbox) => inbox.type === "billing" && inbox.status !== "REJECTED",
      )
      .reverse();

    return filteredInboxes;
  } catch (error) {
    throw error; // lempar biar bisa ditangani di komponen
  }
}
