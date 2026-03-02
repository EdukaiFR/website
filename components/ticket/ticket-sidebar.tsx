"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/ticket/status-badge";
import { cn } from "@/lib/utils";
import {
  STATUS_COLORS,
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
import type { Ticket } from "@/lib/types/ticket";

interface TicketSidebarProps {
  ticket: Ticket;
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

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy à HH:mm", { locale: fr });
}

function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: fr,
  });
}

/**
 * Sidebar displaying ticket metadata, timestamps, and status history.
 * Read-only for all users. Admin controls deferred to TRI-99.
 */
export function TicketSidebar({ ticket, className }: TicketSidebarProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

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
          {ticket.assignedTo ?? (
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
        <MetadataRow label="Créé le">{formatDate(ticket.createdAt)}</MetadataRow>
        <MetadataRow label="Mis à jour">
          {formatRelative(ticket.updatedAt)}
        </MetadataRow>
        <MetadataRow label="Première réponse">
          {ticket.firstResponseAt ? formatDate(ticket.firstResponseAt) : "—"}
        </MetadataRow>
        <MetadataRow label="Résolu le">
          {ticket.resolvedAt ? formatDate(ticket.resolvedAt) : "—"}
        </MetadataRow>
        <MetadataRow label="Fermé le">
          {ticket.closedAt ? formatDate(ticket.closedAt) : "—"}
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
                          {formatDate(entry.changedAt)}
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

      {/* TODO(TRI-99): admin controls for status/priority/assign */}
    </div>
  );
}
