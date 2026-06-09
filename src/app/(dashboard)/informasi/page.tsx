import type { Metadata } from "next";
import BroadcastView from "@features/content/components/broadcast/BroadcastView";

export const metadata: Metadata = {
  title: "Informasi | FuLusme",
  description: "Informasi",
};

const BroadcastPage = async () => {
  return <BroadcastView />;
};

export default BroadcastPage;
