export const VALID_PAGE_SIZES = [10, 20, 50] as const;

/**
 * Parse a page size value from URL search params.
 * @param value - The raw string value (or null)
 * @param defaultSize - Fallback page size if value is invalid
 * @returns A valid page size from VALID_PAGE_SIZES, or the default
 */
export function parsePageSize(value: string | null, defaultSize: number): number {
  const num = Number(value);
  return (VALID_PAGE_SIZES as readonly number[]).includes(num) ? num : defaultSize;
}

/**
 * Parse a page number value from URL search params.
 * @param value - The raw string value (or null)
 * @returns A positive integer page number (minimum 1)
 */
export function parsePageNum(value: string | null): number {
  const num = Number(value);
  return num >= 1 ? Math.floor(num) : 1;
}
