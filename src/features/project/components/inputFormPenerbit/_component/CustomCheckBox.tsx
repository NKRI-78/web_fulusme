import React from "react";
import SectionPoint from "./SectionPoint";

interface CustomCheckBoxProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selectedValues: string[]) => void;
  errorText?: string;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  label,
  options,
  selected,
  onChange,
  errorText,
}) => {
  const handleCheckboxChange = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="w-full mb-6">
      <SectionPoint text={label} className="mb-1" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2 gap-x-4">
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex items-center text-[13px] text-gray-700 gap-2"
          >
            <input
              type="checkbox"
              name={label}
              value={option}
              checked={selected.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="accent-blue-600"
            />
            {option}
          </label>
        ))}
      </div>

      {errorText && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
    </div>
  );
};

export default CustomCheckBox;
