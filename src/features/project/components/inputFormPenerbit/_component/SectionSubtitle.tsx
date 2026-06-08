import React from "react";

interface SubtitleProps {
  text: string;
  className?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ text, className }) => {
  return (
    <div className={className}>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
};

export default Subtitle;
