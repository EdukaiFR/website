import { useTicketService } from "@/services/ticket";
import type { CreateTicketRequest } from "@/lib/types/ticket";
import axios from "axios";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

const mockedGet = axios.get as Mock;
const mockedPost = axios.post as Mock;
const mockedPatch = axios.patch as Mock;

const API_URL = "http://localhost:3000/api";

describe("TicketService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("useTicketService", () => {
    it("should return all service methods", () => {
      const service = useTicketService();

      expect(typeof service.getConfigs).toBe("function");
      expect(typeof service.createTicket).toBe("function");
      expect(typeof service.getMyTickets).toBe("function");
      expect(typeof service.getTicketById).toBe("function");
      expect(typeof service.getMessages).toBe("function");
      expect(typeof service.createMessage).toBe("function");
      expect(typeof service.markMessageRead).toBe("function");
      expect(typeof service.markAllMessagesRead).toBe("function");
      expect(typeof service.reopenTicket).toBe("function");
      expect(typeof service.updateTicket).toBe("function");
      expect(typeof service.closeTicket).toBe("function");
      expect(typeof service.adminGetTickets).toBe("function");
      expect(typeof service.adminBulkUpdate).toBe("function");
    });
  });

  describe("getConfigs", () => {
    it("should return success result with config data", async () => {
      const mockData = [
        { _id: "1", type: "ticket_type", values: [] },
      ];
      mockedGet.mockResolvedValueOnce({ data: { data: mockData } });

      const service = useTicketService();
      const result = await service.getConfigs();

      expect(result.status).toBe("success");
      if (result.status === "success") {
        expect(result.data).toEqual(mockData);
      }
      expect(mockedGet).toHaveBeenCalledWith(
        `${API_URL}/tickets/config`,
        { withCredentials: true }
      );
    });

    it("should return failure result on error", async () => {
      mockedGet.mockRejectedValueOnce(new Error("Network error"));

      const service = useTicketService();
      const result = await service.getConfigs();

      expect(result.status).toBe("failure");
    });
  });

  describe("createTicket", () => {
    it("should post ticket data and return success result", async () => {
      const ticketData: CreateTicketRequest = {
        title: "Test ticket",
        description: "Test description",
        type: "bug",
        category: "other",
        clientUrgency: "medium",
      };
      const mockTicket = { _id: "t1", ...ticketData, status: "open" };
      mockedPost.mockResolvedValueOnce({ data: { data: mockTicket } });

      const service = useTicketService();
      const result = await service.createTicket(ticketData);

      expect(result.status).toBe("success");
      if (result.status === "success") {
        expect(result.data._id).toBe("t1");
      }
      expect(mockedPost).toHaveBeenCalledWith(
        `${API_URL}/tickets`,
        ticketData,
        { withCredentials: true }
      );
    });

    it("should return failure result on error", async () => {
      mockedPost.mockRejectedValueOnce(new Error("Server error"));

      const service = useTicketService();
      const result = await service.createTicket({
        title: "Test",
        description: "Test",
        type: "bug",
        category: "other",
        clientUrgency: "low",
      } as CreateTicketRequest);

      expect(result.status).toBe("failure");
    });
  });

  describe("getMyTickets", () => {
    it("should pass query params to the request", async () => {
      mockedGet.mockResolvedValueOnce({
        data: { data: { tickets: [], total: 0 } },
      });

      const service = useTicketService();
      await service.getMyTickets({
        page: 2,
        limit: 10,
        status: "open",
        search: "bug",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(mockedGet).toHaveBeenCalledWith(`${API_URL}/tickets`, {
        params: {
          page: "2",
          limit: "10",
          status: "open",
          search: "bug",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        withCredentials: true,
      });
    });

    it("should pass empty params when none provided", async () => {
      mockedGet.mockResolvedValueOnce({
        data: { data: { tickets: [], total: 0 } },
      });

      const service = useTicketService();
      await service.getMyTickets();

      expect(mockedGet).toHaveBeenCalledWith(`${API_URL}/tickets`, {
        params: {},
        withCredentials: true,
      });
    });
  });

  describe("getTicketById", () => {
    it("should fetch a single ticket by id", async () => {
      const mockTicket = { _id: "t1", title: "Test" };
      mockedGet.mockResolvedValueOnce({ data: { data: mockTicket } });

      const service = useTicketService();
      const result = await service.getTicketById("t1");

      expect(result.status).toBe("success");
      if (result.status === "success") {
        expect(result.data._id).toBe("t1");
      }
      expect(mockedGet).toHaveBeenCalledWith(
        `${API_URL}/tickets/t1`,
        { withCredentials: true }
      );
    });
  });

  describe("createMessage", () => {
    it("should post message to ticket", async () => {
      const messageData = { content: "Hello", visibility: "public" as const };
      const mockMessage = { _id: "m1", ...messageData };
      mockedPost.mockResolvedValueOnce({ data: { data: mockMessage } });

      const service = useTicketService();
      const result = await service.createMessage("t1", messageData);

      expect(result.status).toBe("success");
      expect(mockedPost).toHaveBeenCalledWith(
        `${API_URL}/tickets/t1/messages`,
        messageData,
        { withCredentials: true }
      );
    });
  });

  describe("reopenTicket", () => {
    it("should post to reopen endpoint", async () => {
      const mockTicket = { _id: "t1", status: "open" };
      mockedPost.mockResolvedValueOnce({ data: { data: mockTicket } });

      const service = useTicketService();
      const result = await service.reopenTicket("t1");

      expect(result.status).toBe("success");
      expect(mockedPost).toHaveBeenCalledWith(
        `${API_URL}/tickets/t1/reopen`,
        {},
        { withCredentials: true }
      );
    });
  });

  describe("updateTicket (admin)", () => {
    it("should patch ticket via admin endpoint", async () => {
      const updateData = { status: "in_progress" as const };
      const mockTicket = { _id: "t1", ...updateData };
      mockedPatch.mockResolvedValueOnce({ data: { data: mockTicket } });

      const service = useTicketService();
      const result = await service.updateTicket("t1", updateData);

      expect(result.status).toBe("success");
      expect(mockedPatch).toHaveBeenCalledWith(
        `${API_URL}/tickets/t1`,
        updateData,
        { withCredentials: true }
      );
    });
  });

  describe("adminBulkUpdate", () => {
    it("should patch bulk endpoint with ticket ids and data", async () => {
      const updateData = { status: "closed" as const };
      mockedPatch.mockResolvedValueOnce({
        data: { updated: 3, failed: 0, errors: [] },
      });

      const service = useTicketService();
      const result = await service.adminBulkUpdate(
        ["t1", "t2", "t3"],
        updateData
      );

      expect(result.status).toBe("success");
      if (result.status === "success") {
        expect(result.data.updated).toBe(3);
      }
      expect(mockedPatch).toHaveBeenCalledWith(
        `${API_URL}/admin/tickets/bulk`,
        { ticketIds: ["t1", "t2", "t3"], updates: { status: "closed" } },
        { withCredentials: true }
      );
    });
  });
});
