import React from "react";

const DocumentRow: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="w-full flex space-x-6">{children}</div>;
};

export default DocumentRow;
