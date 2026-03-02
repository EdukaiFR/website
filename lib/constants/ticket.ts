/**
 * French translation maps and color configurations for ticket display.
 * Used across ticket list, card, filters, and stats components.
 */

import type {
  TicketStatus,
  TicketType,
  TicketCategory,
  TicketUrgency,
} from "@/lib/types/ticket";

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Ouvert",
  in_progress: "En cours",
  waiting_for_client: "En attente",
  resolved: "Résolu",
  closed: "Fermé",
};

export const STATUS_COLORS: Record<
  TicketStatus,
  { bg: string; text: string; dot: string }
> = {
  open: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  in_progress: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  waiting_for_client: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  resolved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  closed: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

export const DEFAULT_STATUS_COLOR = {
  bg: "bg-gray-100",
  text: "text-gray-600",
  dot: "bg-gray-400",
};

export const TYPE_LABELS: Record<TicketType, string> = {
  bug: "Bug",
  feature_request: "Nouvelle fonctionnalité",
  question: "Question",
  improvement: "Amélioration",
  anomaly: "Anomalie",
};

export const TYPE_COLORS: Record<TicketType, { bg: string; text: string }> = {
  bug: { bg: "bg-red-100", text: "text-red-600" },
  feature_request: { bg: "bg-violet-100", text: "text-violet-600" },
  question: { bg: "bg-sky-100", text: "text-sky-600" },
  improvement: { bg: "bg-teal-100", text: "text-teal-600" },
  anomaly: { bg: "bg-orange-100", text: "text-orange-600" },
};

export const DEFAULT_TYPE_COLOR = { bg: "bg-gray-100", text: "text-gray-600" };

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  course_generation: "Génération de cours",
  quiz: "Quiz et évaluations",
  statistics: "Statistiques et analyses",
  authentication: "Authentification et compte",
  payments: "Paiements et facturation",
  import_export: "Import / Export",
  ui_ux: "Interface utilisateur",
  performance: "Performance",
  other: "Autre",
};

export const URGENCY_LABELS: Record<TicketUrgency, string> = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
  critical: "Critique",
};

export const URGENCY_COLORS: Record<
  TicketUrgency,
  { bg: string; text: string; border: string }
> = {
  low: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  high: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export const DEFAULT_URGENCY_COLOR = {
  bg: "bg-gray-50",
  text: "text-gray-600",
  border: "border-gray-200",
};

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export const DEFAULT_PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Filter types & defaults
// ---------------------------------------------------------------------------

export interface TicketFilterValues {
  search: string;
  status: string;
  type: string;
  category: string;
  urgency: string;
}

export const DEFAULT_FILTERS: TicketFilterValues = {
  search: "",
  status: "open",
  type: "",
  category: "",
  urgency: "",
};

export interface AdminTicketFilterValues {
  search: string;
  status: string;
  type: string;
  category: string;
  urgency: string;
  assignedTo: string;
}

export const DEFAULT_ADMIN_FILTERS: AdminTicketFilterValues = {
  search: "",
  status: "",
  type: "",
  category: "",
  urgency: "",
  assignedTo: "",
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Translate a key using a label map, falling back to a provided fallback.
 * @param key - The key to translate
 * @param labels - The label map to look up
 * @param fallback - Fallback value if key is not found
 * @returns The translated label or fallback
 */
export function translateLabel(
  key: string,
  labels: Record<string, string>,
  fallback: string
): string {
  return labels[key] ?? fallback;
}
