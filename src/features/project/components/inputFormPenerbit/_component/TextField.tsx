import React, { forwardRef } from "react";
import SectionPoint from "./SectionPoint";

interface TextFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: "text" | "textarea" | "number";
  className?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
  maxWords?: number;
  errorText?: string;
  onBlur?: () => void;
  suffix?: React.ReactNode;
}

const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      type = "text",
      className = "",
      rows = 6,
      disabled = false,
      maxLength,
      maxWords,
      errorText,
      onBlur,
      suffix,
    },
    ref
  ) => {
    const inputStyle = `w-full px-4 py-2 border text-sm rounded-md focus:outline-none ${
      disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
        : errorText
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-gray-400"
    }`;

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const words = e.target.value.trim().split(/\s+/);
      if (maxWords && words.length > maxWords) return;
      onChange(e);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const numericOnly = raw.replace(/\D/g, "");
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericOnly,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    };

    return (
      <div className={`${className}`}>
        {label && <SectionPoint text={label} className="mb-1" />}

        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            rows={rows}
            readOnly={disabled}
            className={`${inputStyle} resize-none -mb-[6px]`}
          />
        ) : (
          <div className="relative">
            <input
              type={type === "number" ? "text" : type}
              inputMode={type === "number" ? "numeric" : undefined}
              value={value}
              onChange={type === "number" ? handleNumberChange : onChange}
              placeholder={placeholder}
              readOnly={disabled}
              maxLength={maxLength}
              onBlur={onBlur}
              className={`${inputStyle} pr-10`}
            />
            {suffix && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {suffix}
              </div>
            )}
          </div>
        )}

        {errorText && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export default TextField;
