import Navbar from "@components/navbar/Navbar";
import FooterV2 from "@components/footer/FooterV2";

/** Public marketing chrome: navbar + footer. */
export default function MarketingLayout({
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