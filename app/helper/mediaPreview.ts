/**
 * Remediasi OAO Temuan 1 (Stored XSS on Upload Document).
 *
 * Semua link preview/download dokumen hasil upload user WAJIB dibungkus
 * dengan helper ini agar dokumen dilewatkan melalui proxy
 * `/api/media/preview`, yang memaksa file diunduh (Content-Disposition:
 * attachment) dan tidak pernah dirender inline oleh browser — sehingga
 * JavaScript yang tertanam di PDF tidak dapat dieksekusi.
 */
export function mediaPreviewUrl(url?: string | null): string {
  if (!url) return "";

  // Hanya URL absolut http(s) yang di-proxy; nilai lain dikembalikan apa
  // adanya (mis. path relatif aset internal).
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return url;
    }
  } catch {
    return url;
  }

  return `/api/media/preview?url=${encodeURIComponent(url)}`;
}
