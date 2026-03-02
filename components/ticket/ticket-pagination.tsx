"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export { DEFAULT_PAGE_SIZE } from "@/lib/constants/ticket";

interface TicketPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TicketPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TicketPaginationProps) {
  const [jumpValue, setJumpValue] = useState("");

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const handleJump = useCallback(() => {
    const target = parseInt(jumpValue, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      onPageChange(target);
      setJumpValue("");
    }
  }, [jumpValue, totalPages, onPageChange]);

  const pageNumbers = buildPageNumbers(page, totalPages);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-3 shadow-sm">
      {/* Result count + page size */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="font-medium">
          {startItem}-{endItem} sur {totalItems} résultats
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[80px] border-blue-200 focus:ring-blue-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="hidden sm:inline text-gray-400">par page</span>
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:text-gray-300 disabled:border-gray-200 disabled:hover:bg-transparent"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-1 text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className={
                  p === page
                    ? "h-8 w-8 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md border-0"
                    : "h-8 w-8 text-sm border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                }
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:text-gray-300 disabled:border-gray-200 disabled:hover:bg-transparent"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Jump to page */}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJump();
              }}
              placeholder="Page"
              className="h-8 w-16 rounded-xl border border-blue-200 px-2 text-sm text-center outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold disabled:text-gray-300 disabled:border-gray-200"
              onClick={handleJump}
              disabled={!jumpValue}
            >
              Aller
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function buildPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}
