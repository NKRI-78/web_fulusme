import React from "react";

import type { Metadata } from "next";
import BroadcastView from "@/app/features/broadcast/BroadcastView";
import BroadcastDetailView from "@/app/features/broadcast/BroadcastDetailView";

export const metadata: Metadata = {
  title: "Informasi | FuLusme",
  description: "Informasi",
};

const BroadcastPage = async () => {
  return <BroadcastDetailView />;
};

export default BroadcastPage;
