import React from "react";

import type { Metadata } from "next";
import Transaction from "@features/transaction/components/Transaction";

export const metadata: Metadata = {
  title: "Transaksi | FuLusme",
  description: "Transaksi",
};

const TransactionPage: React.FC = () => {
  return <Transaction />;
};

export default TransactionPage;
