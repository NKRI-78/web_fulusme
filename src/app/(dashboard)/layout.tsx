import Navbar from "@shared/ui/Navbar";

/** Authenticated app chrome: navbar only, no footer. */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-white relative overflow-hidden flex flex-col">
      <Navbar />
      <div>{children}</div>
    </main>
  );
}