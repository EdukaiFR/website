import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatTicketDate,
  formatTicketDateFull,
  formatTicketRelativeDate,
  formatCompactRelativeDate,
  formatMessageTime,
  formatDateSeparator,
  isSameDay,
  resolveId,
  resolveUserName,
  canReopenTicket,
  getStatusTransitions,
  isMessageUnread,
  hasUnreadMessages,
  getStatusBadgeColor,
  getPriorityBadgeColor,
} from "@/lib/utils/ticket-helpers";
import type {
  Ticket,
  TicketMessage,
  PopulatedUser,
} from "@/lib/types/ticket";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOW = new Date("2026-03-02T12:00:00Z");

function hoursAgo(hours: number): string {
  return new Date(NOW.getTime() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

function minutesAgo(minutes: number): string {
  return new Date(NOW.getTime() - minutes * 60 * 1000).toISOString();
}

function createMockTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    _id: "t1",
    reference: "EK-000001",
    author: "user-1",
    type: "bug",
    category: "other",
    tags: [],
    title: "Test ticket",
    description: "Test",
    attachments: [],
    clientUrgency: "medium",
    internalPriority: "medium",
    status: "resolved",
    statusHistory: [],
    reopenCount: 0,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function createMockMessage(
  overrides: Partial<TicketMessage> = {}
): TicketMessage {
  return {
    _id: "m1",
    ticketId: "t1",
    senderId: "admin-1",
    senderRole: "admin",
    visibility: "public",
    content: "Hello",
    attachments: [],
    readBy: [],
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const mockPopulatedUser: PopulatedUser = {
  _id: "user-1",
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
};

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

describe("formatTicketDate", () => {
  it("returns relative string for dates less than 7 days old", () => {
    const result = formatTicketDate(hoursAgo(2));
    expect(result).toContain("2");
    expect(result).toContain("heure");
  });

  it("returns absolute string for dates older than 7 days", () => {
    const result = formatTicketDate(daysAgo(30));
    // French month abbreviations may include dots (e.g. "janv.")
    expect(result).toMatch(/\d+ \w+\.? \d{4}/);
  });

  it("returns relative for exactly 6 days ago", () => {
    const result = formatTicketDate(daysAgo(6));
    expect(result).toContain("jour");
  });
});

describe("formatTicketDateFull", () => {
  it("returns full date with time", () => {
    const result = formatTicketDateFull("2026-03-02T14:30:00Z");
    expect(result).toContain("2026");
    expect(result).toContain("à");
  });
});

describe("formatTicketRelativeDate", () => {
  it("returns a relative date string", () => {
    const result = formatTicketRelativeDate(hoursAgo(3));
    expect(result).toContain("3");
    expect(result).toContain("heure");
  });
});

describe("formatCompactRelativeDate", () => {
  it("returns '< 1 min' for less than 1 minute", () => {
    const result = formatCompactRelativeDate(
      new Date(NOW.getTime() - 30_000).toISOString()
    );
    expect(result).toBe("< 1 min");
  });

  it("returns minutes for less than 1 hour", () => {
    expect(formatCompactRelativeDate(minutesAgo(5))).toBe("5 min");
  });

  it("returns hours for less than 1 day", () => {
    expect(formatCompactRelativeDate(hoursAgo(3))).toBe("3 h");
  });

  it("returns days for less than 1 week", () => {
    expect(formatCompactRelativeDate(daysAgo(4))).toBe("4 j");
  });

  it("returns weeks for less than 5 weeks", () => {
    expect(formatCompactRelativeDate(daysAgo(21))).toBe("3 sem");
  });

  it("returns months for 5+ weeks", () => {
    expect(formatCompactRelativeDate(daysAgo(90))).toBe("3 mois");
  });
});

describe("formatMessageTime", () => {
  it("returns time in HH:mm format", () => {
    const result = formatMessageTime("2026-03-02T14:30:00Z");
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("formatDateSeparator", () => {
  it("returns full date without time", () => {
    const result = formatDateSeparator("2026-03-02T14:30:00Z");
    expect(result).toContain("2026");
    expect(result).not.toContain(":");
  });
});

describe("isSameDay", () => {
  it("returns true for same day", () => {
    expect(
      isSameDay("2026-03-02T10:00:00Z", "2026-03-02T22:00:00Z")
    ).toBe(true);
  });

  it("returns false for different days", () => {
    // Use dates far enough apart to be different in any timezone
    expect(
      isSameDay("2026-03-01T00:00:00Z", "2026-03-03T00:00:00Z")
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Populated field resolvers
// ---------------------------------------------------------------------------

describe("resolveId", () => {
  it("returns the string when given a string", () => {
    expect(resolveId("abc-123")).toBe("abc-123");
  });

  it("returns _id when given a PopulatedUser", () => {
    expect(resolveId(mockPopulatedUser)).toBe("user-1");
  });

  it("returns empty string when given undefined", () => {
    expect(resolveId(undefined)).toBe("");
  });
});

describe("resolveUserName", () => {
  it("returns 'firstName lastName' for a PopulatedUser", () => {
    expect(resolveUserName(mockPopulatedUser)).toBe("John Doe");
  });

  it("returns the raw string when given a string", () => {
    expect(resolveUserName("raw-id")).toBe("raw-id");
  });

  it("returns null when given undefined", () => {
    expect(resolveUserName(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Permission checks
// ---------------------------------------------------------------------------

describe("canReopenTicket", () => {
  it("returns true when all conditions are met", () => {
    const ticket = createMockTicket({
      status: "resolved",
      reopenCount: 0,
      author: "user-1",
    });
    expect(canReopenTicket(ticket, "user-1")).toBe(true);
  });

  it("returns false when status is not resolved", () => {
    const ticket = createMockTicket({ status: "open" });
    expect(canReopenTicket(ticket, "user-1")).toBe(false);
  });

  it("returns false when reopen limit is reached", () => {
    const ticket = createMockTicket({ reopenCount: 3 });
    expect(canReopenTicket(ticket, "user-1")).toBe(false);
  });

  it("returns false when user is not the author", () => {
    const ticket = createMockTicket({ author: "user-1" });
    expect(canReopenTicket(ticket, "user-999")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Status transitions
// ---------------------------------------------------------------------------

describe("getStatusTransitions", () => {
  it("returns [in_progress] for open", () => {
    expect(getStatusTransitions("open")).toEqual(["in_progress"]);
  });

  it("returns [waiting_for_client, resolved] for in_progress", () => {
    expect(getStatusTransitions("in_progress")).toEqual([
      "waiting_for_client",
      "resolved",
    ]);
  });

  it("returns [in_progress] for waiting_for_client", () => {
    expect(getStatusTransitions("waiting_for_client")).toEqual(["in_progress"]);
  });

  it("returns [closed, open] for resolved", () => {
    expect(getStatusTransitions("resolved")).toEqual(["closed", "open"]);
  });

  it("returns [open] for closed", () => {
    expect(getStatusTransitions("closed")).toEqual(["open"]);
  });

  it("returns empty array for unknown status", () => {
    expect(
      getStatusTransitions("unknown" as "open")
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Unread detection
// ---------------------------------------------------------------------------

describe("isMessageUnread", () => {
  it("returns false for messages sent by the user", () => {
    const msg = createMockMessage({ senderId: "user-1" });
    expect(isMessageUnread(msg, "user-1")).toBe(false);
  });

  it("returns false for internal messages", () => {
    const msg = createMockMessage({ visibility: "internal" });
    expect(isMessageUnread(msg, "user-1")).toBe(false);
  });

  it("returns true for unread public messages from others", () => {
    const msg = createMockMessage({
      senderId: "admin-1",
      visibility: "public",
      readBy: [],
    });
    expect(isMessageUnread(msg, "user-1")).toBe(true);
  });

  it("returns false when user has a readBy entry", () => {
    const msg = createMockMessage({
      senderId: "admin-1",
      visibility: "public",
      readBy: [{ userId: "user-1", readAt: "2026-01-01T00:00:00Z" }],
    });
    expect(isMessageUnread(msg, "user-1")).toBe(false);
  });

  it("handles populated senderId", () => {
    const msg = createMockMessage({ senderId: mockPopulatedUser });
    expect(isMessageUnread(msg, "user-1")).toBe(false);
  });
});

describe("hasUnreadMessages", () => {
  it("returns false for empty array", () => {
    expect(hasUnreadMessages([], "user-1")).toBe(false);
  });

  it("returns false when all messages are read", () => {
    const messages = [
      createMockMessage({
        senderId: "admin-1",
        readBy: [{ userId: "user-1", readAt: "2026-01-01T00:00:00Z" }],
      }),
    ];
    expect(hasUnreadMessages(messages, "user-1")).toBe(false);
  });

  it("returns true when at least one message is unread", () => {
    const messages = [
      createMockMessage({
        senderId: "admin-1",
        readBy: [{ userId: "user-1", readAt: "2026-01-01T00:00:00Z" }],
      }),
      createMockMessage({
        _id: "m2",
        senderId: "admin-1",
        readBy: [],
      }),
    ];
    expect(hasUnreadMessages(messages, "user-1")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Badge colors
// ---------------------------------------------------------------------------

describe("getStatusBadgeColor", () => {
  it("returns correct colors for known status", () => {
    const result = getStatusBadgeColor("open");
    expect(result.bg).toBe("bg-blue-50");
    expect(result.text).toBe("text-blue-700");
    expect(result.dot).toBe("bg-blue-500");
  });

  it("returns default colors for unknown status", () => {
    const result = getStatusBadgeColor("nonexistent");
    expect(result.bg).toBe("bg-gray-100");
    expect(result.text).toBe("text-gray-600");
    expect(result.dot).toBe("bg-gray-400");
  });
});

describe("getPriorityBadgeColor", () => {
  it("returns correct colors for known priority", () => {
    const result = getPriorityBadgeColor("critical");
    expect(result.bg).toBe("bg-red-50");
    expect(result.text).toBe("text-red-700");
    expect(result.border).toBe("border-red-200");
  });

  it("returns default colors for unknown priority", () => {
    const result = getPriorityBadgeColor("nonexistent");
    expect(result.bg).toBe("bg-gray-50");
    expect(result.text).toBe("text-gray-600");
    expect(result.border).toBe("border-gray-200");
  });
});
