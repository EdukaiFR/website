"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TicketStatistics, TicketStatus } from "@/lib/types/ticket";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";

interface AdminStatisticsProps {
    statistics: TicketStatistics;
    isLoading?: boolean;
}

export function AdminStatistics({
    statistics,
    isLoading = false,
}: AdminStatisticsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const getStatusConfig = (status: TicketStatus) => {
        const configs = {
            [TicketStatus.NEW]: {
                label: "Nouveaux",
                icon: Clock,
                colors: "from-blue-500 to-blue-600 text-white",
                bgColors: "bg-blue-50 border-blue-200",
                iconColor: "text-blue-600",
            },
            [TicketStatus.TRIAGED]: {
                label: "Triés",
                icon: AlertCircle,
                colors: "from-yellow-500 to-yellow-600 text-white",
                bgColors: "bg-yellow-50 border-yellow-200",
                iconColor: "text-yellow-600",
            },
            [TicketStatus.IN_PROGRESS]: {
                label: "En cours",
                icon: TrendingUp,
                colors: "from-orange-500 to-orange-600 text-white",
                bgColors: "bg-orange-50 border-orange-200",
                iconColor: "text-orange-600",
            },
            [TicketStatus.RESOLVED]: {
                label: "Résolus",
                icon: CheckCircle,
                colors: "from-green-500 to-green-600 text-white",
                bgColors: "bg-green-50 border-green-200",
                iconColor: "text-green-600",
            },
            [TicketStatus.CLOSED]: {
                label: "Fermés",
                icon: CheckCircle,
                colors: "from-gray-500 to-gray-600 text-white",
                bgColors: "bg-gray-50 border-gray-200",
                iconColor: "text-gray-600",
            },
            [TicketStatus.REOPENED]: {
                label: "Rouverts",
                icon: AlertCircle,
                colors: "from-purple-500 to-purple-600 text-white",
                bgColors: "bg-purple-50 border-purple-200",
                iconColor: "text-purple-600",
            },
            [TicketStatus.REJECTED]: {
                label: "Rejetés",
                icon: XCircle,
                colors: "from-red-500 to-red-600 text-white",
                bgColors: "bg-red-50 border-red-200",
                iconColor: "text-red-600",
            },
            [TicketStatus.DUPLICATE]: {
                label: "Doublons",
                icon: XCircle,
                colors: "from-pink-500 to-pink-600 text-white",
                bgColors: "bg-pink-50 border-pink-200",
                iconColor: "text-pink-600",
            },
        };
        return configs[status] || configs[TicketStatus.NEW];
    };

    return (
        <div className="space-y-6 w-full">
            {/* Status Breakdown avec Vue d'ensemble intégrée */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {/* Vue d'ensemble - Total */}
                <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl border-0 w-full">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                    {statistics.total}
                                </div>
                                <div className="text-xs text-white/80">
                                    100%
                                </div>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-white">
                            Vue d'ensemble
                        </div>

                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                            <div className="h-1 rounded-full bg-white/80 w-full" />
                        </div>
                    </CardContent>
                </Card>
                {Object.entries(statistics.byStatus)
                    .filter(([_, count]) => count > 0)
                    .map(([status, count]) => {
                        const config = getStatusConfig(status as TicketStatus);
                        const Icon = config.icon;
                        const percentage =
                            statistics.total > 0
                                ? ((count / statistics.total) * 100).toFixed(1)
                                : "0";

                        return (
                            <Card
                                key={status}
                                className={cn(
                                    "border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 w-full",
                                    config.bgColors
                                )}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div
                                            className={cn(
                                                "p-2 rounded-lg bg-white",
                                                config.iconColor
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {count}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {percentage}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-800">
                                        {config.label}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                        <div
                                            className={cn(
                                                "h-1 rounded-full transition-all duration-300",
                                                `bg-gradient-to-r ${config.colors.split(" ")[0]} ${config.colors.split(" ")[1]}`
                                            )}
                                            style={{
                                                width: `${Math.min(100, (count / Math.max(...Object.values(statistics.byStatus))) * 100)}%`,
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-emerald-800">
                                    {(
                                        (((statistics.byStatus[
                                            TicketStatus.RESOLVED
                                        ] || 0) +
                                            (statistics.byStatus[
                                                TicketStatus.CLOSED
                                            ] || 0)) /
                                            Math.max(statistics.total, 1)) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </div>
                                <div className="text-sm text-emerald-700">
                                    Taux de résolution
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500 rounded-lg">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-amber-800">
                                    {(statistics.byStatus[TicketStatus.NEW] ||
                                        0) +
                                        (statistics.byStatus[
                                            TicketStatus.REOPENED
                                        ] || 0)}
                                </div>
                                <div className="text-sm text-amber-700">
                                    En attente
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-blue-800">
                                    {(statistics.byStatus[
                                        TicketStatus.TRIAGED
                                    ] || 0) +
                                        (statistics.byStatus[
                                            TicketStatus.IN_PROGRESS
                                        ] || 0)}
                                </div>
                                <div className="text-sm text-blue-700">
                                    En traitement
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
