"use client";

import { ProjectResponse } from "@/app/interfaces/project/IProject";
import { API_BACKEND } from "@app/utils/constant";
import axios from "axios";

export async function getAllProject() {
  try {
    const apiUrl = `${API_BACKEND}/api/v1/project/list`;
    const response = await axios(apiUrl);
    const data: ProjectResponse = await response.data;
    return data;
  } catch (error) {
    return null;
  }
}
