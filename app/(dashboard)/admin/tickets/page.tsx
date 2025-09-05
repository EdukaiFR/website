"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTicketCard } from "@/components/ticket/admin-ticket-card";
import { AdminStatistics } from "@/components/ticket/admin-statistics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    useSession, 
    useIsAdmin, 
    useRolePermissions,
    useTicket 
} from "@/hooks";
import { 
    Ticket, 
    TicketStatus, 
    TicketPriority, 
    AdminGetTicketsParams,
    TicketStatistics,
    DEFAULT_PAGE_LIMIT,
} from "@/lib/types/ticket";
import { useTicketService } from "@/services";
import {
    AlertTriangle,
    Search,
    Settings,
    Shield,
    Sparkles,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Configuration constants
const LOADING_SKELETON_COUNT = 3;

export default function AdminTicketsPage() {
    const router = useRouter();
    const session = useSession();
    const isAdmin = useIsAdmin();
    const permissions = useRolePermissions();
    const ticketService = useTicketService();
    const { closeTicket, bulkUpdateTickets: _bulkUpdateTickets } = useTicket(ticketService);


    // State management
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [statistics, setStatistics] = useState<TicketStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Redirect non-admin users
    useEffect(() => {
        // Attendre que la session soit complètement chargée ET que l'utilisateur soit défini
        if (!session.loading && session.user && !isAdmin) {
            router.push("/tickets");
            return;
        }
    }, [session.loading, session.user, isAdmin, router]);

    // Load tickets
    const loadTickets = async (params?: AdminGetTicketsParams) => {
        if (!permissions.canAccessAdminEndpoints) {
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await ticketService.adminGetAllTickets({
                page: page,
                limit: DEFAULT_PAGE_LIMIT,
                search: searchTerm || undefined,
                status: statusFilter !== "all" ? (statusFilter as TicketStatus) : undefined,
                priority: priorityFilter !== "all" ? (priorityFilter as TicketPriority) : undefined,
                ...params,
            });

            if (response) {
                setTickets(response.data.tickets);
                setStatistics(response.data.statistics);
                setTotalPages(response.data.pagination.pages);
            }
        } catch (error) {
            console.error("Failed to load admin tickets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load tickets on mount and filter changes
    useEffect(() => {
        // S'assurer que la session est chargée ET que l'utilisateur est défini ET que les permissions sont OK
        if (!session.loading && session.user && permissions.canAccessAdminEndpoints && isAdmin) {
            loadTickets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, statusFilter, priorityFilter, page, session.loading, session.user, permissions.canAccessAdminEndpoints, isAdmin]);

    // Handle ticket status change
    const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
        setIsUpdating(prev => ({ ...prev, [ticketId]: true }));
        try {
            const response = await ticketService.updateTicket(ticketId, { status });
            if (response) {
                // Update ticket in local state
                setTickets(prev => 
                    prev.map(ticket => 
                        ticket._id === ticketId 
                            ? { ...ticket, status, updatedAt: new Date().toISOString() }
                            : ticket
                    )
                );
                // Reload statistics
                loadTickets();
            }
        } catch (error) {
            console.error("Failed to update ticket status:", error);
        } finally {
            setIsUpdating(prev => ({ ...prev, [ticketId]: false }));
        }
    };

    // Handle ticket priority change
    const handlePriorityChange = async (ticketId: string, priority: TicketPriority) => {
        setIsUpdating(prev => ({ ...prev, [ticketId]: true }));
        try {
            const response = await ticketService.updateTicket(ticketId, { priority });
            if (response) {
                // Update ticket in local state
                setTickets(prev => 
                    prev.map(ticket => 
                        ticket._id === ticketId 
                            ? { ...ticket, priority, updatedAt: new Date().toISOString() }
                            : ticket
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update ticket priority:", error);
        } finally {
            setIsUpdating(prev => ({ ...prev, [ticketId]: false }));
        }
    };

    // Handle ticket assignment (placeholder)
    const handleAssign = async (ticketId: string) => {
        console.log("Assign ticket:", ticketId);
        // TODO: Implement assignment dialog
    };

    // Handle ticket closure
    const handleClose = async (ticketId: string) => {
        setIsUpdating(prev => ({ ...prev, [ticketId]: true }));
        try {
            const result = await closeTicket(ticketId);
            if (result) {
                // Update local state
                setTickets(prev => 
                    prev.map(ticket => 
                        ticket._id === ticketId 
                            ? { ...ticket, status: TicketStatus.CLOSED, updatedAt: new Date().toISOString() }
                            : ticket
                    )
                );
                // Reload statistics
                loadTickets();
            }
        } catch (error) {
            console.error("Failed to close ticket:", error);
        } finally {
            setIsUpdating(prev => ({ ...prev, [ticketId]: false }));
        }
    };

    // Don't render anything if still loading
    if (session.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Don't render anything if user is loaded but not admin
    if (session.user && !isAdmin) {
        return null;
    }

    // If no user loaded (shouldn't happen with AuthGuard, but safety check)
    if (!session.user) {
        return null;
    }

    return (
        <AuthGuard>
            <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-purple-50/50">
                {/* Admin Header */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 lg:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        Administration
                                    </div>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                                    Gestion des tickets
                                </h1>
                                <p className="text-indigo-100 text-sm sm:text-base lg:text-lg max-w-2xl">
                                    Vue d&apos;ensemble de tous les tickets du système avec contrôles administrateur
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <Settings className="w-12 h-12 text-white/60" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
                </div>

                {/* Admin Notice */}
                <Card className="border-2 border-amber-200 bg-amber-50/50">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-amber-800">Mode Administrateur Activé</p>
                                <p className="text-sm text-amber-700">
                                    Vous avez accès à tous les tickets et pouvez effectuer des modifications administrateur.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                {statistics && (
                    <AdminStatistics statistics={statistics} isLoading={isLoading} />
                )}

                {/* Filters */}
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Rechercher par titre, description ou ID..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Tous les statuts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value={TicketStatus.NEW}>Nouveau</SelectItem>
                                    <SelectItem value={TicketStatus.TRIAGED}>Trié</SelectItem>
                                    <SelectItem value={TicketStatus.IN_PROGRESS}>En cours</SelectItem>
                                    <SelectItem value={TicketStatus.RESOLVED}>Résolu</SelectItem>
                                    <SelectItem value={TicketStatus.CLOSED}>Fermé</SelectItem>
                                    <SelectItem value={TicketStatus.REOPENED}>Rouvert</SelectItem>
                                    <SelectItem value={TicketStatus.REJECTED}>Rejeté</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Toutes les priorités" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les priorités</SelectItem>
                                    <SelectItem value={TicketPriority.P0}>P0 - Critique</SelectItem>
                                    <SelectItem value={TicketPriority.P1}>P1 - Élevée</SelectItem>
                                    <SelectItem value={TicketPriority.P2}>P2 - Normale</SelectItem>
                                    <SelectItem value={TicketPriority.P3}>P3 - Faible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tickets List */}
                <div className="space-y-4">
                    {isLoading ? (
                        // Loading skeleton
                        [...Array(LOADING_SKELETON_COUNT)].map((_, i) => (
                            <Card key={i} className="border-0 shadow-lg animate-pulse">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                </CardContent>
                            </Card>
                        ))
                    ) : tickets.length === 0 ? (
                        // Empty state
                        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-10 h-10 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucun ticket trouvé
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                                        ? "Aucun ticket ne correspond à vos critères de recherche."
                                        : "Aucun ticket n'a été trouvé dans le système."}
                                </p>
                                {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("all");
                                            setPriorityFilter("all");
                                        }}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Réinitialiser les filtres
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        // Tickets list
                        tickets.map(ticket => (
                            <AdminTicketCard
                                key={ticket._id}
                                ticket={ticket}
                                onStatusChange={handleStatusChange}
                                onPriorityChange={handlePriorityChange}
                                onAssign={handleAssign}
                                onClose={handleClose}
                                isUpdating={isUpdating[ticket._id]}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i + 1}
                                variant={page === i + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(i + 1)}
                                disabled={isLoading}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}