import React from "react";

import type { Metadata } from "next";
import FormPemodalPerusahaan from "@features/investor-form/components/inputFormPemodalPerusahaan/FormPemodalPerusahaan";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Form Pemodal Perusahaan | FuLusme",
  description: "Form Pemodal Perusahaan",
};

const FormPemodalPerusahaanPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPemodalPerusahaan />
    </Suspense>
  );
};

export default FormPemodalPerusahaanPage;
