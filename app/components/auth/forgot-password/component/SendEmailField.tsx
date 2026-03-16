"use client";

interface Props {
  value: string;
  onChange: (message: string) => void;
  className?: string;
  errorMessage?: string;
  showError?: boolean;
}

export default function SendEmailField(props: Props) {
  return (
    <div className={props.className || "w-full"}>
      <label className="font-bold text-sm md:text-base text-primary block mb-1">
        Email
      </label>
      <input
        type="email"
        placeholder="Masukan Email Anda"
        className="w-full p-3 rounded text-black bg-[#F1F5F9] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.showError && props.errorMessage && (
        <p className="text-red-500 text-[13px] mt-2 line-clamp-2">
          {props.errorMessage}
        </p>
      )}
    </div>
  );
}
