import React, { Suspense } from "react";

import type { Metadata } from "next";
import FormDokumenTambahanPage from "@features/project/components/formDokumenTambahanPenerbit/FormDokumenTambahanPage";

export const metadata: Metadata = {
  title: "Form Pelengkap | FuLusme",
  description: "Add Form Pelengkap Penerbit",
};

const CreateProjectPenerbitPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormDokumenTambahanPage />
    </Suspense>
  );
};

export default CreateProjectPenerbitPage;
