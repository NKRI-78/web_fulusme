"use client";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { inferFileName } from "@shared/lib/format/fileType";
import Modal from "@shared/ui/Modal";

export default function FileViewerModal({
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
    <Modal isOpen={open} onClose={onClose} title="Verifikasi OTP">
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
      <div className="bg-white rounded-lg shadow-lg p-4">
        <DocViewer
          documents={documents}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: true,
            },
          }}
          style={{ height: "100%" }}
        />
      </div>
    </Modal>
  );
}
