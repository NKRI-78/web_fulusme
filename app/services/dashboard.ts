import { api } from "@shared/lib/api-client";
import {
  DashboardData,
  DashboardResponse,
} from "@shared/types/dashboard/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const res = await api.get<DashboardResponse>("/api/v1/dashboard/investor");
  return res.data.data;
}
