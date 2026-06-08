"use server";

import { InboxResponse } from "@features/inbox/types";
import { API_BACKEND } from "@shared/lib/constant";

export async function fetchInboxAction(
  token: string,
): Promise<InboxResponse[]> {
  try {
    if (!token) return [];

    const res = await fetch(`${API_BACKEND}/api/v1/inbox/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (!data?.data) return [];

    const filteredInboxes = (data.data as InboxResponse[])
      .filter(
        (inbox) => inbox.type === "billing" && inbox.status !== "REJECTED",
      )
      .reverse();

    return filteredInboxes;
  } catch (error) {
    return [];
  }
}
