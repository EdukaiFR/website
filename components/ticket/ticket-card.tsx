"use client";

import { memo } from "react";
import type { Ticket } from "@/lib/types/ticket";
import { StatusBadge } from "@/components/ticket/status-badge";
import {
  TYPE_LABELS,
  TYPE_COLORS,
  DEFAULT_TYPE_COLOR,
  CATEGORY_LABELS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  DEFAULT_URGENCY_COLOR,
  translateLabel,
} from "@/lib/constants/ticket";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bug,
  Lightbulb,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  FileText,
} from "lucide-react";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bug: Bug,
  feature_request: Lightbulb,
  question: HelpCircle,
  improvement: TrendingUp,
  anomaly: AlertTriangle,
};

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

/**
 * Card displaying a ticket summary following the Quintyss dashboard layout.
 * Icon box on the left, badge row + title + meta row on the right.
 * @param ticket - The ticket data to display
 * @param onClick - Callback when the card is clicked
 * @returns A styled card component with icon, badges, title, and metadata
 */
export const TicketCard = memo(function TicketCard({
  ticket,
  onClick,
}: TicketCardProps) {
  const typeLabel = translateLabel(ticket.type, TYPE_LABELS, ticket.type);
  const categoryLabel = translateLabel(
    ticket.category,
    CATEGORY_LABELS,
    ticket.category
  );
  const urgencyLabel = translateLabel(
    ticket.clientUrgency,
    URGENCY_LABELS,
    ticket.clientUrgency
  );
  const typeColors = TYPE_COLORS[ticket.type] ?? DEFAULT_TYPE_COLOR;
  const urgencyColors =
    URGENCY_COLORS[ticket.clientUrgency] ?? DEFAULT_URGENCY_COLOR;
  const Icon = TYPE_ICONS[ticket.type] ?? FileText;

  const relativeDate = formatDistanceToNow(new Date(ticket.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <button
      type="button"
      onClick={() => onClick(ticket)}
      className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            typeColors.bg
          )}
        >
          <Icon className={cn("h-4 w-4", typeColors.text)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-gray-400">
              {ticket.reference}
            </span>
            <StatusBadge status={ticket.status} />
            {ticket.clientUrgency && (
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
            )}
          </div>

          <h3 className="mt-1.5 font-medium text-gray-900 truncate">
            {ticket.title}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            <span>{typeLabel}</span>
            <span className="text-gray-200">|</span>
            <span>{categoryLabel}</span>
            <span className="text-gray-200">|</span>
            <span>{relativeDate}</span>
          </div>
        </div>
      </div>
    </button>
  );
});
