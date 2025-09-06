import { useState } from "react";
import { ticketToast } from "@/lib/toast";
import { useSession, useRolePermissions } from "@/hooks";
import type { TicketService } from "@/services/ticket";
import type {
    Ticket,
    TicketComment,
    CreateTicketRequest,
    GetTicketsParams,
    UpdateTicketRequest,
    AddCommentRequest,
    PaginationInfo,
} from "@/lib/types/ticket";

export function useTicket(ticketService: TicketService) {
    // Hooks for user session and permissions
    const { user } = useSession();
    const permissions = useRolePermissions();
    
    // State management
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    
    // Loading states
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [isLoadingTickets, setIsLoadingTickets] = useState(false);
    const [isLoadingTicket, setIsLoadingTicket] = useState(false);
    const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [isReopeningTicket, setIsReopeningTicket] = useState(false);
    
    // Error states
    const [ticketError, setTicketError] = useState<string | null>(null);

    // Create a new ticket
    const createTicket = async (ticketData: CreateTicketRequest) => {
        try {
            setIsCreatingTicket(true);
            setTicketError(null);
            
            const response = await ticketService.createTicket(ticketData);
            
            if (response) {
                ticketToast.createSuccess();
                // Refresh tickets list to include the new ticket
                await loadTickets();
                return response.data;
            } else {
                ticketToast.createError();
                setTicketError("Échec de la création du ticket. Veuillez réessayer.");
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la création du ticket:", error);
            ticketToast.createError();
            setTicketError("Échec de la création du ticket. Veuillez réessayer.");
            return null;
        } finally {
            setIsCreatingTicket(false);
        }
    };

    // Load tickets with optional filters
    const loadTickets = async (params?: GetTicketsParams) => {
        try {
            setIsLoadingTickets(true);
            setTicketError(null);
            
            // Apply user-based filtering if user cannot view all tickets
            let filteredParams = { ...params };
            if (!permissions.canViewAllTickets && user?.id) {
                // For regular users, only show their own tickets
                filteredParams.userId = user.id;
            }
            
            const response = await ticketService.getTickets(filteredParams);
            
            if (response && response.data) {
                setTickets(response.data.tickets);
                setPagination(response.data.pagination);
                return response.data.tickets;
            } else {
                ticketToast.loadError();
                setTicketError("Échec du chargement des tickets. Veuillez réessayer.");
                return [];
            }
        } catch (error) {
            console.error("Erreur lors du chargement des tickets:", error);
            ticketToast.loadError();
            setTicketError("Échec du chargement des tickets. Veuillez réessayer.");
            return [];
        } finally {
            setIsLoadingTickets(false);
        }
    };

    // Load a specific ticket with comments
    const loadTicketById = async (ticketId: string) => {
        try {
            setIsLoadingTicket(true);
            setTicketError(null);
            
            const response = await ticketService.getTicketById(ticketId);
            
            if (response && response.data) {
                setCurrentTicket(response.data);
                setComments(response.data.comments);
                return response.data;
            } else {
                ticketToast.loadError();
                setTicketError("Échec du chargement du ticket. Veuillez réessayer.");
                return null;
            }
        } catch (error) {
            console.error(`Erreur lors du chargement du ticket ${ticketId}:`, error);
            ticketToast.loadError();
            setTicketError("Échec du chargement du ticket. Veuillez réessayer.");
            return null;
        } finally {
            setIsLoadingTicket(false);
        }
    };

    // Update ticket properties
    const updateTicket = async (ticketId: string, updates: UpdateTicketRequest) => {
        try {
            setIsUpdatingTicket(true);
            setTicketError(null);
            
            // Check if user has permission to modify this ticket
            const ticket = tickets.find(t => t.id === ticketId) || currentTicket;
            const canModify = permissions.canModifyAnyTicket || 
                             (ticket && ticket.reporter?.userId === user?.id);
            
            if (!canModify) {
                ticketToast.updateError("Vous n'avez pas la permission de modifier ce ticket.");
                setTicketError("Permission refusée.");
                return null;
            }
            
            const response = await ticketService.updateTicket(ticketId, updates);
            
            if (response && response.data) {
                ticketToast.updateSuccess();
                const updatedTicket = response.data;
                
                // Update current ticket if it's the same one
                if (currentTicket && currentTicket.id === ticketId) {
                    setCurrentTicket(updatedTicket);
                }
                
                // Update ticket in the list if it exists
                setTickets(prev => 
                    prev.map(ticket => 
                        ticket.id === ticketId ? updatedTicket : ticket
                    )
                );
                
                return updatedTicket;
            } else {
                ticketToast.updateError();
                setTicketError("Échec de la mise à jour du ticket. Veuillez réessayer.");
                return null;
            }
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du ticket ${ticketId}:`, error);
            ticketToast.updateError();
            setTicketError("Échec de la mise à jour du ticket. Veuillez réessayer.");
            return null;
        } finally {
            setIsUpdatingTicket(false);
        }
    };
    
    // Close a ticket (Admin function)
    const closeTicket = async (ticketId: string) => {
        return updateTicket(ticketId, { status: 'closed' as any });
    };
    
    // Bulk update tickets (Admin function)  
    const bulkUpdateTickets = async (
        ticketIds: string[],
        updates: UpdateTicketRequest
    ) => {
        if (!permissions.canModifyAnyTicket) {
            ticketToast.updateError("Vous n'avez pas la permission pour cette action.");
            return false;
        }
        
        try {
            setIsUpdatingTicket(true);
            const promises = ticketIds.map(id => updateTicket(id, updates));
            await Promise.all(promises);
            
            ticketToast.updateSuccess();
            return true;
        } catch (error) {
            console.error("Erreur lors de la mise à jour groupée:", error);
            ticketToast.updateError();
            return false;
        } finally {
            setIsUpdatingTicket(false);
        }
    };

    // Add comment to ticket
    const addComment = async (ticketId: string, comment: AddCommentRequest) => {
        try {
            setIsAddingComment(true);
            setTicketError(null);
            
            const response = await ticketService.addComment(ticketId, comment);
            
            if (response && response.data) {
                ticketToast.addCommentSuccess();
                const newComment = response.data;
                
                // Add comment to current comments list
                setComments(prev => [...prev, newComment]);
                
                return newComment;
            } else {
                ticketToast.addCommentError();
                setTicketError("Échec de l'ajout du commentaire. Veuillez réessayer.");
                return null;
            }
        } catch (error) {
            console.error(`Erreur lors de l'ajout du commentaire au ticket ${ticketId}:`, error);
            ticketToast.addCommentError();
            setTicketError("Échec de l'ajout du commentaire. Veuillez réessayer.");
            return null;
        } finally {
            setIsAddingComment(false);
        }
    };

    // Reopen a closed/resolved ticket
    const reopenTicket = async (ticketId: string) => {
        try {
            setIsReopeningTicket(true);
            setTicketError(null);
            
            const response = await ticketService.reopenTicket(ticketId);
            
            if (response && response.data) {
                ticketToast.reopenSuccess();
                
                // Update current ticket status if it's the same one
                if (currentTicket && currentTicket.id === ticketId && response.data) {
                    setCurrentTicket(prev => 
                        prev ? { 
                            ...prev, 
                            status: response.data!.status,
                            updatedAt: response.data!.updatedAt 
                        } : null
                    );
                }
                
                // Update ticket in the list
                setTickets(prev => 
                    prev.map(ticket => 
                        ticket.id === ticketId && response.data
                            ? { 
                                ...ticket, 
                                status: response.data.status,
                                updatedAt: response.data.updatedAt 
                              }
                            : ticket
                    )
                );
                
                return response.data;
            } else {
                ticketToast.reopenError();
                setTicketError("Échec de la réouverture du ticket. Veuillez réessayer.");
                return null;
            }
        } catch (error) {
            console.error(`Erreur lors de la réouverture du ticket ${ticketId}:`, error);
            ticketToast.reopenError();
            setTicketError("Échec de la réouverture du ticket. Veuillez réessayer.");
            return null;
        } finally {
            setIsReopeningTicket(false);
        }
    };

    // Clear current ticket and comments
    const clearCurrentTicket = () => {
        setCurrentTicket(null);
        setComments([]);
    };

    // Clear error state
    const clearError = () => {
        setTicketError(null);
    };

    // Refresh tickets list (useful for manual refresh)
    const refreshTickets = async (params?: GetTicketsParams) => {
        return await loadTickets(params);
    };

    // Refresh current ticket (useful for polling updates)
    const refreshCurrentTicket = async () => {
        if (currentTicket) {
            return await loadTicketById(currentTicket.id);
        }
        return null;
    };

    return {
        // State
        tickets,
        currentTicket,
        comments,
        pagination,
        ticketError,

        // Loading states
        isCreatingTicket,
        isLoadingTickets,
        isLoadingTicket,
        isUpdatingTicket,
        isAddingComment,
        isReopeningTicket,

        // Actions
        createTicket,
        loadTickets,
        loadTicketById,
        updateTicket,
        addComment,
        reopenTicket,
        clearCurrentTicket,
        clearError,
        refreshTickets,
        refreshCurrentTicket,
        
        // Admin actions
        closeTicket,
        bulkUpdateTickets,
    };
}