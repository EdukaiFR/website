import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTicketConfig } from "@/hooks/useTicketConfig";
import type { TicketService } from "@/services/ticket";
import type { TicketConfig } from "@/lib/types/ticket";
import { successResult, failureResult } from "@/lib/types/api";

function createMockService(
  overrides: Partial<TicketService> = {}
): TicketService {
  return {
    getConfigs: vi.fn(),
    createTicket: vi.fn(),
    getMyTickets: vi.fn(),
    getTicketById: vi.fn(),
    getMessages: vi.fn(),
    createMessage: vi.fn(),
    markMessageRead: vi.fn(),
    markAllMessagesRead: vi.fn(),
    reopenTicket: vi.fn(),
    updateTicket: vi.fn(),
    closeTicket: vi.fn(),
    adminGetTickets: vi.fn(),
    adminBulkUpdate: vi.fn(),
    getAdminUsers: vi.fn(),
    ...overrides,
  };
}

const mockConfigs: TicketConfig[] = [
  {
    _id: "c1",
    type: "ticket_type",
    values: [
      { key: "bug", label: "Bug", order: 2, isActive: true },
      { key: "feature", label: "Feature", order: 1, isActive: true },
      { key: "archived", label: "Archived", order: 3, isActive: false },
    ],
  },
  {
    _id: "c2",
    type: "ticket_category",
    values: [
      { key: "general", label: "General", order: 1, isActive: true },
    ],
  },
  {
    _id: "c3",
    type: "ticket_priority",
    values: [
      { key: "high", label: "High", order: 1, isActive: true },
      { key: "low", label: "Low", order: 2, isActive: true },
    ],
  },
  {
    _id: "c4",
    type: "urgency_level",
    values: [
      { key: "urgent", label: "Urgent", order: 1, isActive: true },
    ],
  },
  {
    _id: "c5",
    type: "ticket_status",
    values: [
      { key: "open", label: "Open", order: 1, isActive: true },
      { key: "closed", label: "Closed", order: 2, isActive: true },
    ],
  },
];

describe("useTicketConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start in loading state", () => {
    const service = createMockService({
      getConfigs: vi.fn().mockReturnValue(new Promise(() => {})),
    });

    const { result } = renderHook(() => useTicketConfig(service));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch and categorize config values on mount", async () => {
    const service = createMockService({
      getConfigs: vi.fn().mockResolvedValue(successResult(mockConfigs)),
    });

    const { result } = renderHook(() => useTicketConfig(service));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(service.getConfigs).toHaveBeenCalledTimes(1);
  });

  it("should filter inactive values and sort by order", async () => {
    const service = createMockService({
      getConfigs: vi.fn().mockResolvedValue(successResult(mockConfigs)),
    });

    const { result } = renderHook(() => useTicketConfig(service));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ticket_type: "archived" (isActive: false) should be filtered out
    expect(result.current.types).toHaveLength(2);
    // Sorted by order: Feature (1) before Bug (2)
    expect(result.current.types[0].key).toBe("feature");
    expect(result.current.types[1].key).toBe("bug");
  });

  it("should populate all config categories", async () => {
    const service = createMockService({
      getConfigs: vi.fn().mockResolvedValue(successResult(mockConfigs)),
    });

    const { result } = renderHook(() => useTicketConfig(service));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.priorities).toHaveLength(2);
    expect(result.current.urgencies).toHaveLength(1);
    expect(result.current.statuses).toHaveLength(2);
  });

  it("should set error state on failure", async () => {
    const service = createMockService({
      getConfigs: vi
        .fn()
        .mockResolvedValue(failureResult("Failed to fetch configs")),
    });

    const { result } = renderHook(() => useTicketConfig(service));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to fetch configs");
    expect(result.current.types).toHaveLength(0);
  });

  it("should fetch only once despite re-renders", async () => {
    const getConfigs = vi
      .fn()
      .mockResolvedValue(successResult(mockConfigs));
    const service = createMockService({ getConfigs });

    const { result, rerender } = renderHook(() => useTicketConfig(service));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    rerender();
    rerender();

    expect(getConfigs).toHaveBeenCalledTimes(1);
  });

  it("should re-fetch when refetch is called", async () => {
    const getConfigs = vi
      .fn()
      .mockResolvedValue(successResult(mockConfigs));
    const service = createMockService({ getConfigs });

    const { result } = renderHook(() => useTicketConfig(service));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getConfigs).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(getConfigs).toHaveBeenCalledTimes(2);
  });
});
