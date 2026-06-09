/** Standalone chrome: bare, no navbar/footer (e.g. document viewer). */
export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}