import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function containsSubstring(str: string, subStr: string): boolean {
  return str.toLowerCase().includes(subStr.toLowerCase());
}

export const normalizeText = (text: string) => text.trim().toLowerCase();

export function getPercentage(correct: number, base: number): number {
  if (base === 0) return 0;
  return (correct / base) * 100;
}
