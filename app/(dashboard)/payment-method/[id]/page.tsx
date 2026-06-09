import type { Metadata } from "next";
import PaymentMethod from "@features/payment/components/payment-method/PaymentMethod";

export const metadata: Metadata = {
  title: "Pilih Metode Pembayaran | CapBridge",
  description: "Pilih Metode Pembayaran",
};

export default async function PaymentMethodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PaymentMethod id={(await params).id} />;
}
