"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton placeholder matching the TicketCard Quintyss layout for loading states.
 * @returns A skeleton card with icon box, badges, title, and meta row placeholders
 */
export function TicketCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
          <Skeleton className="h-5 w-3/4 mt-1.5" />
          <div className="flex items-center gap-3 mt-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
