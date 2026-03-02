import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type {
  Ticket,
  TicketMessage,
  TicketStatus,
  TicketUrgency,
  PopulatedUser,
} from "@/lib/types/ticket";
import { MAX_REOPEN_COUNT } from "@/lib/types/ticket";
import {
  STATUS_COLORS,
  DEFAULT_STATUS_COLOR,
  URGENCY_COLORS,
  DEFAULT_URGENCY_COLOR,
} from "@/lib/constants/ticket";

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Format a date as relative for recent dates (< 7 days) or absolute for older ones.
 * @param dateStr - ISO date string to format
 * @returns Relative string ("il y a 2 heures") or absolute ("15 fév. 2026")
 */
export function formatTicketDate(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < SEVEN_DAYS_MS) {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }
  return format(date, "d MMM yyyy", { locale: fr });
}

/**
 * Format a date as a full absolute timestamp with time.
 * @param dateStr - ISO date string to format
 * @returns Formatted string like "2 mars 2026 à 14:30"
 */
export function formatTicketDateFull(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

/**
 * Format a date as a relative string from now.
 * @param dateStr - ISO date string to format
 * @returns Relative string like "il y a 2 heures"
 */
export function formatTicketRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: fr,
  });
}

/**
 * Format a date as a compact relative string for table display.
 * @param dateStr - ISO date string to format
 * @returns Compact string like "< 1 min", "3 min", "2 h", "1 j", "3 sem", "3 mois"
 */
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

/**
 * Format a date as time only (hours and minutes).
 * @param dateStr - ISO date string to format
 * @returns Time string like "14:30"
 */
export function formatMessageTime(dateStr: string): string {
  return format(new Date(dateStr), "HH:mm", { locale: fr });
}

/**
 * Format a date as a day separator label.
 * @param dateStr - ISO date string to format
 * @returns Full date string like "2 mars 2026"
 */
export function formatDateSeparator(dateStr: string): string {
  return format(new Date(dateStr), "d MMMM yyyy", { locale: fr });
}

/**
 * Check if two date strings fall on the same calendar day.
 * @param a - First ISO date string
 * @param b - Second ISO date string
 * @returns True if both dates are on the same calendar day
 */
export function isSameDay(a: string, b: string): boolean {
  return (
    format(new Date(a), "yyyy-MM-dd") === format(new Date(b), "yyyy-MM-dd")
  );
}

// ---------------------------------------------------------------------------
// Populated field resolvers
// ---------------------------------------------------------------------------

/**
 * Extract the ID string from a field that may be a plain string or a populated object.
 * @param field - A plain string ID, a PopulatedUser object, or undefined
 * @returns The extracted ID string, or empty string if undefined
 */
export function resolveId(field: string | PopulatedUser | undefined): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field._id;
}

/**
 * Extract a display name from a populated user field.
 * @param field - A plain string, a PopulatedUser object, or undefined
 * @returns The display name ("firstName lastName"), the raw string, or null if empty
 */
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
 * Check whether a ticket can be reopened by the given user.
 * Conditions: status is "resolved", reopen limit not reached, user is the author.
 * @param ticket - The ticket to check
 * @param userId - The ID of the user attempting to reopen
 * @returns True if the user can reopen the ticket
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

/**
 * Get the list of valid next statuses for a given ticket status.
 * @param status - The current ticket status
 * @returns Array of statuses the ticket can transition to
 */
export function getStatusTransitions(status: TicketStatus): TicketStatus[] {
  return VALID_TRANSITIONS[status] ?? [];
}

// ---------------------------------------------------------------------------
// Unread detection
// ---------------------------------------------------------------------------

/**
 * Check if a single message is unread by the given user.
 * A message is considered read if sent by the user, is internal, or has a readBy entry.
 * @param message - The ticket message to check
 * @param userId - The ID of the current user
 * @returns True if the message is unread by the user
 */
export function isMessageUnread(
  message: TicketMessage,
  userId: string
): boolean {
  if (resolveId(message.senderId) === userId) return false;
  if (message.visibility === "internal") return false;
  return !message.readBy.some((r) => r.userId === userId);
}

/**
 * Check if there are any unread public messages not sent by the user.
 * @param messages - Array of ticket messages to check
 * @param userId - The ID of the current user
 * @returns True if at least one message is unread
 */
export function hasUnreadMessages(
  messages: TicketMessage[],
  userId: string
): boolean {
  return messages.some((m) => isMessageUnread(m, userId));
}

// ---------------------------------------------------------------------------
// Badge colors
// ---------------------------------------------------------------------------

/**
 * Get Tailwind CSS classes for a ticket status badge.
 * @param status - The ticket status key (e.g. "open", "resolved")
 * @returns Object with bg, text, and dot Tailwind class strings
 */
export function getStatusBadgeColor(
  status: string
): { bg: string; text: string; dot: string } {
  return STATUS_COLORS[status as TicketStatus] ?? DEFAULT_STATUS_COLOR;
}

/**
 * Get Tailwind CSS classes for a priority/urgency badge.
 * @param priority - The priority key (e.g. "low", "critical")
 * @returns Object with bg, text, and border Tailwind class strings
 */
export function getPriorityBadgeColor(
  priority: string
): { bg: string; text: string; border: string } {
  return URGENCY_COLORS[priority as TicketUrgency] ?? DEFAULT_URGENCY_COLOR;
}
