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

export function getDaysLeft(date: Date | string) {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}
