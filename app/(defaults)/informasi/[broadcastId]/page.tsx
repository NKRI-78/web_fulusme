import React from "react";

import type { Metadata } from "next";
import BroadcastView from "@/app/features/broadcast/BroadcastView";
import BroadcastDetailView from "@/app/features/broadcast/BroadcastDetailView";

export const metadata: Metadata = {
  title: "Broadcast | FuLusme",
  description: "Broadcast",
};

const BroadcastPage = async () => {
  return <BroadcastDetailView />;
};

export default BroadcastPage;
