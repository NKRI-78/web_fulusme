import React from "react";

interface SectionTitleProps {
  text: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => {
  return <h3 className="font-bold text-lg text-gray-600">{text}</h3>;
};

export default SectionTitle;
