"use client";

import { useMemo } from "react";
import type { Ticket } from "@/lib/types/ticket";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  DEFAULT_STATUS_COLOR,
} from "@/lib/constants/ticket";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TicketStatsBarProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const DISPLAYED_STATUSES = [
  "open",
  "in_progress",
  "waiting_for_client",
  "resolved",
  "closed",
] as const;

const SKELETON_COUNT = 6;

/**
 * Display a horizontal bar of ticket count statistics grouped by status.
 * @param tickets - Array of tickets to compute stats from
 * @param isLoading - Show skeleton placeholders while loading
 * @returns A grid of stat cards with counts and colored indicators
 */
export function TicketStatsBar({
  tickets,
  isLoading = false,
}: TicketStatsBarProps) {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ticket of tickets) {
      counts[ticket.status] = (counts[ticket.status] ?? 0) + 1;
    }
    return counts;
  }, [tickets]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Total"
        count={tickets.length}
        dotColor="bg-gray-400"
        bgColor="bg-gray-50"
        textColor="text-gray-700"
      />
      {DISPLAYED_STATUSES.map((status) => {
        const colors = STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
        return (
          <StatCard
            key={status}
            label={STATUS_LABELS[status] ?? status}
            count={stats[status] ?? 0}
            dotColor={colors.dot}
            bgColor={colors.bg}
            textColor={colors.text}
          />
        );
      })}
    </div>
  );
}

interface StatCardProps {
  label: string;
  count: number;
  dotColor: string;
  bgColor: string;
  textColor: string;
}

function StatCard({ label, count, dotColor, bgColor, textColor }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl p-3 border border-gray-100",
        bgColor
      )}
    >
      <span className={cn("text-xl font-bold", textColor)}>{count}</span>
      <span className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
        {label}
      </span>
    </div>
  );
}
