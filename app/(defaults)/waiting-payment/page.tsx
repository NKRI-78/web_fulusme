import React, { Suspense } from "react";

import type { Metadata } from "next";
import WaitingPayment from "@features/payment/components/waiting-payment/WaitingPayment";

export const metadata: Metadata = {
  title: "Menunggu Pembayaran | FuLusme",
  description: "Menunggu Pembayaran",
};

const FormPenerbitPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WaitingPayment />
    </Suspense>
  );
};

export default FormPenerbitPage;
