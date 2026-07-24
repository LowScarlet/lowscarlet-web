import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(date);
};

export function formatNumber(num: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
}

export const categoryTitles: Record<string, string> = {
  webs: "Web Applications",
  games: "Game Developments",
  androidApps: "Android Applications",
  desktopApps: "Desktop Applications",
  iot: "IoT & Hardware",
  uiux: "UI/UX Designs",
};

export function getCategoryTitle(category: string): string {
  if (categoryTitles[category]) {
    return categoryTitles[category];
  }
  return category
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}