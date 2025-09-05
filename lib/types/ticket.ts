// Types for Edukai Ticketing System
// Based on backend API documentation

// ===== ENUMS =====

export enum TicketStatus {
  NEW = "new",
  TRIAGED = "triaged", 
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REOPENED = "reopened",
  REJECTED = "rejected",
  DUPLICATE = "duplicate"
}

export enum TicketPriority {
  P0 = "P0", // Critical - System down, security issue
  P1 = "P1", // High - Major feature broken
  P2 = "P2", // Normal - Default priority
  P3 = "P3"  // Low - Minor issue, enhancement
}

export enum TicketCategory {
  UI = "UI",           // User interface issues
  PERF = "Perf",       // Performance problems
  DATA = "Data",       // Data inconsistencies
  ACCESS = "Access",   // Authentication/authorization
  OTHER = "Other"      // Other issues
}

export enum TicketSeverity {
  LOW = "low",
  MEDIUM = "medium", 
  HIGH = "high"
}

export enum AttachmentKind {
  IMAGE = "image",
  LOG = "log",
  OTHER = "other"
}

export enum CommentVisibility {
  PUBLIC = "public",   // Visible to ticket reporter
  INTERNAL = "internal" // Only visible to admin/triage team
}

export enum CommentAuthorRole {
  ADMIN = "admin",
  TRIAGE = "triage",
  DEV = "dev", 
  REPORTER = "reporter"
}

// ===== INTERFACES =====

export interface TicketAttachment {
  kind?: AttachmentKind;
  filename: string;
  mimeType: string;
  size?: number;
  data: string; // Base64 encoded file content
}

export interface TicketReporter {
  userId: string;
  name: string;
  email: string;
}

export interface TicketAssignee {
  userId: string;
  name: string;
  email: string;
}

export interface TicketContext {
  pageUrl: string; // Required: URL where issue occurred
  appVersion?: string;
  locale?: string;
  userAgent?: string;
  viewport?: {
    w: number;
    h: number;
  };
  meta?: Record<string, unknown>;
}

export interface Ticket {
  _id: string; // MongoDB ObjectId
  publicId: string; // Format: EK-XXXXXX (unique public identifier)
  title: string; // Required
  description: string; // Required
  status: TicketStatus; // Default: "new"
  priority: TicketPriority; // Default: "P2"
  category?: TicketCategory; // Optional
  severityPerceived?: TicketSeverity; // User's perceived severity
  reporter: TicketReporter;
  assignees?: TicketAssignee[]; // Optional assignees
  duplicateOf?: string; // Reference to original ticket if duplicate
  context: TicketContext;
  attachments?: TicketAttachment[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  triagedAt?: string; // Set when status changes to "triaged"
  resolvedAt?: string; // Set when status changes to "resolved"
  closedAt?: string; // Set when status changes to "closed"
}

export interface TicketCommentAuthor {
  userId: string;
  name: string;
  role: CommentAuthorRole;
}

export interface TicketComment {
  _id: string;
  ticketId: string;
  author: TicketCommentAuthor;
  body: string; // Markdown content
  visibility: CommentVisibility; // "public" or "internal"
  at: string; // Creation timestamp (note: uses 'at' not 'createdAt')
  updatedAt: string;
}

// ===== REQUEST TYPES =====

export interface CreateTicketRequest {
  title: string;
  description: string;
  category?: TicketCategory;
  severityPerceived?: TicketSeverity;
  priority?: TicketPriority;
  context: TicketContext;
  attachments?: TicketAttachment[];
}

export interface GetTicketsParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  reporter?: string;
  assignee?: string;
}

export interface AdminGetTicketsParams extends GetTicketsParams {
  search?: string; // Search in title, description, and publicId
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignees?: TicketAssignee[];
  duplicateOf?: string;
  category?: TicketCategory;
  severityPerceived?: TicketSeverity;
}

export interface AddCommentRequest {
  body: string;
  visibility?: CommentVisibility;
}

// ===== RESPONSE TYPES =====

export interface CreateTicketResponse {
  status: 'success';
  message: string;
  data: {
    ticketId: string;
    _id: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetTicketsResponse {
  status: 'success';
  data: {
    tickets: Ticket[];
    pagination: PaginationInfo;
  };
}

export interface GetTicketResponse {
  status: 'success';
  data: {
    ticket: Ticket;
    comments: TicketComment[];
  };
}

export interface UpdateTicketResponse {
  status: 'success';
  message: string;
  data: Ticket;
}

export interface AddCommentResponse {
  status: 'success';
  message: string;
  data: TicketComment;
}

export interface ReopenTicketResponse {
  status: 'success';
  message: string;
  data: {
    _id: string;
    status: TicketStatus;
    closedAt: string | null;
    resolvedAt: string | null;
    updatedAt: string;
  };
}

export interface ApiErrorResponse {
  status: 'failure';
  message: string;
  ticketId?: string; // For duplicate ticket errors
}

// ===== ADMIN-SPECIFIC TYPES =====

export interface TicketStatistics {
  total: number;
  byStatus: {
    [key in TicketStatus]: number;
  };
}

export interface AdminGetTicketsResponse {
  status: 'success';
  data: {
    tickets: Ticket[];
    pagination: PaginationInfo;
    statistics: TicketStatistics;
  };
}

// ===== UTILITY TYPES =====

export type TicketStatusColors = {
  [key in TicketStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export type TicketPriorityColors = {
  [key in TicketPriority]: {
    bg: string;
    text: string;
    border: string;
  };
};

export type TicketCategoryColors = {
  [key in TicketCategory]: {
    bg: string;
    text: string;
    border: string;
  };
};

// File validation constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'text/plain',
  'text/csv',
  'application/json',
  'application/pdf'
] as const;

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

// Default values
export const DEFAULT_TICKET_PRIORITY = TicketPriority.P2;
export const DEFAULT_TICKET_STATUS = TicketStatus.NEW;
export const DEFAULT_COMMENT_VISIBILITY = CommentVisibility.PUBLIC;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;