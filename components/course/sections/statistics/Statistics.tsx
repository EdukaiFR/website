"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { InsightsService } from "@/services";
import {
    Activity,
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronUp,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { formatRelativeDate } from "@/lib/utils/date";
import type { InsightItem, InsightsResponse } from "@/lib/types/insights";

export type StatisticsProps = {
    course_id: string;
    statistics?: Record<string, unknown>;
    quiz_id?: string;
    insights_service?: InsightsService;
    insights_data?: InsightsResponse;
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const Statistics = ({
    course_id: _course_id,
    statistics: _statistics,
    quiz_id,
    insights_service,
    insights_data,
}: StatisticsProps) => {
    const [localInsights, setLocalInsights] =
        useState<InsightsResponse | null>(insights_data || null);
    const [loading, setLoading] = useState(!insights_data);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(!!insights_data);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Update local insights when prop changes
    useEffect(() => {
        if (insights_data) {
            setLocalInsights(insights_data);
            setHasAttemptedFetch(true);
            setLoading(false);
        }
    }, [insights_data]);

    // Initial fetch with AbortController
    useEffect(() => {
        const fetchInsights = async () => {
            if (quiz_id && insights_service && !hasAttemptedFetch) {
                // Cancel previous request
                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();

                setLoading(true);
                setHasAttemptedFetch(true);

                try {
                    const data = await insights_service.getQuizInsights(
                        quiz_id,
                        abortControllerRef.current.signal
                    );
                    setLocalInsights(data);
                } catch (error) {
                    if (error instanceof Error && error.name === "AbortError") {
                        return;
                    }
                    // Set empty data to show "no statistics"
                    setLocalInsights({ items: [] });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInsights();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [quiz_id, insights_service, hasAttemptedFetch]);

    // Auto-refresh insights every 5 minutes (only after initial load)
    useEffect(() => {
        if (!quiz_id || !insights_service || !hasAttemptedFetch || loading)
            return;

        const refreshInsights = async () => {
            try {
                const data = await insights_service.getQuizInsights(quiz_id);
                setLocalInsights(data);
            } catch {
                // Auto-refresh failed, continue with current data
            }
        };

        const interval = setInterval(refreshInsights, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [quiz_id, insights_service, hasAttemptedFetch, loading]);

    // Convert to InsightItem format for the hook
    const insights: InsightItem[] = useMemo(() => {
        if (!localInsights?.items) return [];
        return localInsights.items.map(item => ({
            _id: item._id,
            score: item.score,
            createdAt: item.createdAt,
            author: item.author,
            quizId: quiz_id || "",
            userId: item.author,
        }));
    }, [localInsights, quiz_id]);

    // Use shared statistics hook
    const stats = useUserStatistics(insights);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 60)
            return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const getTrendIcon = (trend: "up" | "down" | "stable") => {
        if (trend === "up")
            return <ChevronUp className="w-4 h-4 text-green-600" />;
        if (trend === "down")
            return <ChevronDown className="w-4 h-4 text-red-600" />;
        return <Activity className="w-4 h-4 text-gray-600" />;
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Chargement des statistiques...
                </h3>
                <p className="text-gray-500 text-sm max-w-md">
                    Récupération de vos données de performance.
                </p>
            </div>
        );
    }

    // Show empty state
    if (stats.totalQuizzes === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="p-6 bg-blue-50 rounded-2xl mb-4">
                    <BarChart3 className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Aucune statistique disponible
                </h3>
                <p className="text-gray-500 text-sm max-w-md">
                    Complétez quelques quiz pour voir vos statistiques
                    détaillées et suivre votre progression.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Quiz terminés
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <BookOpen className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            {stats.totalQuizzes}
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-1">
                            Total des tentatives
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Score moyen
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <Target className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            {Math.round(stats.averageScore)}%
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600 font-medium mt-1">
                            {getTrendIcon(stats.trend)}
                            <span>
                                {stats.trend === "up" && "+"}
                                {stats.trend === "down" && "-"}
                                {stats.trend === "stable"
                                    ? "Stable"
                                    : "vs précédent"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Meilleur score
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <Trophy className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            {Math.round(stats.bestScore)}%
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-1">
                            Record personnel
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Série actuelle
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            {stats.streakData.current}
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-1">
                            Quiz réussis (≥70%)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-blue-50/20 to-indigo-50/20 backdrop-blur-md hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                            Évolution des performances
                        </span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-medium ml-14">
                        Vos 10 derniers quiz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {stats.recentPerformance.map(performance => (
                            <div
                                key={`${performance.attempt}-${performance.date}`}
                                className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <Trophy className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Quiz #{performance.attempt}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {formatRelativeDate(performance.date)}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`px-2 py-1 rounded-md border text-xs font-semibold ${getScoreColor(
                                        performance.score
                                    )}`}
                                >
                                    {Math.round(performance.score)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Score Distribution & Weekly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                                Répartition des scores
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Excellent */}
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl border border-green-200/50 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                                        <Trophy className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            Excellent
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            90-100%
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-green-600">
                                        {stats.scoreDistribution.excellent}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {Math.round(
                                            (stats.scoreDistribution.excellent /
                                                stats.totalQuizzes) *
                                                100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-2.5 bg-green-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(stats.scoreDistribution.excellent / stats.totalQuizzes) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Bien */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-200/50 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                                        <Target className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            Bien
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            70-89%
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-blue-600">
                                        {stats.scoreDistribution.good}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {Math.round(
                                            (stats.scoreDistribution.good /
                                                stats.totalQuizzes) *
                                                100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-2.5 bg-blue-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(stats.scoreDistribution.good / stats.totalQuizzes) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Moyen */}
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-50/50 rounded-xl border border-yellow-200/50 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500 rounded-lg shadow-sm">
                                        <Activity className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            Moyen
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            50-69%
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-yellow-600">
                                        {stats.scoreDistribution.average}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {Math.round(
                                            (stats.scoreDistribution.average /
                                                stats.totalQuizzes) *
                                                100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-2.5 bg-yellow-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(stats.scoreDistribution.average / stats.totalQuizzes) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* À améliorer */}
                        <div className="p-4 bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl border border-red-200/50 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500 rounded-lg shadow-sm">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            À améliorer
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            &lt;50%
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-red-600">
                                        {stats.scoreDistribution.needsWork}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {Math.round(
                                            (stats.scoreDistribution.needsWork /
                                                stats.totalQuizzes) *
                                                100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-2.5 bg-red-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(stats.scoreDistribution.needsWork / stats.totalQuizzes) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Activity */}
                <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                                Activité de la semaine
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2">
                            {[
                                "Dim",
                                "Lun",
                                "Mar",
                                "Mer",
                                "Jeu",
                                "Ven",
                                "Sam",
                            ].map((day, index) => (
                                <div key={day} className="text-center">
                                    <div className="text-xs text-gray-500 mb-2">
                                        {day}
                                    </div>
                                    <div
                                        className="h-12 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-semibold"
                                        style={{
                                            backgroundColor:
                                                stats.weeklyActivity[index] > 0
                                                    ? `rgba(59, 130, 246, ${Math.min(
                                                          stats.weeklyActivity[
                                                              index
                                                          ] / 3,
                                                          1
                                                      )})`
                                                    : "#f3f4f6",
                                        }}
                                    >
                                        {stats.weeklyActivity[index] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Quiz terminés par jour cette semaine
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Achievement Section */}
            <Card className="border border-blue-100/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                            Performances
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-blue-50/50 to-blue-100/30 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl w-fit mx-auto mb-3 shadow-lg">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                                {Math.round(stats.bestScore)}%
                            </div>
                            <div className="text-sm text-gray-700 font-semibold">
                                Meilleur score
                            </div>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-blue-50/50 to-indigo-50/30 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl w-fit mx-auto mb-3 shadow-lg">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                                {stats.streakData.best}
                            </div>
                            <div className="text-sm text-gray-700 font-semibold">
                                Meilleure série
                            </div>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-blue-50/50 to-blue-100/30 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl w-fit mx-auto mb-3 shadow-lg">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                                {stats.scoreDistribution.excellent +
                                    stats.scoreDistribution.good}
                            </div>
                            <div className="text-sm text-gray-700 font-semibold">
                                Quiz réussis (≥70%)
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
