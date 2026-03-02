import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";
import type { UseFormReturn } from "react-hook-form";
import type { CreateTicketFormValues } from "@/lib/schemas/ticket";

const DRAFT_KEY = "ticket-draft";

function createMockForm(
  overrides: Partial<UseFormReturn<CreateTicketFormValues>> = {}
): UseFormReturn<CreateTicketFormValues> {
  const watchers: Array<(values: Partial<CreateTicketFormValues>) => void> = [];
  return {
    reset: vi.fn(),
    watch: vi.fn((callback?: (values: Partial<CreateTicketFormValues>) => void) => {
      if (callback) watchers.push(callback);
      return { unsubscribe: vi.fn() };
    }),
    formState: { isDirty: false } as UseFormReturn<CreateTicketFormValues>["formState"],
    ...overrides,
    _watchers: watchers,
  } as unknown as UseFormReturn<CreateTicketFormValues> & { _watchers: Array<(values: Partial<CreateTicketFormValues>) => void> };
}

const validDraft: CreateTicketFormValues = {
  title: "Test ticket title here",
  description: "This is a detailed description of the ticket issue that we need to fix",
  type: "bug",
  category: "general",
  clientUrgency: "high",
};

describe("useDraftPersistence", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return hasDraft=false when no draft exists", () => {
    const form = createMockForm();
    const { result } = renderHook(() => useDraftPersistence(form));

    expect(result.current.hasDraft).toBe(false);
  });

  it("should return hasDraft=true when valid draft exists in localStorage", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(validDraft));
    const form = createMockForm();
    const { result } = renderHook(() => useDraftPersistence(form));

    expect(result.current.hasDraft).toBe(true);
  });

  it("should restore valid draft on mount and call form.reset", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(validDraft));
    const form = createMockForm();
    renderHook(() => useDraftPersistence(form));

    expect(form.reset).toHaveBeenCalledWith(validDraft);
  });

  it("should remove invalid JSON from localStorage on mount", () => {
    localStorage.setItem(DRAFT_KEY, "not-json{{{");
    const form = createMockForm();
    const { result } = renderHook(() => useDraftPersistence(form));

    expect(form.reset).not.toHaveBeenCalled();
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(result.current.hasDraft).toBe(false);
  });

  it("should remove invalid draft that fails Zod validation", () => {
    const invalidDraft = { title: "ab" }; // too short for schema
    localStorage.setItem(DRAFT_KEY, JSON.stringify(invalidDraft));
    const form = createMockForm();
    const { result } = renderHook(() => useDraftPersistence(form));

    expect(form.reset).not.toHaveBeenCalled();
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(result.current.hasDraft).toBe(false);
  });

  it("should clear draft from localStorage when clearDraft is called", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(validDraft));
    const form = createMockForm();
    const { result } = renderHook(() => useDraftPersistence(form));

    expect(result.current.hasDraft).toBe(true);

    act(() => {
      result.current.clearDraft();
    });

    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(result.current.hasDraft).toBe(false);
  });

  it("should subscribe to form.watch on mount", () => {
    const form = createMockForm();
    renderHook(() => useDraftPersistence(form));

    expect(form.watch).toHaveBeenCalled();
  });
});
