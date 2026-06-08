import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import SectionPoint from "./SectionPoint";

interface Option {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxHeightDropdown?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  errorText?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  maxHeightDropdown = "200px",
  disabled = false,
  className = "",
  defaultValue,
  errorText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) =>
    value !== undefined && value !== null && value !== ""
      ? opt.value === value
      : opt.value === defaultValue
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (disabled) return;

    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 100);
    }

    setIsOpen((prev) => !prev);
  };

  return (
    <div className={clsx("w-full", className)} ref={dropdownRef}>
      {label && <SectionPoint text={label} className="mb-1" />}

      <div className="relative">
        <button
          disabled={disabled}
          onClick={toggleDropdown}
          className={clsx(
            "w-full px-4 py-2 border text-sm rounded-md flex justify-between items-center",
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
              : errorText
              ? "border-red-500 focus:border-red-500"
              : "bg-white text-black border-gray-300 focus:border-gray-400"
          )}
        >
          <span
            className={clsx("truncate", !selectedOption && "text-gray-400")}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {isOpen && (
          <div
            className={clsx(
              "absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-md overflow-y-auto scrollbar-none",
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            )}
            style={{ maxHeight: maxHeightDropdown }}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {errorText && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
    </div>
  );
};

export default DropdownSelect;
