import React from "react";
import GeneralDialog from "./GeneralDialog";
import { X } from "lucide-react";
import Swal from "sweetalert2";

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  url?: (shareUrl: string, text?: string) => string; // fungsi pembuat url share
  action?: () => void; // fallback buat custom action, contoh copy link
}

const shareUrl = typeof window !== "undefined" ? window.location.href : "";
const shareText = "Cek website ini!";

const shareOptions: ShareOption[] = [
  {
    name: "Facebook",
    icon: (
      <img
        src="/images/social/icon-facebook.png"
        alt="Facebook"
        className="h-10 w-10"
      />
    ),
    url: (u) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    name: "Line",
    icon: (
      <img
        src="/images/social/icon-line.png"
        alt="Line"
        className="h-10 w-10"
      />
    ),
    url: (u, t) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        u
      )}&text=${encodeURIComponent(t ?? "")}`,
  },
  {
    name: "Whatsapp",
    icon: (
      <img
        src="/images/social/icon-whatsapp.png"
        alt="Whatsapp"
        className="h-10 w-10"
      />
    ),
    url: (u, t) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        (t ?? "") + " " + u
      )}`,
  },
  {
    name: "Instagram",
    icon: (
      <img
        src="/images/social/icon-instagram.png"
        alt="Instagram"
        className="h-10 w-10"
      />
    ),
    url: (u, t) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        u
      )}&text=${encodeURIComponent(t ?? "")}`,
  },
  {
    name: "Telegram",
    icon: (
      <img
        src="/images/social/icon-telegram.png"
        alt="Telegram"
        className="h-10 w-10"
      />
    ),
    url: (u, t) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        u
      )}&text=${encodeURIComponent(t ?? "")}`,
  },
  {
    name: "Salin Link",
    icon: (
      <img
        src="/images/social/icon-link.png"
        alt="Salin Link"
        className="h-10 w-10"
      />
    ),
    action: async () => {
      await navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Link berhasil disalin.",
        allowEscapeKey: true,
        timer: 2000,
        showConfirmButton: false,
      });
    },
  },
];

const ShareDialog: React.FC<{
  isOpen: boolean;
  title?: string;
  onClose: () => void;
}> = ({ isOpen, title, onClose }) => {
  return (
    <GeneralDialog isOpen={isOpen} onClose={onClose}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">
            {title ?? "Bagikan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid options */}
        <div className="mt-6 grid grid-cols-3 gap-y-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                if (option.action) {
                  option.action();
                } else if (option.url) {
                  const link = option.url(shareUrl, shareText);
                  window.open(link, "_blank", "noopener,noreferrer");
                }
              }}
              className="flex flex-col items-center gap-2 focus:outline-none"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-white`}
              >
                {option.icon}
              </div>
              <span className="text-sm text-gray-800">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </GeneralDialog>
  );
};

export default ShareDialog;
