"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import FileViewerModal from "@/app/(defaults)/viewer/components/FilePriviewModal";

type ContextType = {
  openFile: (src: string) => void;
  closeFile: () => void;
};

const FileViewerContext = createContext<ContextType | null>(null);

export function FileViewerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const openFile = (src: string) => {
    setFileUrl(src);
    setOpen(true);
  };

  const closeFile = () => setOpen(false);

  return (
    <FileViewerContext.Provider value={{ openFile, closeFile }}>
      {children}
      {fileUrl && (
        <FileViewerModal src={fileUrl} open={open} onClose={closeFile} />
      )}
    </FileViewerContext.Provider>
  );
}

export function useFileViewerModal() {
  const ctx = useContext(FileViewerContext);
  if (!ctx) {
    throw new Error(
      "useFileViewerModal must be used inside <FileViewerProvider>"
    );
  }
  return ctx;
}
