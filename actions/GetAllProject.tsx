"use client";

import { ProjectResponse } from "@/app/interfaces/project/IProject";
import api from "@/utils/axios";

export async function getAllProject() {
  try {
    const response = await api.get("/api/v1/project/list");
    const data: ProjectResponse = await response.data;
    return data;
  } catch (error) {
    return null;
  }
}
