import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const FilledButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseStyle = `
    transition-all duration-200
    active:scale-[0.98]
    cursor-pointer
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export const OutlinedButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium 
        border border-blue-600 text-blue-600 hover:bg-blue-50 
        disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};
