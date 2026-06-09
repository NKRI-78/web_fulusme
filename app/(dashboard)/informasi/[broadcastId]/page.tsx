import type { Metadata } from "next";
import BroadcastDetailView from "@features/content/components/broadcast/BroadcastDetailView";

export const metadata: Metadata = {
  title: "Informasi | FuLusme",
  description: "Informasi",
};

const BroadcastPage = async () => {
  return <BroadcastDetailView />;
};

export default BroadcastPage;
