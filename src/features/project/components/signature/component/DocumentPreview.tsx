"use client";

import React from "react";

interface Props {
  fileUrl: string;
}

const DocumentPreview: React.FC<Props> = ({ fileUrl }) => {
  if (!fileUrl) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center border rounded bg-gray-50">
        <p className="text-gray-500">Tidak ada dokumen</p>
      </div>
    );
  }

  const lowerUrl = fileUrl.toLowerCase();
  let previewUrl: string | null = null;

  if (lowerUrl.endsWith(".pdf")) {
    previewUrl = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
  } else if (lowerUrl.endsWith(".doc") || lowerUrl.endsWith(".docx")) {
    previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      fileUrl
    )}`;
  }

  return (
    <div className="w-full aspect-[4/3] border rounded overflow-hidden">
      {previewUrl ? (
        <iframe
          src={previewUrl}
          className="w-full h-full border rounded"
          allow="autoplay"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center border rounded bg-gray-50">
          <p className="text-gray-500">Preview tidak tersedia</p>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
