import Tooltip from "@/app/components/Tooltip";

interface ProgressBarProps {
  percentage: number; // bisa float, contoh 0.25
  maxWidth?: string;
  bgColor?: string;
  precision?: number; // jumlah digit di belakang koma
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  maxWidth = "32rem",
  bgColor = "white",
  precision = 0, // default tetap bulat
}) => {
  const safePercentage = Math.max(0, Math.min(percentage, 100));

  const labelWidthRem = 3;
  const labelLeft = `calc(${safePercentage}% - ${labelWidthRem / 2}rem)`;

  // format label persentase
  let labelText: string;
  if (safePercentage > 0 && safePercentage < 1 && precision === 0) {
    labelText = "<1%"; // biar ga tampil "0%"
  } else {
    labelText = safePercentage.toFixed(precision) + "%";
  }

  return (
    <div
      className="relative w-full h-4 rounded-full my-4 mx-auto"
      style={{
        maxWidth: maxWidth,
        backgroundColor: bgColor,
      }}
    >
      {/* Bar Isi */}
      <div
        className="absolute top-0 left-0 h-4 bg-gradient-to-r from-[#039BA9] to-[#37F9D2] rounded-full transition-all duration-300"
        style={{
          width: `${safePercentage}%`,
          borderTopRightRadius: safePercentage === 100 ? "0.5rem" : "9999px",
          borderBottomRightRadius: safePercentage === 100 ? "0.5rem" : "9999px",
        }}
      ></div>

      {/* Label Hijau */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transform bg-gradient-to-r from-[#039BA9] to-[#2abc9f] text-white text-xs border border-white font-bold px-2 py-[1px] rounded-full shadow transition-all duration-300 whitespace-nowrap cursor-pointer"
        style={{
          left: `min(max(${labelLeft}, 0rem), calc(100% - ${labelWidthRem}rem))`,
        }}
      >
        <Tooltip label={`${percentage.toFixed(3)}%`}>{labelText}</Tooltip>
      </div>
    </div>
  );
};

export default ProgressBar;
