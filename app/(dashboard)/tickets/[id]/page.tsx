"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    MessageSquare,
    Send,
    Calendar,
    User,
    Globe,
    Monitor,
    RefreshCw,
    Paperclip,
    Copy,
    Shield,
    UserCircle,
    ExternalLink,
} from "lucide-react";
import { useTicketService } from "@/services";
import { useTicket, useIsAdmin, useRolePermissions } from "@/hooks";
import { cn } from "@/lib/utils";
import { TicketStatus, TicketPriority } from "@/lib/types/ticket";
import { CommentVisibility as CommentVisibilityEnum } from "@/lib/types/ticket";
import type { AddCommentRequest } from "@/lib/types/ticket";

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.id as string;

    const ticketService = useTicketService();
    const _isAdmin = useIsAdmin();
    const permissions = useRolePermissions();

    const {
        currentTicket,
        comments,
        isLoadingTicket,
        isAddingComment,
        loadTicketById,
        addComment,
        reopenTicket,
    } = useTicket(ticketService);

    const [newComment, setNewComment] = useState("");
    const [commentVisibility, setCommentVisibility] =
        useState<CommentVisibilityEnum>(CommentVisibilityEnum.PUBLIC);
    const [isReopening, setIsReopening] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    };

    const isSupport = (role: string) => {
        return (
            role.toLowerCase().includes("support") ||
            role.toLowerCase().includes("admin") ||
            role.toLowerCase().includes("agent")
        );
    };

    const getUserAvatar = (name: string, role: string) => {
        const initials = name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        const isSupportUser = isSupport(role);

        return {
            initials,
            bgColor: isSupportUser
                ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                : "bg-gradient-to-r from-gray-400 to-gray-500",
            textColor: "text-white",
        };
    };

    useEffect(() => {
        if (ticketId) {
            loadTicketById(ticketId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !currentTicket) return;

        const comment: AddCommentRequest = {
            body: newComment.trim(),
            visibility: commentVisibility,
        };

        const result = await addComment(currentTicket._id, comment);
        if (result) {
            setNewComment("");
            setCommentVisibility(CommentVisibilityEnum.PUBLIC); // Reset to public
            // Recharger le ticket pour avoir les commentaires à jour
            loadTicketById(ticketId);
        }
    };

    const handleReopenTicket = async () => {
        if (!currentTicket) return;
        setIsReopening(true);
        const result = await reopenTicket(currentTicket._id);
        if (result) {
            loadTicketById(ticketId);
        }
        setIsReopening(false);
    };

    const getStatusIcon = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.NEW:
            case TicketStatus.REOPENED:
                return <Clock className="w-5 h-5" />;
            case TicketStatus.IN_PROGRESS:
            case TicketStatus.TRIAGED:
                return <AlertCircle className="w-5 h-5" />;
            case TicketStatus.RESOLVED:
            case TicketStatus.CLOSED:
                return <CheckCircle className="w-5 h-5" />;
            case TicketStatus.REJECTED:
            case TicketStatus.DUPLICATE:
                return <XCircle className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getPriorityLabel = (priority: TicketPriority) => {
        switch (priority) {
            case TicketPriority.P0:
                return "Critique";
            case TicketPriority.P1:
                return "Élevée";
            case TicketPriority.P2:
                return "Normale";
            case TicketPriority.P3:
                return "Faible";
            default:
                return priority;
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

    if (isLoadingTicket) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-56 h-56 bg-indigo-200/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 animate-pulse">
                            <CardContent className="p-8">
                                <div className="h-96 bg-gray-200/60 rounded-xl"></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    if (!currentTicket) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-56 h-56 bg-indigo-200/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Ticket non trouvé
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Le ticket demandé n&apos;existe pas ou
                                    n&apos;est plus accessible.
                                </p>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                    onClick={() => router.push("/tickets")}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour aux tickets
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    const canReopen =
        currentTicket.status === TicketStatus.CLOSED ||
        currentTicket.status === TicketStatus.RESOLVED;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-56 h-56 bg-indigo-200/20 rounded-full blur-2xl"></div>

                <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/tickets")}
                            className="flex items-center gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour aux tickets
                        </Button>
                        {canReopen && (
                            <Button
                                onClick={handleReopenTicket}
                                disabled={isReopening}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <RefreshCw
                                    className={cn(
                                        "w-5 h-5 mr-2",
                                        isReopening && "animate-spin"
                                    )}
                                />
                                Rouvrir le ticket
                            </Button>
                        )}
                    </div>

                    {/* Ticket Details */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-4 right-8 w-16 h-16 bg-purple-300/20 rounded-full blur-lg"></div>
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        {/* Ticket ID - Style moderne */}
                                        <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-white font-medium text-sm tracking-wide">
                                                #{currentTicket.publicId}
                                            </span>
                                        </div>

                                        {/* Status Badge - Style moderne */}
                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-2 rounded-full px-4 py-2 border backdrop-blur-sm",
                                                currentTicket.status ===
                                                    TicketStatus.NEW &&
                                                    "bg-blue-50/90 border-blue-200/50 text-blue-700",
                                                currentTicket.status ===
                                                    TicketStatus.IN_PROGRESS &&
                                                    "bg-amber-50/90 border-amber-200/50 text-amber-700",
                                                currentTicket.status ===
                                                    TicketStatus.RESOLVED &&
                                                    "bg-green-50/90 border-green-200/50 text-green-700",
                                                currentTicket.status ===
                                                    TicketStatus.CLOSED &&
                                                    "bg-gray-50/90 border-gray-200/50 text-gray-700",
                                                currentTicket.status ===
                                                    TicketStatus.REOPENED &&
                                                    "bg-orange-50/90 border-orange-200/50 text-orange-700"
                                            )}
                                        >
                                            {getStatusIcon(
                                                currentTicket.status
                                            )}
                                            <span className="font-medium text-sm">
                                                {getStatusLabel(
                                                    currentTicket.status
                                                )}
                                            </span>
                                        </div>

                                        {/* Priority Badge - Style moderne */}
                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-2 rounded-full px-4 py-2 border-0 font-semibold text-sm",
                                                currentTicket.priority ===
                                                    TicketPriority.P0 &&
                                                    "bg-red-500 text-white shadow-red-200 shadow-lg",
                                                currentTicket.priority ===
                                                    TicketPriority.P1 &&
                                                    "bg-orange-500 text-white shadow-orange-200 shadow-lg",
                                                currentTicket.priority ===
                                                    TicketPriority.P2 &&
                                                    "bg-blue-500 text-white shadow-blue-200 shadow-lg",
                                                currentTicket.priority ===
                                                    TicketPriority.P3 &&
                                                    "bg-gray-500 text-white shadow-gray-200 shadow-lg"
                                            )}
                                        >
                                            <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                                            {getPriorityLabel(
                                                currentTicket.priority
                                            )}
                                        </div>

                                        {/* Category Badge - Style moderne */}
                                        {currentTicket.category && (
                                            <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                                                <span className="text-white font-medium text-sm">
                                                    {currentTicket.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-bold mb-2">
                                        {currentTicket.title}
                                    </h1>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                    Description
                                </h3>
                                <Card className="bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md transition-all duration-300 border border-gray-100/50">
                                    <CardContent className="p-6">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {currentTicket.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-purple-600" />
                                        Informations
                                    </h3>
                                    <Card className="bg-purple-50/50 backdrop-blur-sm hover:bg-purple-50/80 hover:shadow-lg transition-all duration-300 border border-purple-100/50">
                                        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                    <UserCircle className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Créé par
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            currentTicket
                                                                .reporter.name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Date de création
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(
                                                            currentTicket.createdAt
                                                        ).toLocaleDateString(
                                                            "fr-FR",
                                                            {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {currentTicket.updatedAt !==
                                                currentTicket.createdAt && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Dernière mise à jour
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(
                                                                currentTicket.updatedAt
                                                            ).toLocaleDateString(
                                                                "fr-FR",
                                                                {
                                                                    weekday:
                                                                        "long",
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-green-600" />
                                        Contexte technique
                                    </h3>
                                    <Card className="bg-green-50/50 backdrop-blur-sm hover:bg-green-50/80 hover:shadow-lg transition-all duration-300 border border-green-100/50">
                                        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        URL de la page
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleCopyUrl(
                                                                currentTicket
                                                                    .context
                                                                    .pageUrl
                                                            )
                                                        }
                                                        className="h-8 px-2 hover:bg-green-100/50"
                                                    >
                                                        {copiedUrl ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-3 bg-white/50 rounded-lg p-2 sm:p-3">
                                                    <ExternalLink className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <a
                                                        href={
                                                            currentTicket
                                                                .context.pageUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-700 hover:text-green-600 transition-colors break-all"
                                                    >
                                                        {
                                                            currentTicket
                                                                .context.pageUrl
                                                        }
                                                    </a>
                                                </div>
                                            </div>
                                            {currentTicket.context.viewport && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                                        <Monitor className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Résolution écran
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            {
                                                                currentTicket
                                                                    .context
                                                                    .viewport.w
                                                            }{" "}
                                                            ×{" "}
                                                            {
                                                                currentTicket
                                                                    .context
                                                                    .viewport.h
                                                            }{" "}
                                                            pixels
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Pièces jointes */}
                            {currentTicket.attachments &&
                                currentTicket.attachments.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Paperclip className="w-5 h-5 text-orange-600" />
                                            Pièces jointes (
                                            {currentTicket.attachments.length})
                                        </h3>
                                        <Card className="bg-orange-50/50 backdrop-blur-sm hover:bg-orange-50/80 hover:shadow-lg transition-all duration-300 border border-orange-100/50">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                                        <Paperclip className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {
                                                                currentTicket
                                                                    .attachments
                                                                    .length
                                                            }{" "}
                                                            fichier
                                                            {currentTicket
                                                                .attachments
                                                                .length > 1
                                                                ? "s"
                                                                : ""}{" "}
                                                            joint
                                                            {currentTicket
                                                                .attachments
                                                                .length > 1
                                                                ? "s"
                                                                : ""}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Cliquez pour
                                                            télécharger
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Commentaires */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-2xl p-4 sm:p-6 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-4 right-8 w-12 h-12 bg-pink-300/20 rounded-full blur-lg"></div>

                            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold">
                                        Conversation
                                    </h2>
                                    <p className="text-purple-100 text-sm">
                                        {comments.length} message
                                        {comments.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                            {/* Liste des commentaires - Style iOS */}
                            {comments.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Aucun message pour le moment
                                    </h3>
                                    <p className="text-gray-500">
                                        Commencez la conversation en ajoutant
                                        votre premier commentaire
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {comments
                                        .filter(comment => {
                                            // Admins can see all comments
                                            if (
                                                permissions.canSeeInternalComments
                                            ) {
                                                return true;
                                            }
                                            // Regular users can only see public comments
                                            return (
                                                comment.visibility ===
                                                CommentVisibilityEnum.PUBLIC
                                            );
                                        })
                                        .sort(
                                            (a, b) =>
                                                new Date(a.at).getTime() -
                                                new Date(b.at).getTime()
                                        )
                                        .map(
                                            (
                                                comment,
                                                index,
                                                sortedComments
                                            ) => {
                                                const isSupportUser = isSupport(
                                                    comment.author.role
                                                );
                                                const avatar = getUserAvatar(
                                                    comment.author.name,
                                                    comment.author.role
                                                );
                                                const isConsecutive =
                                                    index > 0 &&
                                                    sortedComments[index - 1]
                                                        .author.name ===
                                                        comment.author.name;
                                                const showTimestamp =
                                                    !isConsecutive;

                                                return (
                                                    <div key={comment._id}>
                                                        {/* Timestamp and author info */}
                                                        {showTimestamp && (
                                                            <div className="flex items-center justify-center mb-4 mt-6 first:mt-0">
                                                                <div className="flex items-center gap-3 bg-gray-100/80 rounded-full px-4 py-2">
                                                                    <div
                                                                        className={cn(
                                                                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white",
                                                                            avatar.bgColor
                                                                        )}
                                                                    >
                                                                        {
                                                                            avatar.initials
                                                                        }
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {
                                                                            comment
                                                                                .author
                                                                                .name
                                                                        }
                                                                    </span>
                                                                    {isSupportUser && (
                                                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                                            <Shield className="w-2.5 h-2.5 text-white" />
                                                                        </div>
                                                                    )}
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(
                                                                            comment.at
                                                                        ).toLocaleString(
                                                                            "fr-FR",
                                                                            {
                                                                                day: "numeric",
                                                                                month: "short",
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Message bubble - Style iOS */}
                                                        <div
                                                            className={cn(
                                                                "flex mb-1",
                                                                isSupportUser
                                                                    ? "justify-start"
                                                                    : "justify-end"
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "max-w-[70%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-3xl px-3 sm:px-4 py-2 sm:py-3 relative",
                                                                    comment.visibility ===
                                                                        CommentVisibilityEnum.INTERNAL &&
                                                                        "border-2 border-amber-400 bg-amber-50",
                                                                    comment.visibility ===
                                                                        CommentVisibilityEnum.PUBLIC &&
                                                                        isSupportUser &&
                                                                        "bg-gray-200 text-gray-900 rounded-bl-lg",
                                                                    comment.visibility ===
                                                                        CommentVisibilityEnum.PUBLIC &&
                                                                        !isSupportUser &&
                                                                        "bg-blue-500 text-white rounded-br-lg",
                                                                    comment.visibility ===
                                                                        CommentVisibilityEnum.INTERNAL &&
                                                                        isSupportUser &&
                                                                        "bg-amber-100 text-amber-900 rounded-bl-lg border-amber-300",
                                                                    comment.visibility ===
                                                                        CommentVisibilityEnum.INTERNAL &&
                                                                        !isSupportUser &&
                                                                        "bg-amber-200 text-amber-900 rounded-br-lg border-amber-300",
                                                                    "shadow-sm"
                                                                )}
                                                            >
                                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                                    {
                                                                        comment.body
                                                                    }
                                                                </p>
                                                                {comment.visibility ===
                                                                    CommentVisibilityEnum.INTERNAL && (
                                                                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-700 font-medium">
                                                                        🔒
                                                                        Message
                                                                        interne
                                                                    </div>
                                                                )}

                                                                {/* Timestamp for consecutive messages */}
                                                                {isConsecutive && (
                                                                    <div
                                                                        className={cn(
                                                                            "text-xs mt-2 opacity-70",
                                                                            isSupportUser
                                                                                ? "text-gray-600"
                                                                                : "text-blue-100"
                                                                        )}
                                                                    >
                                                                        {new Date(
                                                                            comment.at
                                                                        ).toLocaleString(
                                                                            "fr-FR",
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                </div>
                            )}

                            {/* Formulaire d'ajout de commentaire */}
                            <div className="border-t border-gray-200/50 pt-6 sm:pt-8 mt-6 sm:mt-8">
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100/50">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center text-sm font-bold text-white">
                                            {/* User initials would go here - for now using a generic icon */}
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Votre réponse
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Ajoutez votre commentaire à la
                                                conversation
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Tapez votre message ici..."
                                            value={newComment}
                                            onChange={e =>
                                                setNewComment(e.target.value)
                                            }
                                            className="min-h-[120px] bg-white/80 backdrop-blur-sm border-gray-200/50 focus:bg-white focus:border-blue-300 transition-all duration-200 rounded-xl resize-none"
                                        />

                                        {/* Admin comment visibility control */}
                                        {permissions.canCreateInternalComments && (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-3">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Visibilité :
                                                </label>
                                                <Select
                                                    value={commentVisibility}
                                                    onValueChange={value =>
                                                        setCommentVisibility(
                                                            value as CommentVisibilityEnum
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full sm:w-[200px] h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value={
                                                                CommentVisibilityEnum.PUBLIC
                                                            }
                                                        >
                                                            🌐 Public - Visible
                                                            par tous
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={
                                                                CommentVisibilityEnum.INTERNAL
                                                            }
                                                        >
                                                            🔒 Interne - Admin
                                                            uniquement
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-3">
                                            <div className="text-xs text-gray-500">
                                                {newComment.length > 0 && (
                                                    <span>
                                                        {newComment.length}{" "}
                                                        caractères
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                onClick={handleAddComment}
                                                disabled={
                                                    !newComment.trim() ||
                                                    isAddingComment
                                                }
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            >
                                                <Send
                                                    className={cn(
                                                        "w-5 h-5 mr-2",
                                                        isAddingComment &&
                                                            "animate-pulse"
                                                    )}
                                                />
                                                {isAddingComment
                                                    ? "Envoi en cours..."
                                                    : "Envoyer le message"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}
