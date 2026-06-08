import React from "react";

interface FormButtonProps {
  type?: "filled" | "outlined";
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  type = "filled",
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-6 py-2 rounded-md font-semibold text-sm transition-all duration-200 active:scale-[0.98] transition";

  const filledStyles =
    "bg-[#3C2B90] text-white hover:bg-[#2e2176] disabled:opacity-50 disabled:cursor-not-allowed";

  const outlinedStyles =
    "border border-[#3C2B90] text-[#3C2B90] bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${
        type === "filled" ? filledStyles : outlinedStyles
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default FormButton;
