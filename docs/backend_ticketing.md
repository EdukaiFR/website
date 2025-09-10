# Edukai Ticketing System API Documentation

## Overview

This document provides comprehensive documentation for the Edukai ticketing system API endpoints. All endpoints require JWT authentication and follow REST conventions.

**Base URL**: node environment variable `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:3001`)

## Authentication

All endpoints require JWT authentication via cookies only.

**Cookie Authentication:**
```
Cookie: auth_token=your_jwt_token_here
```

**Note:** Authorization header authentication is not currently implemented.

**Authentication Error Response (401):**
```json
{
  "status": "failure",
  "message": "Non autorisé. Veuillez vous connecter."
}
```

## Data Models

### Ticket Model

```typescript
interface Ticket {
  _id: string;                    // MongoDB ObjectId
  publicId: string;               // Format: EK-XXXXXX (unique public identifier)
  title: string;                  // Required
  description: string;            // Required
  status: TicketStatus;           // Default: "new"
  priority: TicketPriority;       // Default: "P2"
  category?: TicketCategory;      // Optional
  severityPerceived?: TicketSeverity; // User's perceived severity
  reporter: {
    userId: string;
    name: string;
    email: string;
  };
  assignees?: Array<{             // Optional assignees
    userId: string;
    name: string;
    email: string;
  }>;
  duplicateOf?: string;           // Reference to original ticket if duplicate
  context: {
    pageUrl: string;              // Required: URL where issue occurred
    appVersion?: string;
    locale?: string;
    userAgent?: string;
    viewport?: {
      w: number;
      h: number;
    };
    meta?: Record<string, any>;
  };
  attachments?: Array<{
    kind?: AttachmentKind;
    filename: string;
    mimeType: string;
    size?: number;
    data: string;                 // Base64 encoded file content
  }>;
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
  triagedAt?: string;            // Set when status changes to "triaged"
  resolvedAt?: string;           // Set when status changes to "resolved"
  closedAt?: string;             // Set when status changes to "closed"
}
```

### Comment Model

```typescript
interface TicketComment {
  _id: string;
  ticketId: string;
  author: {
    userId: string;
    name: string;
    role: CommentAuthorRole;
  };
  body: string;                   // Markdown content
  visibility: CommentVisibility;  // "public" or "internal"
  at: string;                     // Creation timestamp (note: uses 'at' not 'createdAt')
  updatedAt: string;
}
```

### Enums

```typescript
enum TicketStatus {
  new = "new",
  triaged = "triaged", 
  in_progress = "in_progress",
  resolved = "resolved",
  closed = "closed",
  reopened = "reopened",
  rejected = "rejected",
  duplicate = "duplicate"
}

enum TicketPriority {
  P0 = "P0", // Critical - System down, security issue
  P1 = "P1", // High - Major feature broken
  P2 = "P2", // Normal - Default priority
  P3 = "P3"  // Low - Minor issue, enhancement
}

enum TicketCategory {
  UI = "UI",           // User interface issues
  Perf = "Perf",       // Performance problems
  Data = "Data",       // Data inconsistencies
  Access = "Access",   // Authentication/authorization
  Other = "Other"      // Other issues
}

enum TicketSeverity {
  low = "low",
  medium = "medium", 
  high = "high"
}

enum AttachmentKind {
  image = "image",
  log = "log",
  other = "other"
}

enum CommentVisibility {
  public = "public",   // Visible to ticket reporter
  internal = "internal" // Only visible to admin/triage team
}

enum CommentAuthorRole {
  admin = "admin",
  triage = "triage",
  dev = "dev", 
  reporter = "reporter"
}
```

## API Endpoints

### 1. Create Ticket

Create a new support ticket with optional file attachments.

**Endpoint:** `POST /api/tickets`

**Rate Limit:** Not currently implemented (defined as 5 tickets per 24 hours per user)

**Request Body:**
```json
{
  "title": "Login button not responding",
  "description": "When I click the login button on the homepage, nothing happens. The page doesn't redirect and no error message is shown.",
  "category": "UI",
  "severityPerceived": "high",
  "priority": "P1",
  "context": {
    "pageUrl": "https://edukai.fr/login",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "locale": "fr-FR",
    "viewport": {
      "w": 1920,
      "h": 1080
    },
    "appVersion": "1.2.3"
  },
  "attachments": [
    {
      "kind": "image",
      "filename": "login_error_screenshot.png",
      "mimeType": "image/png", 
      "size": 234567,
      "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    }
  ]
}
```

**Required Fields:**
- `title` (string): Brief description of the issue
- `description` (string): Detailed explanation of the problem  
- `context.pageUrl` (string): URL where the issue occurred

**Optional Fields:**
- `category` (TicketCategory): Issue categorization
- `severityPerceived` (TicketSeverity): User's perception of severity
- `priority` (TicketPriority): Priority level (defaults to P2)
- `context.*` (various): Additional context information
- `attachments` (array): File attachments (max 5MB per file)

**File Upload Constraints:**
- Maximum file size: 5MB per attachment
- Supported MIME types:
  - Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
  - Documents: `text/plain`, `text/csv`, `application/json`, `application/pdf`
- Files must be base64 encoded in the `data` field

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Ticket créé avec succès.",
  "data": {
    "ticketId": "EK-ABC123",
    "_id": "64a1b2c3d4e5f6789012345"
  }
}
```

**Error Responses:**
```json
// Validation Error (400)
{
  "status": "failure",
  "message": "Le titre est requis"
}

// File Too Large (400)
{
  "status": "failure", 
  "message": "La taille du fichier dépasse la limite de 5MB"
}

// Duplicate Ticket (409)
{
  "status": "failure",
  "message": "Un ticket similaire existe déjà",
  "ticketId": "EK-XYZ789"
}

// Rate Limit Exceeded (429)
{
  "status": "failure",
  "message": "Limite de tickets atteinte. Veuillez réessayer plus tard."
}
```

---

### 2. Get All Tickets

Retrieve tickets with pagination and filtering options.

**Endpoint:** `GET /api/tickets`

**Query Parameters:**
```typescript
{
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 20, max: 100)
  status?: TicketStatus; // Filter by status
  priority?: TicketPriority; // Filter by priority  
  category?: TicketCategory; // Filter by category
  reporter?: string;    // Filter by reporter userId
  assignee?: string;    // Filter by assignee userId
}
```

**Example Request:**
```
GET /api/tickets?page=2&limit=10&status=new&priority=P1
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "tickets": [
      {
        "_id": "64a1b2c3d4e5f6789012345",
        "publicId": "EK-ABC123",
        "title": "Login button not responding", 
        "description": "When I click the login button...",
        "status": "new",
        "priority": "P1",
        "category": "UI",
        "severityPerceived": "high",
        "reporter": {
          "userId": "user123",
          "name": "Jean Dupont",
          "email": "jean@example.com"
        },
        "context": {
          "pageUrl": "https://edukai.fr/login"
        },
        "createdAt": "2023-07-15T10:30:00.000Z",
        "updatedAt": "2023-07-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 2,
      "limit": 10, 
      "total": 45,
      "pages": 5
    }
  }
}
```

**Error Response:**
```json
// Invalid query parameters (400)
{
  "status": "failure",
  "message": "Paramètres de requête invalides"
}
```

---

### 3. Get Single Ticket

Retrieve a specific ticket with its comments.

**Endpoint:** `GET /api/tickets/:id`

**URL Parameters:**
- `id`: Either the ticket's `publicId` (e.g., "EK-ABC123") or MongoDB `_id`

**Example Requests:**
```
GET /api/tickets/EK-ABC123
GET /api/tickets/64a1b2c3d4e5f6789012345
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "ticket": {
      "_id": "64a1b2c3d4e5f6789012345",
      "publicId": "EK-ABC123", 
      "title": "Login button not responding",
      "description": "When I click the login button...",
      "status": "in_progress",
      "priority": "P1",
      "category": "UI",
      "reporter": {
        "userId": "user123",
        "name": "Jean Dupont", 
        "email": "jean@example.com"
      },
      "assignees": [
        {
          "userId": "dev456",
          "name": "Marie Martin",
          "email": "marie@edukai.fr"
        }
      ],
      "context": {
        "pageUrl": "https://edukai.fr/login",
        "userAgent": "Mozilla/5.0...",
        "viewport": { "w": 1920, "h": 1080 }
      },
      "attachments": [
        {
          "kind": "image",
          "filename": "screenshot.png",
          "mimeType": "image/png",
          "size": 234567,
          "data": "base64_data_here"
        }
      ],
      "createdAt": "2023-07-15T10:30:00.000Z",
      "updatedAt": "2023-07-16T14:20:00.000Z",
      "triagedAt": "2023-07-15T11:45:00.000Z"
    },
    "comments": [
      {
        "_id": "comment123",
        "author": {
          "userId": "user123",
          "name": "Jean Dupont",
          "role": "reporter"
        },
        "body": "I tried refreshing the page but the issue persists.",
        "visibility": "public",
        "at": "2023-07-15T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Response:**
```json
// Ticket Not Found (404)
{
  "status": "failure", 
  "message": "Ticket non trouvé"
}
```

---

### 4. Update Ticket

Update specific properties of a ticket. Only certain fields can be modified.

**Endpoint:** `PATCH /api/tickets/:id`

**Updatable Fields:**
- `status`: Change ticket status
- `priority`: Update priority level  
- `assignees`: Assign/unassign team members
- `duplicateOf`: Mark as duplicate of another ticket
- `category`: Change issue category
- `severityPerceived`: Update perceived severity

**Request Body Examples:**

```json
// Update status
{
  "status": "in_progress"
}

// Update priority
{
  "priority": "P0"
}

// Assign team members
{
  "assignees": [
    {
      "userId": "dev456", 
      "name": "Marie Martin",
      "email": "marie@edukai.fr"
    }
  ]
}

// Mark as duplicate
{
  "status": "duplicate",
  "duplicateOf": "64a1b2c3d4e5f6789abcdef"
}

// Multiple updates
{
  "status": "triaged",
  "priority": "P1",
  "category": "UI"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Ticket mis à jour avec succès.",
  "data": {
    // Returns the complete updated ticket object
    "_id": "64a1b2c3d4e5f6789012345",
    "publicId": "EK-ABC123",
    "title": "Login button not responding",
    "description": "When I click the login button...",
    "status": "in_progress",
    "priority": "P0",
    // ... all other ticket fields
    "triagedAt": "2023-07-15T11:45:00.000Z",
    "updatedAt": "2023-07-16T09:30:00.000Z"
  }
}
```

**Special Behaviors:**
- Status changes automatically set timestamp fields:
  - `triaged` → sets `triagedAt`
  - `resolved` → sets `resolvedAt`
  - `closed` → sets `closedAt`
- Email notifications are sent on status changes
- Webhook notifications are triggered for critical priority changes (P0/P1)

**Error Responses:**
```json
// Ticket Not Found (404)
{
  "status": "failure",
  "message": "Ticket non trouvé"
}

// Invalid Field Value (400)
{
  "status": "failure",
  "message": "Statut invalide"
}
```

---

### 5. Add Comment

Add a comment to an existing ticket.

**Endpoint:** `POST /api/tickets/:id/comments`

**Rate Limit:** Not currently implemented (defined as 20 comments per hour per user)

**Request Body:**
```json
{
  "body": "I've reproduced this issue on Chrome and Firefox. It seems to be related to the JavaScript event handlers not binding properly.",
  "visibility": "public"
}
```

**Required Fields:**
- `body` (string): Comment content in Markdown format

**Optional Fields:**  
- `visibility` (CommentVisibility): "public" (default) or "internal"

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Commentaire ajouté avec succès.",
  "data": {
    "_id": "comment789",
    "body": "I've reproduced this issue...",
    "visibility": "public",
    "author": {
      "userId": "user123",
      "name": "Jean Dupont", 
      "role": "reporter"
    },
    "at": "2023-07-16T15:30:00.000Z",
    "updatedAt": "2023-07-16T15:30:00.000Z"
  }
}
```

**Side Effects:**
- Email notification sent for public comments (if not from ticket reporter)
- Comment author role automatically determined based on user permissions

**Error Responses:**
```json
// Missing Comment Body (400)
{
  "status": "failure",
  "message": "Le contenu du commentaire est requis"
}

// Ticket Not Found (404)
{
  "status": "failure",
  "message": "Ticket non trouvé"
}

// Rate Limit Exceeded (429)
{
  "status": "failure", 
  "message": "Limite de commentaires atteinte. Veuillez réessayer plus tard."
}
```

---

### 6. Reopen Ticket

Reopen a closed or resolved ticket. Only the original ticket reporter can reopen their own tickets.

**Endpoint:** `POST /api/tickets/:id/actions/reopen`

**Request Body:** None required

**Authorization:** Only the ticket reporter can reopen their tickets

**Prerequisites:** Ticket must be in "closed" or "resolved" status

**Success Response (200):**
```json
{
  "status": "success", 
  "message": "Ticket rouvert avec succès.",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "status": "reopened",
    "closedAt": null,
    "resolvedAt": null,
    "updatedAt": "2023-07-20T10:15:00.000Z"
  }
}
```

**Side Effects:**
- Status changed to "reopened"
- System comment automatically added
- Email notification sent to assigned team members

**Note:** Currently, `closedAt` and `resolvedAt` timestamps are not cleared automatically.

**Error Responses:**
```json
// Permission Denied (403)
{
  "status": "failure",
  "message": "Seul le rapporteur peut rouvrir ce ticket"
}

// Invalid State (400)
{
  "status": "failure",
  "message": "Ce ticket ne peut pas être rouvert"
}

// Ticket Not Found (404) 
{
  "status": "failure",
  "message": "Ticket non trouvé"
}
```

## Error Handling

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "status": "failure",
  "message": "Description of the error in French"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully  
- **400 Bad Request**: Invalid request data or parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions for the operation
- **404 Not Found**: Requested resource doesn't exist
- **409 Conflict**: Duplicate resource or business rule violation
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server error

## Rate Limiting

**⚠️ Important Notice**: Rate limiting is currently **not implemented** in the API routes, despite being defined in the middleware.

### Defined (but not active) Rate Limits:

#### Ticket Creation
- **Intended Limit**: 5 tickets per user per 24 hours
- **Status**: Not currently enforced
- **Implementation**: Middleware exists in `src/middleware/rateLimiter.ts` but not applied to routes

#### Comment Creation  
- **Intended Limit**: 20 comments per user per hour
- **Status**: Not currently enforced
- **Implementation**: Middleware exists but not applied to routes

#### General API Usage
- **Intended Limit**: 100 requests per IP per 15 minutes
- **Status**: Not currently enforced
- **Implementation**: Middleware exists but not applied to routes

**For Frontend Development**: You cannot rely on rate limiting behavior or 429 error responses at this time. Plan accordingly for potential API abuse scenarios.

## Email Notifications

The system automatically sends email notifications for various events:

### Notification Types
1. **Ticket Created**: Sent to ticket reporter as confirmation
2. **Status Changed**: Sent when ticket status is updated
3. **Comment Added**: Sent for new public comments (except from reporter)

### Email Features
- HTML and plain text versions
- Idempotency to prevent duplicates
- Retry mechanism with exponential backoff
- Queue processing every 30 seconds

## Webhook Notifications

For critical tickets (P0/P1 priority), the system sends webhook notifications to external services:

### Supported Webhooks
- **Discord**: Real-time notifications to team channels
- **Slack**: Integration with team workspaces  

### Trigger Conditions
- New P0/P1 tickets created
- Existing tickets upgraded to P0/P1 priority

## Integration Examples for Next.js

### Setting up API Client

```typescript
// utils/ticketApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class TicketApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/tickets${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for auth
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  }

  async createTicket(ticketData: CreateTicketRequest) {
    return this.makeRequest<CreateTicketResponse>('', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async getTickets(params?: GetTicketsParams) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.makeRequest<GetTicketsResponse>(
      queryString ? `?${queryString}` : ''
    );
  }

  async getTicket(id: string) {
    return this.makeRequest<GetTicketResponse>(`/${id}`);
  }

  async updateTicket(id: string, updates: UpdateTicketRequest) {
    return this.makeRequest<UpdateTicketResponse>(`/${id}`, {
      method: 'PATCH', 
      body: JSON.stringify(updates),
    });
  }

  async addComment(ticketId: string, comment: AddCommentRequest) {
    return this.makeRequest<AddCommentResponse>(`/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async reopenTicket(id: string) {
    return this.makeRequest<ReopenTicketResponse>(`/${id}/actions/reopen`, {
      method: 'POST',
    });
  }
}

export const ticketApi = new TicketApiClient();
```

### React Hook for Ticket Management

```typescript
// hooks/useTickets.ts
import { useState, useEffect } from 'react';
import { ticketApi } from '../utils/ticketApi';

export function useTickets(filters?: GetTicketsParams) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketApi.getTickets(filters);
        setTickets(response.data.tickets);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filters]);

  const createTicket = async (ticketData: CreateTicketRequest) => {
    try {
      const response = await ticketApi.createTicket(ticketData);
      // Refresh tickets list
      const updatedResponse = await ticketApi.getTickets(filters);
      setTickets(updatedResponse.data.tickets);
      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    pagination,
    createTicket,
    refetch: () => fetchTickets(),
  };
}
```

### File Upload Helper

```typescript
// utils/fileUpload.ts  
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove data:image/png;base64, prefix
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validateFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'text/plain', 'text/csv', 'application/json', 'application/pdf'
  ];

  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'File type not supported';
  }

  return null;
};
```

## TypeScript Type Definitions

```typescript
// types/ticket.ts
export interface CreateTicketRequest {
  title: string;
  description: string;
  category?: TicketCategory;
  severityPerceived?: TicketSeverity;
  priority?: TicketPriority;
  context: {
    pageUrl: string;
    appVersion?: string;
    locale?: string;
    userAgent?: string;
    viewport?: {
      w: number;
      h: number;
    };
    meta?: Record<string, any>;
  };
  attachments?: Array<{
    kind?: AttachmentKind;
    filename: string;
    mimeType: string;
    size?: number;
    data: string;
  }>;
}

export interface CreateTicketResponse {
  status: 'success';
  message: string;
  data: {
    ticketId: string;
    _id: string;
  };
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

export interface GetTicketsResponse {
  status: 'success';
  data: {
    tickets: Ticket[];
    pagination: PaginationInfo;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignees?: Array<{
    userId: string;
    name: string;
    email: string;
  }>;
  duplicateOf?: string;
  category?: TicketCategory;
  severityPerceived?: TicketSeverity;
}

export interface AddCommentRequest {
  body: string;
  visibility?: CommentVisibility;
}

export interface ApiErrorResponse {
  status: 'failure';
  message: string;
}
```

## Testing Your Integration

### Test Ticket Creation

```typescript
// Test creating a ticket with attachment
const testCreateTicket = async () => {
  try {
    const response = await ticketApi.createTicket({
      title: "Test ticket from frontend",
      description: "This is a test ticket to verify API integration",
      category: "UI",
      priority: "P2",
      context: {
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          w: window.innerWidth,
          h: window.innerHeight
        }
      }
    });
    
    console.log('Ticket created:', response.data.ticketId);
  } catch (error) {
    console.error('Failed to create ticket:', error);
  }
};
```

### Test Pagination

```typescript
// Test ticket listing with pagination
const testGetTickets = async () => {
  try {
    const response = await ticketApi.getTickets({
      page: 1,
      limit: 10,
      status: 'new'
    });
    
    console.log(`Found ${response.data.tickets.length} tickets`);
    console.log(`Total: ${response.data.pagination.total} tickets`);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
  }
};
```

---

## Implementation Notes

This documentation reflects the actual current implementation of the Edukai ticketing API. Please note the following important differences from ideal/planned behavior:

### Current Limitations
- **Rate Limiting**: Not currently implemented, despite middleware being defined
- **Authentication**: Only cookie authentication is supported (no Authorization header)
- **Comment Timestamps**: Use `at` field instead of `createdAt` for comment timestamps
- **Update Responses**: Return complete ticket object instead of minimal data
- **Reopen Functionality**: Does not clear `closedAt`/`resolvedAt` timestamps
- **Duplicate Error**: Includes additional `ticketId` field in error response

### Recommended Actions for Production
1. Implement rate limiting middleware on ticket routes
2. Add Authorization header authentication support  
3. Standardize timestamp field naming conventions
4. Add proper timestamp clearing in reopen functionality

---

This documentation provides everything needed to integrate the Edukai ticketing system with your Next.js frontend. The API is functional with comprehensive error handling and notification systems, though some features may need enhancement for production use.