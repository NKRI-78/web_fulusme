import api from "@/utils/axios";
import { DashboardResponse } from "../interfaces/dashboard/dashboard";

export async function fetchDashboard(
  token: string,
): Promise<DashboardResponse["data"]> {
  const res = await api.get<DashboardResponse>(`/api/v1/dashboard/investor`);
  return res.data.data;
}
