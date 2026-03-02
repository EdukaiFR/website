export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_client"
  | "resolved"
  | "closed";

export type TicketType =
  | "bug"
  | "feature_request"
  | "question"
  | "improvement"
  | "anomaly";

export type TicketCategory =
  | "course_generation"
  | "quiz"
  | "statistics"
  | "authentication"
  | "payments"
  | "import_export"
  | "ui_ux"
  | "performance"
  | "other";

export type TicketUrgency = "low" | "medium" | "high" | "critical";

export type UserRole = "user" | "admin" | "triage" | "dev";

export type TicketSenderRole = "client" | "admin" | "system";

export type TicketVisibility = "public" | "internal";

export type TicketConfigType =
  | "ticket_type"
  | "ticket_category"
  | "urgency_level"
  | "ticket_priority"
  | "ticket_status";

export interface TicketConfigValue {
  key: string;
  label: string;
  color?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface TicketConfig {
  _id: string;
  type: TicketConfigType;
  values: TicketConfigValue[];
}

export interface TicketAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  /** Base64-encoded file content */
  data: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface StatusHistoryEntry {
  from: TicketStatus;
  to: TicketStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
}

export interface Ticket {
  _id: string;
  /** Format: EK-XXXXXX */
  reference: string;
  author: string;
  assignedTo?: string | PopulatedUser;
  type: TicketType;
  category: TicketCategory;
  tags: string[];
  title: string;
  description: string;
  attachments: TicketAttachment[];
  clientUrgency: TicketUrgency;
  internalPriority: TicketUrgency;
  status: TicketStatus;
  statusHistory: StatusHistoryEntry[];
  reopenCount: number;
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  unreadCount?: number;
}

export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
}

export interface TicketMessage {
  _id: string;
  ticketId: string;
  senderId: string | PopulatedUser;
  senderRole: TicketSenderRole;
  visibility: TicketVisibility;
  content: string;
  attachments: TicketAttachment[];
  readBy: ReadReceipt[];
  createdAt: string;
  editedAt?: string;
}

export interface TicketStatistics {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byCategory: Record<string, number>;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  type: TicketType;
  category: TicketCategory;
  clientUrgency: TicketUrgency;
  tags?: string[];
  attachments?: TicketAttachment[];
}

export interface CreateMessageRequest {
  content: string;
  visibility?: TicketVisibility;
  attachments?: TicketAttachment[];
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  internalPriority?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePic?: string;
  role: UserRole;
}

export interface TicketListParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: string;
  category?: string;
  urgency?: string;
  assignedTo?: string;
}

/** 5 MB */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const MAX_REOPEN_COUNT = 3;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** Polling interval for new messages in milliseconds */
export const POLLING_INTERVAL_MS = 20_000;
