export const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND;
export const API_PG = process.env.NEXT_PUBLIC_API_PG;
export const API_BACKEND_MEDIA = process.env.NEXT_PUBLIC_API_BACKEND_MEDIA;

/**
 * Daftar host media-server yang diizinkan oleh proxy /api/media/preview
 * (dipisah koma). Bila kosong, fallback ke host dari API_BACKEND_MEDIA.
 */
export const MEDIA_ALLOWED_HOSTS = (
  process.env.NEXT_PUBLIC_MEDIA_ALLOWED_HOSTS ?? ""
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const IS_DEV = process.env.NODE_ENV === "development";
export const IS_PROD = process.env.NODE_ENV === "production";
