import axios from "axios";
import type {
    CreateTicketRequest,
    CreateTicketResponse,
    GetTicketsParams,
    GetTicketsResponse,
    GetTicketResponse,
    UpdateTicketRequest,
    UpdateTicketResponse,
    AddCommentRequest,
    AddCommentResponse,
    ReopenTicketResponse,
    AdminGetTicketsParams,
    AdminGetTicketsResponse,
} from "@/lib/types/ticket";

export interface TicketService {
    createTicket: (
        ticketData: CreateTicketRequest
    ) => Promise<CreateTicketResponse | null>;
    
    getTickets: (
        params?: GetTicketsParams
    ) => Promise<GetTicketsResponse | null>;
    
    getTicketById: (
        ticketId: string
    ) => Promise<GetTicketResponse | null>;
    
    updateTicket: (
        ticketId: string,
        updates: UpdateTicketRequest
    ) => Promise<UpdateTicketResponse | null>;
    
    addComment: (
        ticketId: string,
        comment: AddCommentRequest
    ) => Promise<AddCommentResponse | null>;
    
    reopenTicket: (
        ticketId: string
    ) => Promise<ReopenTicketResponse | null>;
    
    // Admin-specific methods
    adminGetAllTickets: (
        params?: AdminGetTicketsParams
    ) => Promise<AdminGetTicketsResponse | null>;
}

export function useTicketService(): TicketService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createTicket = async (ticketData: CreateTicketRequest) => {
        try {
            const response = await axios.post(
                `${apiUrl}/tickets`,
                ticketData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error("An error occurred creating the ticket.", error);
            return null;
        }
    };

    const getTickets = async (params?: GetTicketsParams) => {
        try {
            const queryString = params 
                ? new URLSearchParams(params as any).toString()
                : "";
            
            const url = queryString 
                ? `${apiUrl}/tickets?${queryString}`
                : `${apiUrl}/tickets`;

            const response = await axios.get(url, {
                withCredentials: true,
            });
            
            return response.data;
        } catch (error) {
            console.error("An error occurred fetching tickets.", error);
            return null;
        }
    };

    const getTicketById = async (ticketId: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/tickets/${ticketId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred fetching ticket ${ticketId}`,
                error
            );
            return null;
        }
    };

    const updateTicket = async (
        ticketId: string,
        updates: UpdateTicketRequest
    ) => {
        try {
            const response = await axios.patch(
                `${apiUrl}/tickets/${ticketId}`,
                updates,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred updating ticket ${ticketId}`,
                error
            );
            return null;
        }
    };

    const addComment = async (
        ticketId: string,
        comment: AddCommentRequest
    ) => {
        try {
            const response = await axios.post(
                `${apiUrl}/tickets/${ticketId}/comments`,
                comment,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred adding comment to ticket ${ticketId}`,
                error
            );
            return null;
        }
    };

    const reopenTicket = async (ticketId: string) => {
        try {
            const response = await axios.post(
                `${apiUrl}/tickets/${ticketId}/actions/reopen`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred reopening ticket ${ticketId}`,
                error
            );
            return null;
        }
    };

    const adminGetAllTickets = async (params?: AdminGetTicketsParams) => {
        try {
            const queryString = params 
                ? new URLSearchParams(params as any).toString()
                : "";
            
            const url = queryString 
                ? `${apiUrl}/admin/tickets?${queryString}`
                : `${apiUrl}/admin/tickets`;

            const response = await axios.get(url, {
                withCredentials: true,
            });
            
            return response.data;
        } catch (error) {
            console.error("An error occurred fetching admin tickets.", error);
            return null;
        }
    };

    return {
        createTicket,
        getTickets,
        getTicketById,
        updateTicket,
        addComment,
        reopenTicket,
        adminGetAllTickets,
    };
}