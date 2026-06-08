// utils/storage.ts

export function getLocalStorageItemSafe<T = any>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    return null;
  }
}
