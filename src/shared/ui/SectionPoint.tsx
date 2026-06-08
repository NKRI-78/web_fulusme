import React from "react";

interface SectionPointProps {
  text: string;
  className?: string;
}

const SectionPoint: React.FC<SectionPointProps> = ({ text, className }) => {
  return (
    <div className={className}>
      <div className="flex gap-1">
        <h4 className="font-semibold text-sm text-gray-600">{text}</h4>
        <p className="text-red-500">*</p>
      </div>
    </div>
  );
};

export default SectionPoint;
