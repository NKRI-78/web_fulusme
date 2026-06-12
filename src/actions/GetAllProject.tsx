import { fetchProjects } from "@/features/project/service";
import { Project } from "@/features/project/type";

export async function getAllProject(): Promise<Project[] | null> {
  try {
    return await fetchProjects();
  } catch {
    return null;
  }
}
