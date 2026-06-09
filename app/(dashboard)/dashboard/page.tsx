import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | FuLusme",
  description: "Dashboard",
};

export default function DashboardIndex() {
  redirect("/dashboard/main");
}
