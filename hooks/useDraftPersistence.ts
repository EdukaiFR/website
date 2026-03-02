import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateTicketFormValues } from "@/lib/schemas/ticket";
import { createTicketSchema } from "@/lib/schemas/ticket";

const DRAFT_KEY = "ticket-draft";
const DEBOUNCE_MS = 500;

interface UseDraftPersistenceReturn {
  hasDraft: boolean;
  clearDraft: () => void;
}

/**
 * Persist ticket creation form values to localStorage with debounced auto-save.
 * Restores draft on mount if valid, clears on explicit call.
 *
 * @param form - React Hook Form instance for CreateTicketFormValues
 * @returns hasDraft flag and clearDraft function
 */
export function useDraftPersistence(
  form: UseFormReturn<CreateTicketFormValues>
): UseDraftPersistenceReturn {
  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(DRAFT_KEY);
  });

  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const parsed: unknown = JSON.parse(raw);
      const result = createTicketSchema.safeParse(parsed);
      if (result.success) {
        form.reset(result.data);
        setHasDraft(true);
      } else {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    }
  }, [form]);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const watchedValues = form.watch();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!form.formState.isDirty) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(watchedValues));
      setHasDraft(true);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [watchedValues, form.formState.isDirty]);

  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DRAFT_KEY);
    }
    setHasDraft(false);
  }, []);

  return { hasDraft, clearDraft };
}
