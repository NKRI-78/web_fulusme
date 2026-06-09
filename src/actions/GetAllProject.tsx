"use client";

import { ProjectResponse } from "@shared/types/project/IProject";
import { api } from "@shared/lib/api-client";

export async function getAllProject() {
  try {
    const response = await api.get("/api/v1/project/list");
    const data: ProjectResponse = await response.data;
    return data;
  } catch (error) {
    return null;
  }
}
