import type { Metadata } from "next";
import BroadcastView from "@/app/features/broadcast/BroadcastView";

export const metadata: Metadata = {
  title: "Informasi | FuLusme",
  description: "Informasi",
};

const BroadcastPage = async () => {
  return <BroadcastView />;
};

export default BroadcastPage;
