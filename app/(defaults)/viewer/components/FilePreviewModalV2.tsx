"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { inferFileName } from "@/app/lib/fileType";
import Modal from "@/app/helper/Modal";

export default function FilePreviewModalV2({
  src,
  open,
  onClose,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
}) {
  const documents = [{ uri: src, fileName: inferFileName(src) }];

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="flex items-center justify-between bg-gray-100 px-6 py-4 border-b">
        <span className="font-semibold text-sm">Preview File</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-xl leading-none"
          >
            &times;
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-0">
        <DocViewer
          documents={documents}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: { disableHeader: true },
          }}
          style={{
            height: "80vh",
            background: "white",
            overflow: "auto",
          }}
        />
      </div>
    </Modal>
  );
}
