import clsx from "clsx";

type CenterProps = {
  children: React.ReactNode;
  fullScreen?: boolean; // center di seluruh layar
  fullParent?: boolean; // center di seluruh layar
  horizontal?: boolean; // hanya horizontal
  vertical?: boolean; // hanya vertical
  className?: string; // ekstra tailwind class
};

export default function Center({
  children,
  fullScreen,
  fullParent,
  horizontal,
  vertical,
  className,
}: CenterProps) {
  return (
    <div
      className={clsx(
        "flex",
        (horizontal || fullScreen) && "justify-center",
        (vertical || fullScreen) && "items-center",
        fullScreen && "h-screen w-screen",
        fullParent && "h-full w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
