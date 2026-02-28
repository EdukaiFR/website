import type {
  ApiResult,
} from "@/lib/types/api";
import {
  successResult,
  errorToFailureResult,
} from "@/lib/types/api";
import type {
  Ticket,
  TicketMessage,
  TicketConfig,
  TicketStatistics,
  CreateTicketRequest,
  CreateMessageRequest,
  UpdateTicketRequest,
  TicketListParams,
} from "@/lib/types/ticket";
import axios from "axios";

export interface TicketService {
  getConfigs: () => Promise<ApiResult<TicketConfig[]>>;
  createTicket: (data: CreateTicketRequest) => Promise<ApiResult<Ticket>>;
  getMyTickets: (
    params?: TicketListParams
  ) => Promise<ApiResult<{ tickets: Ticket[]; total: number }>>;
  getTicketById: (id: string) => Promise<ApiResult<Ticket>>;
  getMessages: (ticketId: string) => Promise<ApiResult<TicketMessage[]>>;
  createMessage: (
    ticketId: string,
    data: CreateMessageRequest
  ) => Promise<ApiResult<TicketMessage>>;
  markMessageRead: (
    ticketId: string,
    messageId: string
  ) => Promise<ApiResult<void>>;
  reopenTicket: (ticketId: string) => Promise<ApiResult<Ticket>>;
  updateTicket: (
    ticketId: string,
    data: UpdateTicketRequest
  ) => Promise<ApiResult<Ticket>>;
  closeTicket: (ticketId: string) => Promise<ApiResult<Ticket>>;
  adminGetTickets: (
    params?: TicketListParams
  ) => Promise<
    ApiResult<{ tickets: Ticket[]; statistics: TicketStatistics; total: number }>
  >;
  adminBulkUpdate: (
    ticketIds: string[],
    data: UpdateTicketRequest
  ) => Promise<ApiResult<{ updated: number }>>;
}

function buildQueryParams(params?: TicketListParams): Record<string, string> {
  if (!params) return {};

  const query: Record<string, string> = {};
  if (params.page !== undefined) query.page = String(params.page);
  if (params.limit !== undefined) query.limit = String(params.limit);
  if (params.status) query.status = params.status;
  if (params.search) query.search = params.search;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;
  return query;
}

function logError(method: string, error: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`[TicketService] ${method} failed:`, error);
  }
}

export function useTicketService(): TicketService {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getConfigs = async (): Promise<ApiResult<TicketConfig[]>> => {
    try {
      const response = await axios.get(`${apiUrl}/tickets/config`, {
        withCredentials: true,
      });
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("getConfigs", error);
      return errorToFailureResult(error, "Failed to fetch ticket configs");
    }
  };

  const createTicket = async (
    data: CreateTicketRequest
  ): Promise<ApiResult<Ticket>> => {
    try {
      const response = await axios.post(`${apiUrl}/tickets`, data, {
        withCredentials: true,
      });
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("createTicket", error);
      return errorToFailureResult(error, "Failed to create ticket");
    }
  };

  const getMyTickets = async (
    params?: TicketListParams
  ): Promise<ApiResult<{ tickets: Ticket[]; total: number }>> => {
    try {
      const response = await axios.get(`${apiUrl}/tickets`, {
        params: buildQueryParams(params),
        withCredentials: true,
      });
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("getMyTickets", error);
      return errorToFailureResult(error, "Failed to fetch tickets");
    }
  };

  const getTicketById = async (id: string): Promise<ApiResult<Ticket>> => {
    try {
      const response = await axios.get(`${apiUrl}/tickets/${id}`, {
        withCredentials: true,
      });
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("getTicketById", error);
      return errorToFailureResult(error, "Failed to fetch ticket");
    }
  };

  const getMessages = async (
    ticketId: string
  ): Promise<ApiResult<TicketMessage[]>> => {
    try {
      const response = await axios.get(
        `${apiUrl}/tickets/${ticketId}/messages`,
        { withCredentials: true }
      );
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("getMessages", error);
      return errorToFailureResult(error, "Failed to fetch messages");
    }
  };

  const createMessage = async (
    ticketId: string,
    data: CreateMessageRequest
  ): Promise<ApiResult<TicketMessage>> => {
    try {
      const response = await axios.post(
        `${apiUrl}/tickets/${ticketId}/messages`,
        data,
        { withCredentials: true }
      );
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("createMessage", error);
      return errorToFailureResult(error, "Failed to send message");
    }
  };

  const markMessageRead = async (
    ticketId: string,
    messageId: string
  ): Promise<ApiResult<void>> => {
    try {
      await axios.post(
        `${apiUrl}/tickets/${ticketId}/messages/${messageId}/read`,
        {},
        { withCredentials: true }
      );
      return successResult(undefined);
    } catch (error: unknown) {
      logError("markMessageRead", error);
      return errorToFailureResult(error, "Failed to mark message as read");
    }
  };

  const reopenTicket = async (
    ticketId: string
  ): Promise<ApiResult<Ticket>> => {
    try {
      const response = await axios.post(
        `${apiUrl}/tickets/${ticketId}/reopen`,
        {},
        { withCredentials: true }
      );
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("reopenTicket", error);
      return errorToFailureResult(error, "Failed to reopen ticket");
    }
  };

  const updateTicket = async (
    ticketId: string,
    data: UpdateTicketRequest
  ): Promise<ApiResult<Ticket>> => {
    try {
      const response = await axios.patch(
        `${apiUrl}/admin/tickets/${ticketId}`,
        data,
        { withCredentials: true }
      );
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("updateTicket", error);
      return errorToFailureResult(error, "Failed to update ticket");
    }
  };

  const closeTicket = async (
    ticketId: string
  ): Promise<ApiResult<Ticket>> => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/tickets/${ticketId}/close`,
        {},
        { withCredentials: true }
      );
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("closeTicket", error);
      return errorToFailureResult(error, "Failed to close ticket");
    }
  };

  const adminGetTickets = async (
    params?: TicketListParams
  ): Promise<
    ApiResult<{ tickets: Ticket[]; statistics: TicketStatistics; total: number }>
  > => {
    try {
      const response = await axios.get(`${apiUrl}/admin/tickets`, {
        params: buildQueryParams(params),
        withCredentials: true,
      });
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("adminGetTickets", error);
      return errorToFailureResult(error, "Failed to fetch admin tickets");
    }
  };

  const adminBulkUpdate = async (
    ticketIds: string[],
    data: UpdateTicketRequest
  ): Promise<ApiResult<{ updated: number }>> => {
    try {
      const response = await axios.patch(
        `${apiUrl}/admin/tickets/bulk`,
        { ticketIds, ...data },
        { withCredentials: true }
      );
      return successResult(response.data.data);
    } catch (error: unknown) {
      logError("adminBulkUpdate", error);
      return errorToFailureResult(error, "Failed to bulk update tickets");
    }
  };

  return {
    getConfigs,
    createTicket,
    getMyTickets,
    getTicketById,
    getMessages,
    createMessage,
    markMessageRead,
    reopenTicket,
    updateTicket,
    closeTicket,
    adminGetTickets,
    adminBulkUpdate,
  };
}
