import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type {
  Ticket,
  TicketMessage,
  TicketStatus,
  PopulatedUser,
} from "@/lib/types/ticket";
import { MAX_REOPEN_COUNT } from "@/lib/types/ticket";

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

/** Full date: "2 mars 2026 à 14:30" */
export function formatTicketDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

/** Relative date: "il y a 2 heures" */
export function formatTicketRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: fr,
  });
}

/** Compact relative date for tables: "< 1 min", "3 min", "2 h", "1 j", "3 sem", etc. */
export function formatCompactRelativeDate(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} h`;
  if (days < 7) return `${days} j`;
  if (weeks < 5) return `${weeks} sem`;
  return `${months} mois`;
}

/** Time only: "14:30" */
export function formatMessageTime(dateStr: string): string {
  return format(new Date(dateStr), "HH:mm", { locale: fr });
}

/** Day separator: "2 mars 2026" */
export function formatDateSeparator(dateStr: string): string {
  return format(new Date(dateStr), "d MMMM yyyy", { locale: fr });
}

/** Check if two date strings fall on the same calendar day. */
export function isSameDay(a: string, b: string): boolean {
  return (
    format(new Date(a), "yyyy-MM-dd") === format(new Date(b), "yyyy-MM-dd")
  );
}

// ---------------------------------------------------------------------------
// Populated field resolvers
// ---------------------------------------------------------------------------

/** Extract the ID string from a field that may be a plain string or a populated object. */
export function resolveId(field: string | PopulatedUser | undefined): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field._id;
}

/** Extract display name from a populated user field. Returns null if empty. */
export function resolveUserName(
  field: string | PopulatedUser | undefined
): string | null {
  if (!field) return null;
  if (typeof field === "string") return field;
  return `${field.firstName} ${field.lastName}`;
}

// ---------------------------------------------------------------------------
// Permission checks
// ---------------------------------------------------------------------------

/**
 * Returns true when the ticket can be reopened by the given user.
 * Conditions: status is "resolved", reopen limit not reached, user is the author.
 */
export function canReopenTicket(ticket: Ticket, userId: string): boolean {
  return (
    ticket.status === "resolved" &&
    ticket.reopenCount < MAX_REOPEN_COUNT &&
    ticket.author === userId
  );
}

// ---------------------------------------------------------------------------
// Status transitions (mirrors backend ticketAdmin.ts)
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["in_progress"],
  in_progress: ["waiting_for_client", "resolved"],
  waiting_for_client: ["in_progress"],
  resolved: ["closed", "open"],
  closed: ["open"],
};

/** Returns the list of statuses the ticket can transition to from its current status. */
export function getStatusTransitions(status: TicketStatus): TicketStatus[] {
  return VALID_TRANSITIONS[status] ?? [];
}

// ---------------------------------------------------------------------------
// Unread detection
// ---------------------------------------------------------------------------

/** Check if a single message is unread by the given user. */
export function isMessageUnread(
  message: TicketMessage,
  userId: string
): boolean {
  if (resolveId(message.senderId) === userId) return false;
  if (message.visibility === "internal") return false;
  return !message.readBy.some((r) => r.userId === userId);
}

/**
 * Returns true if there are any unread public messages not sent by the user.
 */
export function hasUnreadMessages(
  messages: TicketMessage[],
  userId: string
): boolean {
  return messages.some((m) => isMessageUnread(m, userId));
}
