/** Auth chrome: full-screen centered, no navbar/footer. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex items-center justify-center h-screen">
      {children}
    </div>
  );
}