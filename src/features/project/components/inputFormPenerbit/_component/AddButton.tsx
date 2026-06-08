import React from "react";

interface AddButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  errorText?: string;
  message?: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  label,
  onClick,
  className = "",
  disabled = false,
  errorText,
  message,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-gray-100 border border-dashed border-gray-300 text-gray-600 py-2 mt-2 rounded-md text-sm hover:bg-gray-200 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {label}
      </button>
      {errorText && <p className="text-red-500 text-xs my-1">{errorText}</p>}
      {message && <p className="text-gray-500 text-xs my-1">{message}</p>}
    </div>
  );
};

export default AddButton;
