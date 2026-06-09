"use client";
import FilePreview from "./components/FilePreview";
import { API_BACKEND, API_BACKEND_MEDIA, BASE_URL } from "@shared/lib/constant";

type SearchParams = { src?: string; h?: string };

/**
 * Hosts whose documents the viewer is allowed to render. Derived from the
 * configured backend/media/base env URLs so it tracks each environment.
 */
function allowedHosts(): string[] {
  return [API_BACKEND, API_BACKEND_MEDIA, BASE_URL]
    .filter((u): u is string => Boolean(u))
    .map((u) => {
      try {
        return new URL(u).hostname;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

/**
 * The `src` is fully user-controlled (query param). Restrict it to:
 *  - same-origin relative paths ("/...", not protocol-relative "//host")
 *  - absolute http(s) URLs whose host is in the configured allowlist
 * This blocks scheme injection (javascript:/data:/file:) and rendering
 * attacker-controlled documents inside our origin.
 */
function isSafeSrc(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    return allowedHosts().includes(url.hostname);
  } catch {
    return false;
  }
}

export default function ViewerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawSrc = searchParams.src ?? "";
  let decoded = "";
  try {
    decoded = decodeURIComponent(rawSrc);
  } catch {
    decoded = "";
  }

  if (!decoded) {
    return <div className="p-6">Tambahkan query `?src=`</div>;
  }

  if (!isSafeSrc(decoded)) {
    return <div className="p-6">Sumber dokumen tidak diizinkan.</div>;
  }

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <FilePreview src={decoded} height="100%" />
      </div>
    </div>
  );
}
