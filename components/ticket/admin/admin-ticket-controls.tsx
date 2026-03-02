"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getStatusTransitions, resolveId } from "@/lib/utils/ticket-helpers";
import {
  STATUS_LABELS,
  URGENCY_LABELS,
} from "@/lib/constants/ticket";
import type { Ticket, TicketStatus, AdminUser } from "@/lib/types/ticket";

interface AdminTicketControlsProps {
  ticket: Ticket;
  adminUsers: AdminUser[];
  pendingField: string | null;
  onStatusChange: (status: TicketStatus) => void;
  onPriorityChange: (priority: string) => void;
  onAssigneeChange: (userId: string) => void;
  onTagsSave: (tags: string[]) => void;
}

/**
 * Admin-only controls for changing ticket status, priority, assignee, and tags.
 * @param ticket - The current ticket data
 * @param adminUsers - List of admin users for the assignee dropdown
 * @param pendingField - Which field is currently being updated (for loading state)
 * @param onStatusChange - Callback when status is changed
 * @param onPriorityChange - Callback when priority is changed
 * @param onAssigneeChange - Callback when assignee is changed
 * @param onTagsSave - Callback when tags are saved
 */
export function AdminTicketControls({
  ticket,
  adminUsers,
  pendingField,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onTagsSave,
}: AdminTicketControlsProps) {
  const [tagsInput, setTagsInput] = useState(ticket.tags.join(", "));

  const statusTransitions = getStatusTransitions(ticket.status);

  const handleTagsSave = useCallback(() => {
    const newTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const currentTags = ticket.tags.join(",");
    const newTagsStr = newTags.join(",");
    if (currentTags === newTagsStr) return;
    onTagsSave(newTags);
  }, [tagsInput, ticket.tags, onTagsSave]);

  const handleTagsKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTagsSave();
      }
    },
    [handleTagsSave]
  );

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Actions admin
      </p>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Changer le statut</label>
        {statusTransitions.length > 0 ? (
          <div className="relative">
            <Select
              value={ticket.status}
              onValueChange={(v) => onStatusChange(v as TicketStatus)}
              disabled={pendingField === "status"}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ticket.status}>
                  {STATUS_LABELS[ticket.status] ?? ticket.status} (actuel)
                </SelectItem>
                {statusTransitions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pendingField === "status" && (
              <Loader2 className="absolute right-8 top-2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Aucune transition disponible
          </p>
        )}
      </div>

      {/* Priority */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Priorité interne</label>
        <div className="relative">
          <Select
            value={ticket.internalPriority || "medium"}
            onValueChange={onPriorityChange}
            disabled={pendingField === "priority"}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(URGENCY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pendingField === "priority" && (
            <Loader2 className="absolute right-8 top-2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Assignee */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Assigné à</label>
        <div className="relative">
          <Select
            value={resolveId(ticket.assignedTo) || "__none__"}
            onValueChange={onAssigneeChange}
            disabled={pendingField === "assignee"}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Non assigné" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Non assigné</SelectItem>
              {adminUsers.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pendingField === "assignee" && (
            <Loader2 className="absolute right-8 top-2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">
          Tags (séparés par des virgules)
        </label>
        <div className="relative">
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={handleTagsSave}
            onKeyDown={handleTagsKeyDown}
            disabled={pendingField === "tags"}
            placeholder="bug, urgent, ..."
            className="h-8 text-xs"
          />
          {pendingField === "tags" && (
            <Loader2 className="absolute right-8 top-2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
