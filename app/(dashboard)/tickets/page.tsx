"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateTicketDialog } from "@/components/ticket";
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
import { useIsAdmin, useSession } from "@/hooks";
import { useTicket } from "@/hooks/useTicket";
import { TicketPriority, TicketStatus } from "@/lib/types/ticket";
import { cn } from "@/lib/utils";
import { useTicketService } from "@/services";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    HelpCircle,
    LifeBuoy,
    Search,
    Settings,
    Shield,
    Sparkles,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TicketsPage() {
    const ticketService = useTicketService();
    const _session = useSession();
    const isAdmin = useIsAdmin();

    const {
        tickets,
        isCreatingTicket,
        isLoadingTickets,
        createTicket,
        loadTickets,
    } = useTicket(ticketService);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    // Load tickets on mount
    useEffect(() => {
        loadTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter tickets locally
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.publicId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || ticket.status === statusFilter;
        const matchesPriority =
            priorityFilter === "all" || ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Handle ticket creation
    const handleCreateTicket = async (
        ticketData: Parameters<typeof createTicket>[0]
    ) => {
        const result = await createTicket(ticketData);
        if (result) {
            setCreateDialogOpen(false);
            return result;
        }
        throw new Error("Failed to create ticket");
    };

    const getStatusIcon = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.NEW:
            case TicketStatus.REOPENED:
                return <Clock className="w-4 h-4" />;
            case TicketStatus.IN_PROGRESS:
            case TicketStatus.TRIAGED:
                return <AlertCircle className="w-4 h-4" />;
            case TicketStatus.RESOLVED:
            case TicketStatus.CLOSED:
                return <CheckCircle className="w-4 h-4" />;
            case TicketStatus.REJECTED:
            case TicketStatus.DUPLICATE:
                return <XCircle className="w-4 h-4" />;
            default:
                return <HelpCircle className="w-4 h-4" />;
        }
    };

    const getStatusLabel = (status: TicketStatus) => {
        const labels: Record<TicketStatus, string> = {
            [TicketStatus.NEW]: "Nouveau",
            [TicketStatus.TRIAGED]: "Trié",
            [TicketStatus.IN_PROGRESS]: "En cours",
            [TicketStatus.RESOLVED]: "Résolu",
            [TicketStatus.CLOSED]: "Fermé",
            [TicketStatus.REOPENED]: "Rouvert",
            [TicketStatus.REJECTED]: "Rejeté",
            [TicketStatus.DUPLICATE]: "Doublon",
        };
        return labels[status] || status;
    };

    return (
        <AuthGuard>
            <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
                {/* Header avec gradient moderne */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-4 sm:p-6 lg:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <HelpCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        Support technique
                                    </div>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                                    Centre d'aide
                                </h1>
                                <p className="text-blue-100 text-sm sm:text-base lg:text-lg max-w-2xl">
                                    Signalez un problème et suivez sa
                                    résolution. Notre équipe vous répondra
                                    rapidement.
                                </p>
                            </div>
                            {/* <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="h-12 px-6 bg-white/35 hover:bg-white/25 transition-all duration-200 font-semibold rounded-xl shadow-lg hover:shadow-xl"
                            >
                                <Plus className="w-5 h-5 mr-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent" />
                                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent text-md">
                                    Nouveau ticket
                                </span>
                            </Button> */}
                            <button
                                onClick={() => setCreateDialogOpen(true)}
                                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 sm:px-4 rounded-xl font-semibold text-sm sm:text-md transition-all duration-200 shadow-xl hover:shadow-2xl hover:transform w-full sm:w-auto justify-center sm:justify-start"
                            >
                                <LifeBuoy className="w-5 h-5" />
                                Remonter un problème
                            </button>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
                </div>

                {/* Admin Banner */}
                {isAdmin && (
                    <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <Shield className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="font-medium text-indigo-800">
                                            Mode Administrateur
                                        </p>
                                        <p className="text-sm text-indigo-700">
                                            Vous avez accès aux fonctionnalités
                                            d'administration
                                        </p>
                                    </div>
                                </div>
                                <Link href="/admin/tickets">
                                    <Button
                                        variant="outline"
                                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Console Admin
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filtres modernes */}
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Rechercher par titre ou numéro..."
                                    value={searchTerm}
                                    onChange={e =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Tous les statuts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les statuts
                                    </SelectItem>
                                    <SelectItem value={TicketStatus.NEW}>
                                        Nouveau
                                    </SelectItem>
                                    <SelectItem
                                        value={TicketStatus.IN_PROGRESS}
                                    >
                                        En cours
                                    </SelectItem>
                                    <SelectItem value={TicketStatus.RESOLVED}>
                                        Résolu
                                    </SelectItem>
                                    <SelectItem value={TicketStatus.CLOSED}>
                                        Fermé
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={priorityFilter}
                                onValueChange={setPriorityFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Toutes les priorités" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Toutes les priorités
                                    </SelectItem>
                                    <SelectItem value={TicketPriority.P0}>
                                        Critique
                                    </SelectItem>
                                    <SelectItem value={TicketPriority.P1}>
                                        Élevée
                                    </SelectItem>
                                    <SelectItem value={TicketPriority.P2}>
                                        Normale
                                    </SelectItem>
                                    <SelectItem value={TicketPriority.P3}>
                                        Faible
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des tickets avec design moderne */}
                <div className="grid gap-4">
                    {isLoadingTickets ? (
                        // Loading skeleton
                        [...Array(3)].map((_, i) => (
                            <Card
                                key={`loading-skeleton-${i}`}
                                className="border-0 shadow-lg animate-pulse"
                            >
                                <CardContent className="p-6">
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredTickets.length === 0 ? (
                        // Empty state moderne
                        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucun ticket trouvé
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {searchTerm ||
                                    statusFilter !== "all" ||
                                    priorityFilter !== "all"
                                        ? "Aucun ticket ne correspond à vos critères de recherche."
                                        : "Vous n'avez pas encore créé de ticket. Cliquez sur 'Nouveau ticket' pour commencer."}
                                </p>
                                {(searchTerm ||
                                    statusFilter !== "all" ||
                                    priorityFilter !== "all") && (
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
                        // Liste des tickets - Design moderne
                        filteredTickets.map(ticket => (
                            <Link
                                key={ticket._id}
                                href={`/tickets/${ticket.publicId}`}
                                className="group block"
                            >
                                <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                                    {/* Header avec gradient */}
                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-3 sm:p-4 border-b border-gray-100/50">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                {/* Ticket ID - Design moderne */}
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full px-3 py-1.5 text-white text-xs font-medium shadow-sm">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                                                    #{ticket.publicId}
                                                </div>

                                                {/* Priority Badge - Design moderne */}
                                                <div
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
                                                        ticket.priority ===
                                                            TicketPriority.P0 &&
                                                            "bg-red-500 text-white",
                                                        ticket.priority ===
                                                            TicketPriority.P1 &&
                                                            "bg-orange-500 text-white",
                                                        ticket.priority ===
                                                            TicketPriority.P2 &&
                                                            "bg-blue-500 text-white",
                                                        ticket.priority ===
                                                            TicketPriority.P3 &&
                                                            "bg-gray-500 text-white"
                                                    )}
                                                >
                                                    <div className="w-1.5 h-1.5 bg-white/80 rounded-full"></div>
                                                    {ticket.priority ===
                                                        TicketPriority.P0 &&
                                                        "Critique"}
                                                    {ticket.priority ===
                                                        TicketPriority.P1 &&
                                                        "Élevée"}
                                                    {ticket.priority ===
                                                        TicketPriority.P2 &&
                                                        "Normale"}
                                                    {ticket.priority ===
                                                        TicketPriority.P3 &&
                                                        "Faible"}
                                                </div>

                                                {/* Status Badge */}
                                                <div
                                                    className={cn(
                                                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
                                                        ticket.status ===
                                                            TicketStatus.NEW &&
                                                            "bg-blue-100 text-blue-700 border border-blue-200/50",
                                                        ticket.status ===
                                                            TicketStatus.IN_PROGRESS &&
                                                            "bg-amber-100 text-amber-700 border border-amber-200/50",
                                                        ticket.status ===
                                                            TicketStatus.RESOLVED &&
                                                            "bg-green-100 text-green-700 border border-green-200/50",
                                                        ticket.status ===
                                                            TicketStatus.CLOSED &&
                                                            "bg-gray-100 text-gray-700 border border-gray-200/50",
                                                        ticket.status ===
                                                            TicketStatus.REOPENED &&
                                                            "bg-orange-100 text-orange-700 border border-orange-200/50"
                                                    )}
                                                >
                                                    {getStatusIcon(
                                                        ticket.status
                                                    )}
                                                    {getStatusLabel(
                                                        ticket.status
                                                    )}
                                                </div>

                                                {/* Category Badge */}
                                                {ticket.category && (
                                                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-3 py-1.5 text-xs font-medium border border-purple-200/50">
                                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                                        {ticket.category}
                                                    </div>
                                                )}
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                                        </div>

                                        {/* Status et Category */}
                                        <div className="flex items-center gap-2"></div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-4 sm:p-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                            {ticket.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {ticket.description}
                                        </p>

                                        {/* Footer avec dates */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs text-gray-500 bg-gray-50/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Créé le{" "}
                                                    {new Date(
                                                        ticket.createdAt
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            {ticket.updatedAt !==
                                                ticket.createdAt && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        Mis à jour le{" "}
                                                        {new Date(
                                                            ticket.updatedAt
                                                        ).toLocaleDateString(
                                                            "fr-FR",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>

                {/* Create Ticket Dialog */}
                <CreateTicketDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onSubmit={handleCreateTicket}
                    isCreating={isCreatingTicket}
                />
            </div>
        </AuthGuard>
    );
}
