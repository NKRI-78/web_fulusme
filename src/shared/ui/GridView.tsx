import React from "react";

export type BreakpointCols = Partial<{
  sm: number;
  md: number;
  lg: number;
  xl: number;
}>;

export type GridViewProps<T> = {
  /** Array of data items */
  items: T[];
  /** Function to render a single item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Unique key extractor for each item (optional) */
  itemKey?: (item: T, index: number) => string | number;
  /** Default number of columns on the smallest screens */
  cols?: number;
  /** Override column counts for breakpoints */
  breakpointCols?: BreakpointCols;
  /** Grid gap (Tailwind spacing scale or raw value) */
  gapClass?: string;
  /** Optional container className */
  className?: string;
  /** If true, wrap each item in a card-like container */
  card?: boolean;
};

/**
 * GridView
 * - Tailwind CSS friendly
 * - Generic over item type T
 * - Responsive via `cols` + `breakpointCols`
 */
export default function GridView<T>({
  items,
  renderItem,
  itemKey,
  cols = 1,
  breakpointCols = { sm: 2, md: 3, lg: 4 },
  gapClass = "gap-4",
  className = "",
  card = false,
}: GridViewProps<T>) {
  // build tailwind grid class from props
  const baseColsClass = `grid-cols-${cols}`;
  const smColsClass = breakpointCols.sm
    ? `sm:grid-cols-${breakpointCols.sm}`
    : "";
  const mdColsClass = breakpointCols.md
    ? `md:grid-cols-${breakpointCols.md}`
    : "";
  const lgColsClass = breakpointCols.lg
    ? `lg:grid-cols-${breakpointCols.lg}`
    : "";
  const xlColsClass = breakpointCols.xl
    ? `xl:grid-cols-${breakpointCols.xl}`
    : "";

  const gridClass = [
    "grid",
    baseColsClass,
    smColsClass,
    mdColsClass,
    lgColsClass,
    xlColsClass,
    gapClass,
    className,
  ].filter(Boolean);

  return (
    <div className={gridClass.join(" ")}>
      {items.map((it, idx) => {
        const key = itemKey
          ? itemKey(it, idx)
          : (typeof it === "object" ? JSON.stringify(it) : (it as any)) || idx;
        const content = renderItem(it, idx);

        return (
          <div
            key={key}
            className={card ? "p-3 bg-white rounded-2xl shadow-sm" : ""}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
