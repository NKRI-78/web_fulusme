import React from "react";

interface SectionPointProps {
  text: string;
  className?: string;
  optional?: boolean;
}

const SectionPoint: React.FC<SectionPointProps> = ({
  text,
  className,
  optional = false,
}) => {
  return (
    <div className={className}>
      <div className="flex gap-1 items-center">
        <h4 className="font-semibold text-sm text-gray-600">{text}</h4>
        {optional ? (
          <p className="text-[11px] text-gray-500">(Opsional)</p>
        ) : (
          <p className="text-red-500">*</p>
        )}
      </div>
    </div>
  );
};

export default SectionPoint;
