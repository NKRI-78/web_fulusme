import Navbar from "@shared/ui/Navbar";
import FooterV2 from "@shared/ui/FooterV2";

/** Public chrome: navbar + footer. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-white relative overflow-hidden flex flex-col">
      <Navbar />
      <div>{children}</div>
      <FooterV2 />
    </main>
  );
}
