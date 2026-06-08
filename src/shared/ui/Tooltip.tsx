import { Tooltip as ReactTooltip } from "react-tooltip";

type TooltipProps = {
  label: string;
  showTooltip?: boolean;
  children: React.ReactNode;
};

const Tooltip = ({
  label,
  children,
  showTooltip = true,
}: TooltipProps) => {
  if (!showTooltip || !label) {
    return <>{children}</>;
  }

  const id = `tooltip-${label.replace(/\s+/g, "-")}`;

  return (
    <>
      <span data-tooltip-id={id} data-tooltip-content={label}>
        {children}
      </span>

      <ReactTooltip
        id={id}
        place="top"
        className="!px-2 !py-1 !text-xs !rounded-md"
      />
    </>
  );
};

export default Tooltip;
