import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePriceRange(min: number, max: number, step: number) {
  const range = [];
  for (let i = min; i < max; i += step) {
    range.push([i, i + step]);
  }
  return range;
}

export const FULL_HOUR_TIME_MS = 3600000;
export const FULL_DAY_TIME_MS = 86400000;