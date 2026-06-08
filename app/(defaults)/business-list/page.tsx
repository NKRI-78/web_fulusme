import React from "react";

import type { Metadata } from "next";
import BussinesList from "@features/content/components/BusinessList";

export const metadata: Metadata = {
  title: "Daftar Bisnis | FuLusme",
  description: "Daftar Bisnis",
};

const BussinesListPage: React.FC = () => {
  return <BussinesList />;
};

export default BussinesListPage;
