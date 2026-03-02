"use client";

import type { TicketStatus } from "@/lib/types/ticket";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  DEFAULT_STATUS_COLOR,
} from "@/lib/constants/ticket";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

/**
 * Display a ticket status as a colored badge with a dot indicator.
 * @param status - The ticket status key (e.g. "open", "in_progress")
 * @param className - Optional additional CSS classes
 * @returns A styled badge with French label and color-coded dot
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {label}
    </span>
  );
}
