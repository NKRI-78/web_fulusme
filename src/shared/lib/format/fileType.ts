// lib/fileType.ts
export function inferFileName(src: string): string {
  try {
    const u = new URL(
      src,
      typeof window !== "undefined" ? window.location.href : "http://localhost"
    );
    const name = u.pathname.split("/").pop() || "";
    return decodeURIComponent(name.split("?")[0]);
  } catch {
    return src.split("/").pop() || "";
  }
}
