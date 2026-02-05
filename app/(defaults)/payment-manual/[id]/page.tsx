// app/payment/[id]/page.tsx
import type { Metadata } from "next";
import PembayaranBCAWithDetail from "./PymentManual";

export const metadata: Metadata = {
  title: "Payment Manual | FuLusme",
  description: "Payment Manual",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const inboxId = (await params).id;
  // Tidak fetch di server karena endpoint butuh Bearer token
  // Biarkan komponen client yang fetch pakai axios + getUser()
  return <PembayaranBCAWithDetail inboxId={inboxId} />;
}
