import React from "react";

import type { Metadata } from "next";
import FormPemodal from "@features/investor-form/components/inputFormPemodal/FormPemodal";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Form Pemodal | FuLusme",
  description: "Form Pemodal",
};

const FormPemodalPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPemodal />
    </Suspense>
  );
};

export default FormPemodalPage;
