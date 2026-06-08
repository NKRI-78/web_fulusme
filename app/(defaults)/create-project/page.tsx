import React from "react";

import type { Metadata } from "next";
import CreateProjectPenerbit from "@features/project/components/createProjectPenerbit/CreateProjectPenerbit";

export const metadata: Metadata = {
  title: "Create Project | FuLusme",
  description: "Create Project Penerbit",
};

const CreateProjectPenerbitPage: React.FC = () => {
  return <CreateProjectPenerbit />;
};

export default CreateProjectPenerbitPage;
