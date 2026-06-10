import { api } from "@shared/lib/api-client";

export async function fetchDetailProject(projectId: string) {
  try {
    const response = await api.get(`/api/v1/project/detail/${projectId}`);
    const data = await response.data;
    return data["data"];
  } catch (error) {
    return null;
  }
}
