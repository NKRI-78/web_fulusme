import React from "react";

import type { Metadata } from "next";
import BroadcastView from "@/app/features/broadcast/BroadcastView";

export const metadata: Metadata = {
  title: "Broadcast | FuLusme",
  description: "Broadcast",
};

const BroadcastPage = async () => {
  return <BroadcastView />;
};

export default BroadcastPage;
