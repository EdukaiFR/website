"use client";

import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_LABELS, URGENCY_LABELS } from "@/lib/constants/ticket";
import type { AdminUser, TicketStatus } from "@/lib/types/ticket";

interface AdminBulkToolbarProps {
  selectedCount: number;
  adminUsers: AdminUser[];
  isUpdating: boolean;
  onBulkStatusChange: (status: TicketStatus) => void;
  onBulkAssign: (userId: string) => void;
  onBulkPriorityChange: (priority: string) => void;
  onClearSelection: () => void;
}

const ALL_STATUSES: TicketStatus[] = [
  "open",
  "in_progress",
  "waiting_for_client",
  "resolved",
  "closed",
];

/**
 * Fixed bottom toolbar for bulk actions on selected tickets.
 * Shows status change, assignment, and priority change dropdowns.
 */
export function AdminBulkToolbar({
  selectedCount,
  adminUsers,
  isUpdating,
  onBulkStatusChange,
  onBulkAssign,
  onBulkPriorityChange,
  onClearSelection,
}: AdminBulkToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-2xl px-5 py-3">
        {isUpdating && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 shrink-0" />
        )}

        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {selectedCount} ticket{selectedCount > 1 ? "s" : ""} sélectionné
          {selectedCount > 1 ? "s" : ""}
        </span>

        <div className="h-5 w-px bg-gray-200" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating}
              className="text-xs"
            >
              Statut
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {ALL_STATUSES.map((s) => (
              <DropdownMenuItem key={s} onClick={() => onBulkStatusChange(s)}>
                {STATUS_LABELS[s] ?? s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating}
              className="text-xs"
            >
              Priorité
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(URGENCY_LABELS).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onBulkPriorityChange(key)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating}
              className="text-xs"
            >
              Assigner à
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {adminUsers.map((user) => (
              <DropdownMenuItem
                key={user._id}
                onClick={() => onBulkAssign(user._id)}
              >
                {user.firstName} {user.lastName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-gray-200" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          disabled={isUpdating}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Désélectionner</span>
        </Button>
      </div>
    </div>
  );
}
