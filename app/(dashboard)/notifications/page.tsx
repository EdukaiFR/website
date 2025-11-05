"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Bell,
    CheckCircle2,
    Clock,
    Info,
    Trash2,
    Trophy,
    AlertTriangle,
    Calendar,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type NotificationType =
    | "success"
    | "info"
    | "warning"
    | "achievement"
    | "reminder";

type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    actionUrl?: string;
    actionLabel?: string;
};

// Mock data for notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "achievement",
        title: "🎉 Nouveau badge débloqué !",
        message:
            "Félicitations ! Tu as terminé 5 quiz d'affilée. Tu as débloqué le badge 'Étudiant assidu'.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false,
        actionUrl: "/achievements",
        actionLabel: "Voir mes badges",
    },
    {
        id: "2",
        type: "reminder",
        title: "📚 Rappel d'examen",
        message:
            "Ton examen de Mathématiques est prévu dans 2 jours. Il est temps de réviser !",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        actionUrl: "/library/6841219f211bac0652987453",
        actionLabel: "Réviser maintenant",
    },
    {
        id: "3",
        type: "success",
        title: "✅ Quiz terminé",
        message:
            "Tu as obtenu 18/20 au quiz 'Les équations du second degré'. Excellent travail !",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true,
        actionUrl: "/library/6841219f211bac0652987453",
        actionLabel: "Voir les détails",
    },
    {
        id: "4",
        type: "info",
        title: "📖 Nouveau cours disponible",
        message:
            "Un nouveau cours 'Probabilités et Statistiques' a été ajouté à ta bibliothèque.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        isRead: true,
        actionUrl: "/library",
        actionLabel: "Explorer",
    },
    {
        id: "5",
        type: "warning",
        title: "⚠️ Session expirée",
        message:
            "Ta session a expiré. Reconnecte-toi pour continuer à utiliser Edukai.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
    },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case "success":
            return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        case "achievement":
            return <Trophy className="w-5 h-5 text-yellow-600" />;
        case "reminder":
            return <Calendar className="w-5 h-5 text-blue-600" />;
        case "warning":
            return <AlertTriangle className="w-5 h-5 text-orange-600" />;
        case "info":
        default:
            return <Info className="w-5 h-5 text-blue-600" />;
    }
};

const getNotificationColor = (type: NotificationType) => {
    switch (type) {
        case "success":
            return "bg-green-50 border-green-200";
        case "achievement":
            return "bg-yellow-50 border-yellow-200";
        case "reminder":
            return "bg-blue-50 border-blue-200";
        case "warning":
            return "bg-orange-50 border-orange-200";
        case "info":
        default:
            return "bg-blue-50 border-blue-200";
    }
};

const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600)
        return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400)
        return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000)
        return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString("fr-FR");
};

export default function NotificationsPage() {
    const [notifications, setNotifications] =
        useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter(n => !n.isRead)
            : notifications;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("Toutes les notifications ont été marquées comme lues");
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success("Notification supprimée");
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        toast.success("Toutes les notifications ont été supprimées");
    };

    return (
        <div className="flex flex-col gap-6 px-4 lg:px-8 py-4 lg:py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-6 lg:p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1 w-fit">
                            {unreadCount > 0
                                ? `${unreadCount} nouvelles`
                                : "À jour"}
                        </Badge>
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                        Notifications
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg max-w-2xl">
                        Reste informé de tes progrès, examens à venir et
                        nouvelles fonctionnalités.
                    </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 right-8 w-16 h-16 lg:w-20 lg:h-20 bg-purple-300/20 rounded-full blur-lg"></div>
            </div>

            {/* Controls */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col gap-4">
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant={
                                    filter === "all" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setFilter("all")}
                                className={`text-xs lg:text-sm h-8 lg:h-9 ${
                                    filter === "all"
                                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Toutes ({notifications.length})
                            </Button>
                            <Button
                                variant={
                                    filter === "unread" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setFilter("unread")}
                                className={`text-xs lg:text-sm h-8 lg:h-9 ${
                                    filter === "unread"
                                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Non lues ({unreadCount})
                            </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs lg:text-sm h-8 lg:h-9"
                                >
                                    <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                                    <span className="hidden sm:inline">
                                        Tout marquer comme lu
                                    </span>
                                    <span className="sm:hidden">
                                        Marquer tout
                                    </span>
                                </Button>
                            )}
                            {notifications.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAllNotifications}
                                    className="border-red-200 text-red-700 hover:bg-red-50 text-xs lg:text-sm h-8 lg:h-9"
                                >
                                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                                    <span className="hidden sm:inline">
                                        Tout supprimer
                                    </span>
                                    <span className="sm:hidden">Supprimer</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3 lg:space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                        <CardContent className="p-8 lg:p-12">
                            <div className="flex flex-col items-center justify-center text-center gap-4">
                                <div className="p-3 lg:p-4 bg-blue-50 rounded-2xl">
                                    <Bell className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                                        {filter === "unread"
                                            ? "Aucune notification non lue"
                                            : "Aucune notification"}
                                    </h3>
                                    <p className="text-gray-500 max-w-md text-sm lg:text-base">
                                        {filter === "unread"
                                            ? "Tu es à jour ! Toutes tes notifications ont été lues."
                                            : "Tu n'as pas encore de notifications. Elles apparaîtront ici quand tu en recevras."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map(notification => (
                        <Card
                            key={notification.id}
                            className={`bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-200 ${
                                !notification.isRead
                                    ? "ring-2 ring-blue-200"
                                    : ""
                            }`}
                        >
                            <CardContent className="p-4 lg:p-6">
                                <div className="flex items-start gap-3 lg:gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`p-2 lg:p-3 rounded-xl shrink-0 ${getNotificationColor(
                                            notification.type
                                        )}`}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                                            <h3
                                                className={`text-sm lg:text-base font-semibold text-gray-800 ${
                                                    !notification.isRead
                                                        ? "text-gray-900"
                                                        : ""
                                                }`}
                                            >
                                                {notification.title}
                                            </h3>
                                            <div className="flex items-center gap-1 lg:gap-2 text-xs text-gray-500 shrink-0">
                                                <Clock className="w-3 h-3" />
                                                {formatTimeAgo(
                                                    notification.timestamp
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4">
                                            {notification.message}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {notification.actionUrl &&
                                                    notification.actionLabel && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs lg:text-sm h-8 lg:h-9"
                                                            onClick={() => {
                                                                markAsRead(
                                                                    notification.id
                                                                );
                                                                // In a real app, you'd navigate to the URL
                                                                toast.success(
                                                                    `Redirection vers ${notification.actionLabel}`
                                                                );
                                                            }}
                                                        >
                                                            {
                                                                notification.actionLabel
                                                            }
                                                        </Button>
                                                    )}
                                                {!notification.isRead && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs lg:text-sm h-8 lg:h-9"
                                                    >
                                                        <span className="hidden sm:inline">
                                                            Marquer comme lu
                                                        </span>
                                                        <span className="sm:hidden">
                                                            Lu
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id
                                                    )
                                                }
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 w-fit sm:w-auto text-xs lg:text-sm h-8 lg:h-9"
                                            >
                                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                                <span className="ml-1 sm:hidden">
                                                    Supprimer
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Quick Stats */}
            {notifications.length > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                    <CardContent className="p-4 lg:p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                            <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-2xl">
                                <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-1">
                                    {notifications.length}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Total
                                </div>
                            </div>
                            <div className="text-center p-3 lg:p-4 bg-green-50 rounded-2xl">
                                <div className="text-lg lg:text-xl font-bold text-green-600 mb-1">
                                    {notifications.filter(n => n.isRead).length}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Lues
                                </div>
                            </div>
                            <div className="text-center p-3 lg:p-4 bg-orange-50 rounded-2xl">
                                <div className="text-lg lg:text-xl font-bold text-orange-600 mb-1">
                                    {unreadCount}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Non lues
                                </div>
                            </div>
                            <div className="text-center p-3 lg:p-4 bg-purple-50 rounded-2xl">
                                <div className="text-lg lg:text-xl font-bold text-purple-600 mb-1">
                                    {
                                        notifications.filter(
                                            n => n.type === "achievement"
                                        ).length
                                    }
                                </div>
                                <div className="text-xs text-gray-600">
                                    Badges
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
