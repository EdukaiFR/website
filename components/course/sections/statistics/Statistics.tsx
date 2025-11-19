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
import { useEffect, useState } from "react";

export type StatisticsProps = {
    course_id: string;
    statistics: unknown;
    quiz_id?: string;
    insights_service?: InsightsService;
    insights_data?: {
        items: Array<{
            _id: string;
            score: number;
            createdAt: string;
            author: string;
        }>;
    };
};

export const Statistics = ({
    course_id: _course_id,
    statistics: _statistics,
    quiz_id,
    insights_service,
    insights_data,
}: StatisticsProps) => {
    const [localInsights, setLocalInsights] = useState(insights_data);
    const [loading, setLoading] = useState(!insights_data); // Start loading if no initial data
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(!!insights_data);

    useEffect(() => {
        const fetchInsights = async () => {
            if (quiz_id && insights_service && !hasAttemptedFetch) {
                setLoading(true);
                setHasAttemptedFetch(true);

                try {
                    // Add timeout to prevent hanging
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(
                            () => reject(new Error("Request timeout")),
                            8000
                        )
                    );

                    const dataPromise =
                        insights_service.getQuizInsights(quiz_id);
                    const data = (await Promise.race([
                        dataPromise,
                        timeoutPromise,
                    ])) as StatisticsProps["insights_data"];

                    setLocalInsights(data);
                } catch (error) {
                    console.error(
                        "❌ [Statistics] Failed to fetch insights:",
                        error
                    );
                    // Set empty data to show "no statistics" instead of infinite loading
                    setLocalInsights({ items: [] });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInsights();
    }, [quiz_id, insights_service, hasAttemptedFetch]);

    // Auto-refresh insights to catch new quiz completions (only after initial load)
    useEffect(() => {
        if (!quiz_id || !insights_service || !hasAttemptedFetch || loading)
            return;

        const refreshInsights = async () => {
            try {
                const data = (await insights_service.getQuizInsights(
                    quiz_id
                )) as StatisticsProps["insights_data"];
                setLocalInsights(data);
            } catch {
                // Auto-refresh failed, continue with current data
            }
        };

        const interval = setInterval(refreshInsights, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, [quiz_id, insights_service, hasAttemptedFetch, loading]);

    // Always use the most current data available
    const currentInsights = localInsights || insights_data;

    // Calculate statistics
    const calculateStats = (data = currentInsights) => {
        if (!data) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                improvementTrend: 0,
                recentPerformance: [],
                scoreDistribution: {
                    excellent: 0,
                    good: 0,
                    average: 0,
                    needsWork: 0,
                },
                streakData: { current: 0, best: 0 },
                weeklyActivity: Array(7).fill(0),
            };
        }

        // If we have individual insights data, calculate detailed stats
        if (data.items && data.items.length > 0) {
            const insights = data.items;
            const scores = insights.map(i => i.score);

            // Basic stats
            const totalQuizzes = insights.length;
            const averageScore =
                scores.reduce((a, b) => a + b, 0) / scores.length;
            const highestScore = Math.max(...scores);
            const lowestScore = Math.min(...scores);

            // Improvement trend (comparing recent performance vs average)
            let improvementTrend = 0;
            if (insights.length >= 2) {
                if (insights.length >= 4) {
                    // If we have 4+ quizzes, compare last 2 vs previous 2
                    const recent =
                        insights.slice(-2).reduce((a, b) => a + b.score, 0) / 2;
                    const previous =
                        insights
                            .slice(-4, -2)
                            .reduce((a, b) => a + b.score, 0) / 2;
                    improvementTrend = recent - previous;
                } else {
                    // If we have 2-3 quizzes, compare last quiz vs average of all previous
                    const lastScore = insights[insights.length - 1].score;
                    const previousAvg =
                        insights.slice(0, -1).reduce((a, b) => a + b.score, 0) /
                        (insights.length - 1);
                    improvementTrend = lastScore - previousAvg;
                }
            }

            // Recent performance (last 10 quizzes)
            const recentPerformance = insights
                .slice(-10)
                .map((insight, index) => ({
                    attempt: totalQuizzes - 9 + index,
                    score: insight.score,
                    date: insight.createdAt,
                }));

            // Score distribution
            const scoreDistribution = {
                excellent: scores.filter(s => s >= 90).length,
                good: scores.filter(s => s >= 70 && s < 90).length,
                average: scores.filter(s => s >= 50 && s < 70).length,
                needsWork: scores.filter(s => s < 50).length,
            };

            // Streak calculation (success = score >= 70%)
            let currentStreak = 0;
            let bestStreak = 0;
            let tempStreak = 0;

            // Calculate current streak (starting from most recent)
            for (let i = insights.length - 1; i >= 0; i--) {
                if (insights[i].score >= 70) {
                    currentStreak++;
                } else {
                    break; // Streak broken
                }
            }

            // Calculate best streak
            for (let i = 0; i < insights.length; i++) {
                if (insights[i].score >= 70) {
                    tempStreak++;
                    bestStreak = Math.max(bestStreak, tempStreak);
                } else {
                    tempStreak = 0;
                }
            }

            // Weekly activity (last 7 days)
            const weeklyActivity = Array(7).fill(0);
            const today = new Date();
            insights.forEach(insight => {
                const insightDate = new Date(insight.createdAt);
                const daysDiff = Math.floor(
                    (today.getTime() - insightDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                if (daysDiff < 7) {
                    weeklyActivity[6 - daysDiff]++;
                }
            });

            return {
                totalQuizzes,
                averageScore,
                highestScore,
                lowestScore,
                improvementTrend,
                recentPerformance,
                scoreDistribution,
                streakData: { current: currentStreak, best: bestStreak },
                weeklyActivity,
            };
        }

        // No data at all
        return {
            totalQuizzes: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            improvementTrend: 0,
            recentPerformance: [],
            scoreDistribution: {
                excellent: 0,
                good: 0,
                average: 0,
                needsWork: 0,
            },
            streakData: { current: 0, best: 0 },
            weeklyActivity: Array(7).fill(0),
        };
    };

    // Format date like in Overview tab
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        const timeString = date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (diffInDays === 0) return `Aujourd'hui à ${timeString}`;
        if (diffInDays === 1) return `Hier à ${timeString}`;
        if (diffInDays < 7) return `Il y a ${diffInDays} jours à ${timeString}`;

        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }) + ` à ${timeString}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 60)
            return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const getTrendIcon = (trend: number) => {
        if (trend > 5) return <ChevronUp className="w-4 h-4 text-green-600" />;
        if (trend < -5) return <ChevronDown className="w-4 h-4 text-red-600" />;
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

    // Check if we have any insights data at all - be more flexible with data structure
    const hasData =
        currentInsights &&
        ((currentInsights.items && currentInsights.items.length > 0) ||
            (Array.isArray(currentInsights) && currentInsights.length > 0)); // Handle array format

    if (!hasData) {
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

    // Process insights data - NO MOCK DATA, only real data
    const processInsightsData = (data: unknown) => {
        const typedData = data as {
            items?: Array<{
                _id: string;
                score: number;
                createdAt: string;
                author: string;
            }>;
        };

        if (typedData?.items && typedData.items.length > 0) {
            // We have real insights data
            return {
                items: typedData.items,
            };
        }

        return {
            items: [],
        };
    };

    const processedInsights = processInsightsData(currentInsights);
    const stats = calculateStats(processedInsights);
    const hasRealInsights =
        processedInsights?.items && processedInsights.items.length > 0;
    const hasBasicStats = hasRealInsights;

    // Show loading state during initial load
    if (loading) {
        return (
            <div className="space-y-6">
                {/* Loading skeleton for overview stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Loading message */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500 text-lg">
                                Chargement des statistiques...
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Récupération de vos données de quiz
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show empty state only after initial load is complete and no data
    if (!hasBasicStats) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Aucune statistique disponible
                    </h3>
                    <p className="text-gray-500">
                        Complétez quelques quiz pour voir vos statistiques.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats - Only show basic stats that work with summary data */}
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
                        {hasRealInsights && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 font-medium mt-1">
                                {getTrendIcon(stats.improvementTrend)}
                                <span>
                                    {stats.improvementTrend > 0 ? "+" : ""}
                                    {Math.round(stats.improvementTrend)}% vs
                                    précédent
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {hasRealInsights && (
                    <>
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
                                    {Math.round(stats.highestScore)}%
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
                    </>
                )}
            </div>

            {/* Performance Chart - Only show with real insights data */}
            {hasRealInsights && (
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
                        <CardDescription className="text-gray-600 font-medium ml-14">Vos 10 derniers quiz</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.recentPerformance.map(
                                (performance) => (
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
                                                    {formatDate(performance.date)}
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
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Score Distribution & Weekly Activity - Only show with real insights data */}
            {hasRealInsights && (
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
                                            <p className="text-xs text-gray-500">90-100%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-green-600">
                                            {stats.scoreDistribution.excellent}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {Math.round((stats.scoreDistribution.excellent / stats.totalQuizzes) * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-2.5 bg-green-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(stats.scoreDistribution.excellent / stats.totalQuizzes) * 100}%` }}
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
                                            <p className="text-xs text-gray-500">70-89%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-blue-600">
                                            {stats.scoreDistribution.good}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {Math.round((stats.scoreDistribution.good / stats.totalQuizzes) * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-2.5 bg-blue-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(stats.scoreDistribution.good / stats.totalQuizzes) * 100}%` }}
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
                                            <p className="text-xs text-gray-500">50-69%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-yellow-600">
                                            {stats.scoreDistribution.average}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {Math.round((stats.scoreDistribution.average / stats.totalQuizzes) * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-2.5 bg-yellow-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(stats.scoreDistribution.average / stats.totalQuizzes) * 100}%` }}
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
                                            <p className="text-xs text-gray-500">&lt;50%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-red-600">
                                            {stats.scoreDistribution.needsWork}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {Math.round((stats.scoreDistribution.needsWork / stats.totalQuizzes) * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-2.5 bg-red-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(stats.scoreDistribution.needsWork / stats.totalQuizzes) * 100}%` }}
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
                                                    stats.weeklyActivity[
                                                        index
                                                    ] > 0
                                                        ? `rgba(59, 130, 246, ${Math.min(
                                                              stats
                                                                  .weeklyActivity[
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
            )}

            {/* Achievement Section - Only show with real insights data */}
            {hasRealInsights && (
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
                                    {Math.round(stats.highestScore)}%
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
            )}
        </div>
    );
};
