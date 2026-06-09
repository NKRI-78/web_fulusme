import React from "react";

import type { Metadata } from "next";
import Inbox from "@features/inbox/components/Inbox";

export const metadata: Metadata = {
  title: "Inbox | FuLusme",
  description: "Inbox",
};

const InboxPage: React.FC = () => {
  return <Inbox />;
};

export default InboxPage;
