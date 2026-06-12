import { api } from "@shared/lib/api-client";
import { Project, ProjectResponse } from "../type";

export async function fetchProjects(): Promise<Project[]> {
  const response = await api.get<ProjectResponse>("/api/v1/project/list");
  return response.data.data;
}

export async function fetchProjectById(id: string): Promise<Project> {
  const response = await api.get<{ data: Project }>(`/api/v1/project/${id}`);
  return response.data.data;
}
