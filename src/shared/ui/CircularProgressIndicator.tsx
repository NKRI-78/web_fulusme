import React from "react";

interface CircularProgressProps {
  progressValue?: number; // 0 - 100
  styling?: {
    bgColor: string; // warna background (track)
    stateColor: string; // warna progress (filled)
    textColor: string;
  };
  textDescription?: string;
  showTextIndicator?: boolean;
  size?: "small" | "medium" | "large" | number; // ukuran lingkaran
}

const CircularProgressIndicator: React.FC<CircularProgressProps> = ({
  progressValue,
  showTextIndicator = true,
  size = "medium",
  textDescription,
  styling = {
    bgColor: "#d0e8c7",
    stateColor: "#13733b",
    textColor: "#1f2937",
  },
}) => {
  // mapping predefined size
  const sizeMap: Record<string, number> = {
    small: 50,
    medium: 70,
    large: 90,
  };

  const resolvedSize =
    typeof size === "number" ? size : sizeMap[size] ?? sizeMap["medium"];

  const strokeWidth = resolvedSize * 0.1; // 10% dari diameter
  const radius = (resolvedSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset =
    progressValue !== undefined
      ? circumference - (progressValue / 100) * circumference
      : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Circular progress */}
      <div className="relative flex items-center justify-center">
        <svg
          width={resolvedSize}
          height={resolvedSize}
          style={{ transformOrigin: "center" }}
        >
          {/* Background circle */}
          <circle
            stroke={styling.bgColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={resolvedSize / 2}
            cy={resolvedSize / 2}
          />

          {/* Spinner arc */}
          {progressValue === undefined ? (
            <circle
              stroke={styling.stateColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference * 0.25} // 25% lingkaran
              strokeDashoffset={0}
              r={radius}
              cx={resolvedSize / 2}
              cy={resolvedSize / 2}
              className="animate-spin"
              style={{ transformOrigin: "50% 50%" }} // penting biar muternya dari tengah
            />
          ) : (
            <circle
              stroke={styling.stateColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              r={radius}
              cx={resolvedSize / 2}
              cy={resolvedSize / 2}
              className="transition-all duration-300 ease-in-out"
            />
          )}
        </svg>

        {/* Text in center */}
        {progressValue !== undefined && showTextIndicator && (
          <span
            className="absolute font-semibold"
            style={{
              fontSize: resolvedSize * 0.2,
              color: styling.textColor,
            }}
          >
            {progressValue}%
          </span>
        )}
      </div>

      {/* Text description */}
      {textDescription && (
        <p
          className="text-center text-sm"
          style={{
            color: styling.textColor,
          }}
        >
          {textDescription}
        </p>
      )}
    </div>
  );
};

export default CircularProgressIndicator;
