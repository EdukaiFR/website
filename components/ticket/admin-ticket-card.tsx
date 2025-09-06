"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Ticket, 
    TicketStatus, 
    TicketPriority
} from "@/lib/types/ticket";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    HelpCircle,
    Settings,
    User,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminTicketCardProps {
    ticket: Ticket;
    onStatusChange: (ticketId: string, status: TicketStatus) => void;
    onPriorityChange: (ticketId: string, priority: TicketPriority) => void;
    onAssign: (ticketId: string) => void;
    onClose: (ticketId: string) => void;
    isUpdating?: boolean;
}

export function AdminTicketCard({
    ticket,
    onStatusChange,
    onPriorityChange,
    onAssign,
    onClose,
    isUpdating = false,
}: AdminTicketCardProps) {
    const [showControls, setShowControls] = useState(false);

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

    const getPriorityLabel = (priority: TicketPriority) => {
        const labels: Record<TicketPriority, string> = {
            [TicketPriority.P0]: "Critique",
            [TicketPriority.P1]: "Élevée",
            [TicketPriority.P2]: "Normale",
            [TicketPriority.P3]: "Faible",
        };
        return labels[priority] || priority;
    };

    return (
        <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            {/* Header avec gradient et contrôles admin */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Ticket ID */}
                        <Link href={`/tickets/${ticket.publicId}`}>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full px-3 py-1.5 text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                                #{ticket.publicId}
                            </div>
                        </Link>

                        {/* Priority Badge */}
                        <div
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
                                ticket.priority === TicketPriority.P0 && "bg-red-500 text-white",
                                ticket.priority === TicketPriority.P1 && "bg-orange-500 text-white",
                                ticket.priority === TicketPriority.P2 && "bg-blue-500 text-white",
                                ticket.priority === TicketPriority.P3 && "bg-gray-500 text-white"
                            )}
                        >
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-full"></div>
                            {getPriorityLabel(ticket.priority)}
                        </div>

                        {/* Status Badge */}
                        <div
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
                                ticket.status === TicketStatus.NEW && "bg-blue-100 text-blue-700 border border-blue-200/50",
                                ticket.status === TicketStatus.IN_PROGRESS && "bg-amber-100 text-amber-700 border border-amber-200/50",
                                ticket.status === TicketStatus.RESOLVED && "bg-green-100 text-green-700 border border-green-200/50",
                                ticket.status === TicketStatus.CLOSED && "bg-gray-100 text-gray-700 border border-gray-200/50",
                                ticket.status === TicketStatus.REOPENED && "bg-orange-100 text-orange-700 border border-orange-200/50"
                            )}
                        >
                            {getStatusIcon(ticket.status)}
                            {getStatusLabel(ticket.status)}
                        </div>

                        {/* Category Badge */}
                        {ticket.category && (
                            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-3 py-1.5 text-xs font-medium border border-purple-200/50">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                {ticket.category}
                            </div>
                        )}
                    </div>

                    {/* Admin Controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowControls(!showControls)}
                            className="h-8 w-8 p-0"
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                        <Link href={`/tickets/${ticket.publicId}`}>
                            <ChevronRight className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" />
                        </Link>
                    </div>
                </div>

                {/* Admin Controls Panel */}
                {showControls && (
                    <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Status Control */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-700">Statut</label>
                                <Select
                                    value={ticket.status}
                                    onValueChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
                                    disabled={isUpdating}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={TicketStatus.NEW}>Nouveau</SelectItem>
                                        <SelectItem value={TicketStatus.TRIAGED}>Trié</SelectItem>
                                        <SelectItem value={TicketStatus.IN_PROGRESS}>En cours</SelectItem>
                                        <SelectItem value={TicketStatus.RESOLVED}>Résolu</SelectItem>
                                        <SelectItem value={TicketStatus.CLOSED}>Fermé</SelectItem>
                                        <SelectItem value={TicketStatus.REJECTED}>Rejeté</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Priority Control */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-700">Priorité</label>
                                <Select
                                    value={ticket.priority}
                                    onValueChange={(value) => onPriorityChange(ticket.id, value as TicketPriority)}
                                    disabled={isUpdating}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={TicketPriority.P0}>P0 - Critique</SelectItem>
                                        <SelectItem value={TicketPriority.P1}>P1 - Élevée</SelectItem>
                                        <SelectItem value={TicketPriority.P2}>P2 - Normale</SelectItem>
                                        <SelectItem value={TicketPriority.P3}>P3 - Faible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Assignment Control */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-700">Assignation</label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAssign(ticket.id)}
                                    disabled={isUpdating}
                                    className="w-full h-8 text-xs"
                                >
                                    <User className="w-3 h-3 mr-1" />
                                    {ticket.assignedTo ? 
                                        "1 assigné" : 
                                        "Assigner"
                                    }
                                </Button>
                            </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="mt-4 pt-3 border-t border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700">Actions rapides :</span>
                                <div className="flex gap-2">
                                    {ticket.status !== TicketStatus.CLOSED && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onClose(ticket.id)}
                                            disabled={isUpdating}
                                            className="h-7 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            Fermer
                                        </Button>
                                    )}
                                    {ticket.status === TicketStatus.NEW && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onStatusChange(ticket.id, TicketStatus.IN_PROGRESS)}
                                            disabled={isUpdating}
                                            className="h-7 px-3 text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                                        >
                                            Prendre en charge
                                        </Button>
                                    )}
                                    {(ticket.status === TicketStatus.IN_PROGRESS || ticket.status === TicketStatus.TRIAGED) && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onStatusChange(ticket.id, TicketStatus.RESOLVED)}
                                            disabled={isUpdating}
                                            className="h-7 px-3 text-xs text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                            Résoudre
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardContent className="p-6">
                <Link href={`/tickets/${ticket.publicId}`} className="block group-hover:text-blue-600 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {ticket.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {ticket.description}
                    </p>
                </Link>

                {/* Footer avec informations reporter et dates */}
                <div className="space-y-3">
                    {/* Reporter Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Rapporté par utilisateur (ID: {ticket.userId})</span>
                    </div>

                    {/* Assignees */}
                    {ticket.assignedTo && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Settings className="w-4 h-4" />
                            <span>
                                Assigné à: {ticket.assignedTo}
                            </span>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50/50 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Créé le{" "}
                                {new Date(ticket.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        {ticket.updatedAt !== ticket.createdAt && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    Mis à jour le{" "}
                                    {new Date(ticket.updatedAt).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}