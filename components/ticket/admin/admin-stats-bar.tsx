"use client";

import {
  STATUS_LABELS,
  STATUS_COLORS,
  DEFAULT_STATUS_COLOR,
} from "@/lib/constants/ticket";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TicketStatistics, TicketStatus } from "@/lib/types/ticket";

interface AdminStatsBarProps {
  statistics: TicketStatistics | null;
  activeStatus: string;
  onStatusClick: (status: string) => void;
  isLoading?: boolean;
}

const DISPLAYED_STATUSES: TicketStatus[] = [
  "open",
  "in_progress",
  "waiting_for_client",
  "resolved",
  "closed",
];

const SKELETON_COUNT = 6;

/**
 * Admin stats bar consuming API statistics for accurate global counts.
 * Cards are clickable to filter by status; active card gets a ring highlight.
 */
export function AdminStatsBar({
  statistics,
  activeStatus,
  onStatusClick,
  isLoading = false,
}: AdminStatsBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-xl" />
        ))}
      </div>
    );
  }

  const total = statistics?.total ?? 0;
  const byStatus: Record<string, number> = statistics?.byStatus ?? {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Total"
        count={total}
        dotColor="bg-gray-400"
        bgColor="bg-gray-50"
        textColor="text-gray-700"
        isActive={activeStatus === ""}
        onClick={() => onStatusClick("")}
      />
      {DISPLAYED_STATUSES.map((status) => {
        const colors = STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
        return (
          <StatCard
            key={status}
            label={STATUS_LABELS[status] ?? status}
            count={byStatus[status] ?? 0}
            dotColor={colors.dot}
            bgColor={colors.bg}
            textColor={colors.text}
            isActive={activeStatus === status}
            onClick={() =>
              onStatusClick(activeStatus === status ? "" : status)
            }
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
  isActive: boolean;
  onClick: () => void;
}

function StatCard({
  label,
  count,
  dotColor,
  bgColor,
  textColor,
  isActive,
  onClick,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl p-3 border transition-all cursor-pointer",
        bgColor,
        isActive
          ? "border-blue-400 ring-2 ring-blue-100"
          : "border-gray-100 hover:border-gray-200"
      )}
    >
      <span className={cn("text-xl font-bold", textColor)}>{count}</span>
      <span className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
        {label}
      </span>
    </button>
  );
}
