// Ticket Status Enum
export enum TicketStatus {
    NEW = "NEW",
    TRIAGED = "TRIAGED", 
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REOPENED = "REOPENED",
    REJECTED = "REJECTED",
    DUPLICATE = "DUPLICATE"
}

// Ticket Priority Enum
export enum TicketPriority {
    P0 = "P0", // Critique
    P1 = "P1", // Élevée  
    P2 = "P2", // Normale
    P3 = "P3"  // Faible
}

// Ticket Type Enum
export enum TicketType {
    BUG = "BUG",
    FEATURE = "FEATURE",
    SUPPORT = "SUPPORT",
    IMPROVEMENT = "IMPROVEMENT",
    OTHER = "OTHER"
}

// Ticket Category Enum
export enum TicketCategory {
    TECHNICAL = "TECHNICAL",
    BILLING = "BILLING",
    ACCOUNT = "ACCOUNT",
    PLATFORM = "PLATFORM",
    OTHER = "OTHER"
}

// Ticket Severity Enum
export enum TicketSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM", 
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

// Base Ticket Interface
export interface Ticket {
    id: string;
    _id: string; // MongoDB ObjectId
    publicId: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    type: TicketType;
    category?: string;
    userId: string;
    assignedTo?: string;
    reporter?: {
        userId: string;
        name: string;
        email: string;
    };
    context?: {
        pageUrl: string;
        appVersion?: string;
        locale?: string;
        userAgent?: string;
        viewport?: {
            w: number;
            h: number;
        };
    };
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    closedAt?: string;
    tags?: string[];
    attachments?: string[];
}

// Ticket Comment Interface
export interface TicketComment {
    id: string;
    _id: string;
    ticketId: string;
    userId: string;
    content: string;
    body: string; // For compatibility
    isInternal: boolean;
    visibility: CommentVisibility;
    author: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    createdAt: string;
    updatedAt: string;
    at: string; // For compatibility with createdAt
}

// Ticket with Comments
export interface TicketWithComments extends Ticket {
    ticket: Ticket; // For compatibility
    comments: TicketComment[];
}

// Statistics Interface
export interface TicketStatistics {
    total: number;
    byStatus: Record<TicketStatus, number>;
    byPriority: Record<TicketPriority, number>;
    byType: Record<TicketType, number>;
    averageResolutionTime?: number;
    recentActivity: number;
}

// Pagination Interface
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// File Upload Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain'
] as const;

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

// Attachment Types
export enum AttachmentKind {
    IMAGE = 'IMAGE',
    DOCUMENT = 'DOCUMENT',
    OTHER = 'OTHER'
}

export interface TicketAttachment {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    kind: AttachmentKind;
    url: string;
    uploadedAt: string;
}

// Comment Visibility Enum
export enum CommentVisibility {
    PUBLIC = 'PUBLIC',
    INTERNAL = 'INTERNAL'
}

// Constants
export const DEFAULT_PAGE_LIMIT = 20;

// API Request/Response Types

// Create Ticket
export interface CreateTicketRequest {
    title: string;
    description: string;
    priority: TicketPriority;
    type: TicketType;
    category?: TicketCategory;
    severityPerceived?: TicketSeverity;
    context?: {
        pageUrl: string;
        appVersion?: string;
        locale?: string;
        userAgent?: string;
    };
    tags?: string[];
    attachments?: string[];
}

export interface CreateTicketResponse {
    success: boolean;
    data?: Ticket;
    message?: string;
    error?: string;
}

// Get Tickets
export interface GetTicketsParams {
    status?: TicketStatus;
    priority?: TicketPriority;
    type?: TicketType;
    assignedTo?: string;
    userId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export interface GetTicketsResponse {
    success: boolean;
    data?: {
        tickets: Ticket[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
    message?: string;
    error?: string;
}

// Get Single Ticket
export interface GetTicketResponse {
    success: boolean;
    data?: TicketWithComments;
    message?: string;
    error?: string;
}

// Update Ticket
export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    type?: TicketType;
    assignedTo?: string;
    tags?: string[];
}

export interface UpdateTicketResponse {
    success: boolean;
    data?: Ticket;
    message?: string;
    error?: string;
}

// Add Comment Response
export interface AddCommentResponse {
    success: boolean;
    data?: TicketComment;
    message?: string;
    error?: string;
}

// Reopen Ticket
export interface ReopenTicketResponse {
    success: boolean;
    data?: Ticket;
    message?: string;
    error?: string;
}

// Admin-specific types
export interface AdminGetTicketsParams extends GetTicketsParams {
    userId?: string;
    includeResolved?: boolean;
}

export interface AdminGetTicketsResponse {
    success: boolean;
    data?: {
        tickets: TicketWithComments[];
        statistics: TicketStatistics;
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
    message?: string;
    error?: string;
}

// Add Comment Request (Updated - removed duplicate)
export interface AddCommentRequest {
    content: string;
    body?: string; // For compatibility with some APIs
    visibility?: CommentVisibility;
    isInternal?: boolean;
}

// Filter Options for UI
export interface TicketFilterOptions {
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    types: TicketType[];
    assignees: { id: string; name: string }[];
}

// Ticket Action Types
export type TicketAction = 
    | { type: 'ASSIGN'; assignedTo: string }
    | { type: 'CHANGE_STATUS'; status: TicketStatus }
    | { type: 'CHANGE_PRIORITY'; priority: TicketPriority }
    | { type: 'ADD_TAG'; tag: string }
    | { type: 'REMOVE_TAG'; tag: string }
    | { type: 'ADD_COMMENT'; comment: AddCommentRequest };

// Utility type for ticket updates
export type TicketUpdate = Partial<Pick<Ticket, 'title' | 'description' | 'status' | 'priority' | 'type' | 'assignedTo' | 'tags'>>;