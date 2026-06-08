import axios from "axios";
import Swal from "sweetalert2";
import { Project } from "@shared/types/project/IProject";

export const projectList = async () => {
  try {
    const response = await axios.get(`https://link.com/api/v1/project/list`);
    const data = response.data;
    return data;
  } catch (e: any) {
    Swal.fire({
      icon: "info",
      title: "Info",
      text: e?.response?.data?.message || e.message,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

export const projectStore = async (project: Project) => {
  try {
    await axios.post(`https://link.com/api/v1/project/store`, {
      title: project.title,
      goal: project.goal,
      roi: project.roi,
      periode: project.periode,
    });
  } catch (e: any) {
    Swal.fire({
      icon: "info",
      title: "Info",
      text: e?.response?.data?.message || e.message,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

export const projectUpdate = async (project: Project) => {
  try {
    await axios.put(`https://link.com/api/v1/project/update`, {
      id: project.id,
      title: project.title,
      goal: project.goal,
      roi: project.roi,
      periode: project.periode,
    });
  } catch (e: any) {
    Swal.fire({
      icon: "info",
      title: "Info",
      text: e?.response?.data?.message || e.message,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

export const projectDelete = async (project: Project) => {
  try {
    await axios.delete(`https://link.com/api/v1/project/delete`, {
      data: {
        id: project.id,
      },
    });
  } catch (e: any) {
    Swal.fire({
      icon: "info",
      title: "Info",
      text: e?.response?.data?.message || e.message,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};
