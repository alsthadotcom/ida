import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProxiedAvatarUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If it's a Google image URL, proxy it to avoid tracking prevention issues
  if (url.includes('lh3.googleusercontent.com')) {
    return `/api/avatar?url=${encodeURIComponent(url)}`;
  }

  return url;
}
