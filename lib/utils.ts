import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysLeft(date: Date) {
  const today = new Date();
  const timeDiff = date.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}
