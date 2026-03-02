import { useCallback, useEffect, useRef, useState } from "react";
import type { TicketService } from "@/services/ticket";
import type { Ticket, TicketMessage } from "@/lib/types/ticket";
import { POLLING_INTERVAL_MS } from "@/lib/types/ticket";
import { isApiSuccess } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";

export interface UseTicketReturn {
  ticket: Ticket | null;
  messages: TicketMessage[];
  isLoading: boolean;
  notFound: boolean;
  isReopening: boolean;
  handleMessageSent: (msg: TicketMessage) => void;
  handleTicketUpdate: (updated: Ticket) => void;
  handleReopen: () => Promise<void>;
}

/**
 * Domain hook for a single ticket detail page.
 * Manages ticket state, messages, polling, and user actions.
 */
export function useTicket(
  ticketId: string,
  ticketService: TicketService
): UseTicketReturn {
  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  const fetchTicket = useCallback(async () => {
    const result = await serviceRef.current.getTicketById(ticketId);
    if (isApiSuccess(result) && result.data) {
      setTicket(result.data);
      return result.data;
    }
    setNotFound(true);
    return null;
  }, [ticketId]);

  const fetchMessages = useCallback(async (tId: string) => {
    const result = await serviceRef.current.getMessages(tId);
    if (isApiSuccess(result) && result.data) {
      setMessages(result.data);
      // Fire-and-forget: mark all messages as read when viewing
      serviceRef.current.markAllMessagesRead(tId);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsLoading(true);
      const t = await fetchTicket();
      if (t && !cancelled) {
        await fetchMessages(t._id);
      }
      if (!cancelled) {
        setIsLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [fetchTicket, fetchMessages]);

  // Poll messages with Page Visibility API
  useEffect(() => {
    if (!ticket) return;
    const tId = ticket._id;
    let interval: ReturnType<typeof setInterval> | null = null;

    function startPolling() {
      if (interval) return;
      interval = setInterval(() => {
        fetchMessages(tId);
      }, POLLING_INTERVAL_MS);
    }

    function stopPolling() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchMessages(tId);
        startPolling();
      }
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ticket, fetchMessages]);

  const handleMessageSent = useCallback((msg: TicketMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleTicketUpdate = useCallback((updated: Ticket) => {
    setTicket(updated);
  }, []);

  const handleReopen = useCallback(async () => {
    if (!ticket) return;
    setIsReopening(true);
    try {
      const result = await serviceRef.current.reopenTicket(ticket._id);
      if (isApiSuccess(result) && result.data) {
        setTicket(result.data);
        ticketToast.reopenSuccess();
      } else {
        ticketToast.reopenLimitReached();
      }
    } catch (_error: unknown) {
      ticketToast.reopenLimitReached();
    } finally {
      setIsReopening(false);
    }
  }, [ticket]);

  return {
    ticket,
    messages,
    isLoading,
    notFound,
    isReopening,
    handleMessageSent,
    handleTicketUpdate,
    handleReopen,
  };
}
