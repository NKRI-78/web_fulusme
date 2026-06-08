import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { X } from "lucide-react"; // 🔹 icon X

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // optional
  children: ReactNode;
}

const ShowModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={() => onClose()}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="bg-white border-0 p-0 rounded-3xl overflow-hidden w-full max-w-3xl my-8 text-black dark:text-secondary">
                {/* Header hanya muncul kalau ada title */}
                {title && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                )}
                <div>{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShowModal;
