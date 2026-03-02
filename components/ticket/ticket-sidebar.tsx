"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  formatTicketDateFull,
  formatTicketRelativeDate,
  getStatusTransitions,
  resolveId,
  resolveUserName,
} from "@/lib/utils/ticket-helpers";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ticket/status-badge";
import { cn } from "@/lib/utils";
import { useTicketService } from "@/services/ticket";
import { isApiSuccess } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  DEFAULT_STATUS_COLOR,
  TYPE_LABELS,
  TYPE_COLORS,
  DEFAULT_TYPE_COLOR,
  CATEGORY_LABELS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  DEFAULT_URGENCY_COLOR,
  translateLabel,
} from "@/lib/constants/ticket";
import type { Ticket, TicketStatus, AdminUser } from "@/lib/types/ticket";

interface TicketSidebarProps {
  ticket: Ticket;
  isAdmin?: boolean;
  onTicketUpdate?: (ticket: Ticket) => void;
  className?: string;
}

function MetadataRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-sm font-medium text-gray-900">{children}</div>
    </div>
  );
}

/**
 * Sidebar displaying ticket metadata, timestamps, status history,
 * and admin controls (status, priority, assignee, tags) when isAdmin is true.
 */
export function TicketSidebar({
  ticket,
  isAdmin = false,
  onTicketUpdate,
  className,
}: TicketSidebarProps) {
  const ticketService = useTicketService();
  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

  const [historyOpen, setHistoryOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [pendingField, setPendingField] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState(ticket.tags.join(", "));

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    async function fetchAdmins() {
      const result = await serviceRef.current.getAdminUsers();
      if (isApiSuccess(result) && result.data && !cancelled) {
        setAdminUsers(result.data);
      }
    }
    fetchAdmins();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  useEffect(() => {
    setTagsInput(ticket.tags.join(", "));
  }, [ticket.tags]);

  const handleUpdate = useCallback(
    async (
      field: string,
      data: Parameters<typeof ticketService.updateTicket>[1],
      successToast: () => void
    ) => {
      setPendingField(field);
      try {
        const result = await serviceRef.current.updateTicket(ticket._id, data);
        if (isApiSuccess(result) && result.data) {
          successToast();
          onTicketUpdate?.(result.data);
        } else {
          ticketToast.updateError(result.message);
        }
      } catch (_error: unknown) {
        ticketToast.updateError();
      } finally {
        setPendingField(null);
      }
    },
    [ticket._id, onTicketUpdate]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      handleUpdate(
        "status",
        { status: value as TicketStatus },
        ticketToast.statusChangeSuccess
      );
    },
    [handleUpdate]
  );

  const handlePriorityChange = useCallback(
    (value: string) => {
      handleUpdate(
        "priority",
        { internalPriority: value },
        ticketToast.priorityUpdateSuccess
      );
    },
    [handleUpdate]
  );

  const handleAssigneeChange = useCallback(
    (value: string) => {
      handleUpdate(
        "assignee",
        { assignedTo: value === "__none__" ? "" : value },
        ticketToast.assignSuccess
      );
    },
    [handleUpdate]
  );

  const handleTagsSave = useCallback(() => {
    const newTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const currentTags = ticket.tags.join(",");
    const newTagsStr = newTags.join(",");
    if (currentTags === newTagsStr) return;
    handleUpdate("tags", { tags: newTags }, ticketToast.tagsUpdateSuccess);
  }, [tagsInput, ticket.tags, handleUpdate]);

  const handleTagsKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTagsSave();
      }
    },
    [handleTagsSave]
  );

  const typeColors = TYPE_COLORS[ticket.type] ?? DEFAULT_TYPE_COLOR;
  const typeLabel = translateLabel(ticket.type, TYPE_LABELS, ticket.type);
  const categoryLabel = translateLabel(
    ticket.category,
    CATEGORY_LABELS,
    ticket.category
  );
  const urgencyColors =
    URGENCY_COLORS[ticket.clientUrgency] ?? DEFAULT_URGENCY_COLOR;
  const urgencyLabel = translateLabel(
    ticket.clientUrgency,
    URGENCY_LABELS,
    ticket.clientUrgency
  );
  const priorityColors =
    URGENCY_COLORS[ticket.internalPriority] ?? DEFAULT_URGENCY_COLOR;
  const priorityLabel = translateLabel(
    ticket.internalPriority,
    URGENCY_LABELS,
    ticket.internalPriority
  );

  const statusTransitions = getStatusTransitions(ticket.status);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100",
        className
      )}
    >
      {/* Metadata */}
      <div className="p-4 space-y-0.5">
        <MetadataRow label="Statut">
          <StatusBadge status={ticket.status} />
        </MetadataRow>

        <MetadataRow label="Priorité">
          {ticket.internalPriority ? (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium",
                priorityColors.bg,
                priorityColors.text,
                priorityColors.border
              )}
            >
              {priorityLabel}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Non définie</span>
          )}
        </MetadataRow>

        <MetadataRow label="Type">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
              typeColors.bg,
              typeColors.text
            )}
          >
            {typeLabel}
          </span>
        </MetadataRow>

        <MetadataRow label="Catégorie">
          {categoryLabel}
        </MetadataRow>

        <MetadataRow label="Urgence">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium",
              urgencyColors.bg,
              urgencyColors.text,
              urgencyColors.border
            )}
          >
            {urgencyLabel}
          </span>
        </MetadataRow>

        <MetadataRow label="Assigné à">
          {resolveUserName(ticket.assignedTo) ?? (
            <span className="text-gray-400">Non assigné</span>
          )}
        </MetadataRow>

        {ticket.tags.length > 0 && (
          <MetadataRow label="Tags">
            <div className="flex flex-wrap gap-1 justify-end">
              {ticket.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </MetadataRow>
        )}
      </div>

      {/* Timestamps */}
      <div className="p-4 space-y-0.5">
        <MetadataRow label="Créé le">{formatTicketDateFull(ticket.createdAt)}</MetadataRow>
        <MetadataRow label="Mis à jour">
          {formatTicketRelativeDate(ticket.updatedAt)}
        </MetadataRow>
        <MetadataRow label="Première réponse">
          {ticket.firstResponseAt ? formatTicketDateFull(ticket.firstResponseAt) : "—"}
        </MetadataRow>
        <MetadataRow label="Résolu le">
          {ticket.resolvedAt ? formatTicketDateFull(ticket.resolvedAt) : "—"}
        </MetadataRow>
        <MetadataRow label="Fermé le">
          {ticket.closedAt ? formatTicketDateFull(ticket.closedAt) : "—"}
        </MetadataRow>
      </div>

      {/* Status history */}
      {ticket.statusHistory.length > 0 && (
        <div className="p-4">
          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Historique des statuts
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  historyOpen && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-3">
                {ticket.statusHistory.map((entry, i) => {
                  const toColors =
                    STATUS_COLORS[entry.to] ?? DEFAULT_STATUS_COLOR;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1.5">
                        <span
                          className={cn(
                            "block h-2.5 w-2.5 rounded-full",
                            toColors.dot
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={entry.from} />
                          <span className="text-xs text-gray-400">→</span>
                          <StatusBadge status={entry.to} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTicketDateFull(entry.changedAt)}
                          {entry.reason && (
                            <span className="ml-1">— {entry.reason}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* Admin controls */}
      {isAdmin && (
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
                  onValueChange={handleStatusChange}
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
                onValueChange={handlePriorityChange}
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
                onValueChange={handleAssigneeChange}
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
      )}
    </div>
  );
}
