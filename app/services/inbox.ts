import { api } from "@/app/lib/api-client";
import { InboxResponse } from "@/app/components/notif/inbox-interface";

interface InboxListResponse {
  status: number;
  error: boolean;
  message: string;
  data: InboxResponse[];
}

// Returns billing-type inboxes (excludes REJECTED) in reverse-chronological order.
// Mirrors the filter used throughout the codebase.
export async function listInbox(): Promise<InboxResponse[]> {
  const res = await api.get<InboxListResponse>("/api/v1/inbox/list");
  const items: InboxResponse[] = res.data?.data ?? [];
  return items
    .filter((inbox) => inbox.type === "billing" && inbox.status !== "REJECTED")
    .reverse();
}

// Returns all inboxes of a specific type without filtering by status.
export async function listInboxByType(type: string): Promise<InboxResponse[]> {
  const res = await api.get<InboxListResponse>("/api/v1/inbox/list");
  const items: InboxResponse[] = res.data?.data ?? [];
  return items.filter((inbox) => inbox.type === type);
}
