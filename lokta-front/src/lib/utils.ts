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
