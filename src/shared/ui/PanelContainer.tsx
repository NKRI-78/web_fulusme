export const PanelContainer: React.FC<{
  children?: React.ReactNode;
  clasName?: string;
}> = ({ children, clasName }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-8">
      <div className={clasName}>{children}</div>
    </div>
  );
};
