import React, { useState } from "react";
import SectionPoint from "./SectionPoint";
import TextField from "./TextField";

interface CustomSelectionProps {
  label: string;
  options: string[];
  enableOtherSelection?: boolean;
  selected: string;
  onChange: (value: string) => void;
  errorText?: string;
  showWhenValue?: string;
  customContent?: React.ReactNode;
}

const CustomSelection: React.FC<CustomSelectionProps> = ({
  label,
  options,
  selected,
  enableOtherSelection = false,
  onChange,
  errorText,
  showWhenValue,
  customContent,
}) => {
  const isOtherSelected = enableOtherSelection && !options.includes(selected);

  const handleChange = (value: string) => {
    if (value === "Lainnya") {
      onChange("");
    } else {
      onChange(value);
    }
  };

  const handleOtherChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    onChange(val);
  };

  return (
    <div className="w-full mb-5">
      <SectionPoint text={label} className="mb-2" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2 gap-x-4">
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex items-center text-[13px] text-gray-700 gap-2"
          >
            <input
              type="radio"
              name={label}
              value={option}
              checked={selected === option}
              onChange={() => handleChange(option)}
              className="accent-blue-600"
            />
            {option}
          </label>
        ))}

        {enableOtherSelection && (
          <label className="inline-flex items-center text-[13px] text-gray-700 gap-2">
            <input
              type="radio"
              name={label}
              value="Lainnya"
              checked={isOtherSelected}
              onChange={() => handleChange("Lainnya")}
              className="accent-blue-600"
            />
            Lainnya
          </label>
        )}
      </div>

      {enableOtherSelection && isOtherSelected && (
        <TextField
          placeholder="Lainnya"
          value={selected}
          onChange={handleOtherChange}
          className="mt-2"
          errorText={errorText}
        />
      )}

      {showWhenValue && selected === showWhenValue && (
        <div className="mt-2">{customContent}</div>
      )}
    </div>
  );
};

export default CustomSelection;
