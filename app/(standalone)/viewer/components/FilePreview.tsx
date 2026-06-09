"use client";

import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { inferFileName } from "@shared/lib/format/fileType";

export default function FilePreview({
  src,
  height = "80vh",
}: {
  src: string;
  height?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const documents = [{ uri: src, fileName: inferFileName(src) }];

  if (!mounted) return null; // ⛔ hindari mismatch SSR

  return (
    <div style={{ height, width: "100%" }} className="bg-white">
      <DocViewer
        documents={documents}
        pluginRenderers={DocViewerRenderers}
        style={{ height: "100%", background: "white" }}
      />
    </div>
  );
}
