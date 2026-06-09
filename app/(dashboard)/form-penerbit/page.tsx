import React, { Suspense } from "react";

import type { Metadata } from "next";
import MultiStepForm from "./PenerbitParent";

export const metadata: Metadata = {
  title: "Form Penerbit | FuLusme",
  description: "Form Penerbit",
};

const FormPenerbitPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiStepForm />;
    </Suspense>
  );
};

export default FormPenerbitPage;
