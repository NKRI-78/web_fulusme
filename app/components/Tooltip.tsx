const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <span
    data-tooltip={label}
    className="relative after:content-[attr(data-tooltip)] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:mb-2 after:bg-black after:text-white after:px-3 after:py-1 after:rounded after:text-xs after:opacity-0 hover:after:opacity-100"
  >
    {children}
  </span>
);

export default Tooltip;
