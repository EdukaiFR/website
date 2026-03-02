"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ticket/status-badge";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks";
import {
  URGENCY_COLORS,
  URGENCY_LABELS,
  DEFAULT_URGENCY_COLOR,
  translateLabel,
} from "@/lib/constants/ticket";
import { canReopenTicket } from "@/lib/utils/ticket-helpers";
import type { Ticket } from "@/lib/types/ticket";

interface TicketHeaderProps {
  ticket: Ticket;
  onReopen: () => void;
  isReopening?: boolean;
  className?: string;
}

/**
 * Ticket detail page header with back link, reference, badges, title, and reopen action.
 */
export function TicketHeader({
  ticket,
  onReopen,
  isReopening = false,
  className,
}: TicketHeaderProps) {
  const session = useSession();
  const [hasCopied, setHasCopied] = useState(false);

  const canReopen = canReopenTicket(ticket, session.user?._id ?? "");

  const priorityColors =
    URGENCY_COLORS[ticket.internalPriority] ?? DEFAULT_URGENCY_COLOR;
  const priorityLabel = translateLabel(
    ticket.internalPriority,
    URGENCY_LABELS,
    ticket.internalPriority
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(ticket.reference);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }, [ticket.reference]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/support"
            className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-mono text-gray-500 hover:text-gray-700 transition-colors"
          >
            {ticket.reference}
            {hasCopied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          <StatusBadge status={ticket.status} />

          {ticket.internalPriority && (
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
          )}
        </div>

        {canReopen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReopen}
            disabled={isReopening}
            className="shrink-0"
          >
            {isReopening ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-1.5" />
            )}
            Réouvrir
          </Button>
        )}
      </div>

      <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
    </div>
  );
}
