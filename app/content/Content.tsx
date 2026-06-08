import React from "react";

import type { Metadata } from "next";
import ContentItems from "@features/content/components/ContentItem";

export const metadata: Metadata = {
  title: "Admin | All Transaction",
  description: "All Transaction",
};

const ContentPage: React.FC = () => {
  return (
    <ContentItems/>
  );
};

export default ContentPage;
