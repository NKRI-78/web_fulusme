import React from "react";

const FormSection: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="w-full space-y-4">{children}</div>;
};

export default FormSection;
