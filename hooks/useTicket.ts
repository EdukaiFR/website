import { useCallback, useEffect, useRef, useState } from "react";
import type { TicketService } from "@/services/ticket";
import type {
  Ticket,
  TicketMessage,
  TicketStatus,
  AdminUser,
  UpdateTicketRequest,
  TicketAttachment,
  TicketVisibility,
  CreateMessageRequest,
} from "@/lib/types/ticket";
import { POLLING_INTERVAL_MS } from "@/lib/types/ticket";
import { isApiSuccess, isApiFailure } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";

export interface UseTicketReturn {
  ticket: Ticket | null;
  messages: TicketMessage[];
  isLoading: boolean;
  notFound: boolean;
  isReopening: boolean;
  adminUsers: AdminUser[];
  pendingField: string | null;
  isSubmittingMessage: boolean;
  handleMessageSent: (msg: TicketMessage) => void;
  handleTicketUpdate: (updated: Ticket) => void;
  handleReopen: () => Promise<void>;
  handleStatusChange: (status: TicketStatus) => void;
  handlePriorityChange: (priority: string) => void;
  handleAssigneeChange: (userId: string) => void;
  handleTagsSave: (tags: string[]) => void;
  handleMessageSubmit: (data: {
    content: string;
    visibility: TicketVisibility;
    attachments: TicketAttachment[];
  }) => Promise<void>;
}

/**
 * Domain hook for a single ticket detail page.
 * Manages ticket state, messages, polling, admin controls, and user actions.
 *
 * @param ticketId - The ID of the ticket to load
 * @param ticketService - Injected ticket service for API calls
 * @param isAdmin - Whether to fetch admin users and enable admin operations
 * @returns Ticket state, messages, and action handlers
 */
export function useTicket(
  ticketId: string,
  ticketService: TicketService,
  isAdmin = false
): UseTicketReturn {
  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [pendingField, setPendingField] = useState<string | null>(null);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);

  const fetchTicket = useCallback(async () => {
    const result = await serviceRef.current.getTicketById(ticketId);
    if (isApiSuccess(result) && result.data) {
      setTicket(result.data);
      return result.data;
    }
    if (isApiFailure(result) && result.statusCode === 404) {
      setNotFound(true);
    } else {
      ticketToast.loadError();
    }
    return null;
  }, [ticketId]);

  const fetchMessages = useCallback(async (tId: string) => {
    const result = await serviceRef.current.getMessages(tId);
    if (isApiSuccess(result) && result.data) {
      setMessages(result.data);
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

  // Fetch admin users if admin
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    async function fetchAdmins() {
      const result = await serviceRef.current.getAdminUsers();
      if (isApiSuccess(result) && result.data && !cancelled) {
        setAdminUsers(result.data);
      }
    }
    fetchAdmins();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

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
        if (isApiFailure(result) && result.statusCode === 403) {
          ticketToast.reopenLimitReached();
        } else {
          ticketToast.reopenError();
        }
      }
    } catch (_error: unknown) {
      ticketToast.reopenError();
    } finally {
      setIsReopening(false);
    }
  }, [ticket]);

  // Admin update handler
  const handleUpdate = useCallback(
    async (
      field: string,
      data: UpdateTicketRequest,
      successToast: () => void
    ) => {
      if (!ticket) return;
      setPendingField(field);
      try {
        const result = await serviceRef.current.updateTicket(ticket._id, data);
        if (isApiSuccess(result) && result.data) {
          successToast();
          setTicket(result.data);
        } else {
          ticketToast.updateError(result.message);
        }
      } catch (_error: unknown) {
        ticketToast.updateError();
      } finally {
        setPendingField(null);
      }
    },
    [ticket]
  );

  const handleStatusChange = useCallback(
    (status: TicketStatus) => {
      handleUpdate("status", { status }, ticketToast.statusChangeSuccess);
    },
    [handleUpdate]
  );

  const handlePriorityChange = useCallback(
    (priority: string) => {
      handleUpdate(
        "priority",
        { internalPriority: priority },
        ticketToast.priorityUpdateSuccess
      );
    },
    [handleUpdate]
  );

  const handleAssigneeChange = useCallback(
    (userId: string) => {
      handleUpdate(
        "assignee",
        { assignedTo: userId === "__none__" ? "" : userId },
        ticketToast.assignSuccess
      );
    },
    [handleUpdate]
  );

  const handleTagsSave = useCallback(
    (tags: string[]) => {
      handleUpdate("tags", { tags }, ticketToast.tagsUpdateSuccess);
    },
    [handleUpdate]
  );

  // Message submit handler
  const handleMessageSubmit = useCallback(
    async (data: {
      content: string;
      visibility: TicketVisibility;
      attachments: TicketAttachment[];
    }) => {
      if (!ticket) return;
      setIsSubmittingMessage(true);
      try {
        const messageData: CreateMessageRequest = {
          content: data.content,
          visibility: data.visibility,
          attachments: data.attachments,
        };
        const result = await serviceRef.current.createMessage(
          ticket._id,
          messageData
        );
        if (isApiSuccess(result) && result.data) {
          ticketToast.messageSuccess();
          setMessages((prev) => [...prev, result.data!]);
        } else {
          ticketToast.messageError(result.message);
        }
      } catch (error: unknown) {
        const err = error as Error;
        ticketToast.messageError(err.message);
      } finally {
        setIsSubmittingMessage(false);
      }
    },
    [ticket]
  );

  return {
    ticket,
    messages,
    isLoading,
    notFound,
    isReopening,
    adminUsers,
    pendingField,
    isSubmittingMessage,
    handleMessageSent,
    handleTicketUpdate,
    handleReopen,
    handleStatusChange,
    handlePriorityChange,
    handleAssigneeChange,
    handleTagsSave,
    handleMessageSubmit,
  };
}
