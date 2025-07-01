"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
        averageScore: number;
        insightsCount: number;
        insights?: Array<{
            score: number;
            createdAt: string;
        }>;
    };
};

export const Statistics = ({
    course_id,
    statistics,
    quiz_id,
    insights_service,
    insights_data,
}: StatisticsProps) => {
    console.log(course_id);
    console.log(statistics);
    const [localInsights, setLocalInsights] = useState(insights_data);
    const [loading, setLoading] = useState(!insights_data); // Start loading if no initial data
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(!!insights_data);

    useEffect(() => {
        const fetchInsights = async () => {
            if (quiz_id && insights_service && !hasAttemptedFetch) {
                console.log(
                    "🔍 [Statistics] Fetching insights for quiz:",
                    quiz_id
                );
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

                    console.log("✅ [Statistics] Insights fetched:", data);
                    setLocalInsights(data);
                } catch (error) {
                    console.error(
                        "❌ [Statistics] Failed to fetch insights:",
                        error
                    );
                    // Set empty data to show "no statistics" instead of infinite loading
                    setLocalInsights({ insightsCount: 0, averageScore: 0 });
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
            } catch (error) {
                console.log("⚠️ [Statistics] Auto-refresh failed:", error);
            }
        };

        const interval = setInterval(refreshInsights, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, [quiz_id, insights_service, hasAttemptedFetch, loading]);

    // Always use the most current data available
    const currentInsights = localInsights || insights_data;

    console.log("🔍 [Statistics] Debug info:", {
        quiz_id,
        hasInsightsService: !!insights_service,
        insights_data,
        localInsights,
        currentInsights,
        loading,
    });

    // Calculate statistics
    const calculateStats = (data = currentInsights) => {
        console.log("🔍 [Statistics] calculateStats called with:", {
            data,
            hasData: !!data,
            insightsArray: data?.insights,
            insightsLength: data?.insights?.length,
            insightsCount: data?.insightsCount,
        });

        if (!data) {
            console.log("⚠️ [Statistics] No data available - returning zeros");
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
        if (data.insights && data.insights.length > 0) {
            console.log(
                "✅ [Statistics] Calculating detailed stats with insights:",
                data.insights.length
            );
            console.log("✅ [Statistics] Sample insight:", data.insights[0]);

            const insights = data.insights;
            const scores = insights.map(i => i.score);

            console.log("✅ [Statistics] Extracted scores:", scores);

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

        // If we only have summary data, use it for basic stats
        if (data.insightsCount && data.insightsCount > 0) {
            console.log("✅ [Statistics] Using summary data for basic stats");
            return {
                totalQuizzes:
                    typeof data.insightsCount === "string"
                        ? parseInt(data.insightsCount)
                        : data.insightsCount || 0,
                averageScore:
                    typeof data.averageScore === "string"
                        ? parseFloat(data.averageScore)
                        : data.averageScore || 0,
                highestScore: 0, // Not available in summary
                lowestScore: 0, // Not available in summary
                improvementTrend: 0, // Not available in summary
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

        // No data at all
        console.log(
            "⚠️ [Statistics] No insights data available - returning zeros"
        );
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

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
        if (score >= 50)
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
        ((currentInsights.insightsCount && currentInsights.insightsCount > 0) ||
            (currentInsights.insights && currentInsights.insights.length > 0) ||
            (Array.isArray(currentInsights) && currentInsights.length > 0)); // Handle array format

    console.log("🔍 [Statistics] hasData check:", {
        hasData,
        insightsCount: currentInsights?.insightsCount,
        insightsLength: currentInsights?.insights?.length,
    });

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
            insights?: Array<{ score: number; createdAt: string }>;
            insightsCount?: number | string;
            averageScore?: number | string;
        };

        if (typedData && typedData.insights && typedData.insights.length > 0) {
            // We have real insights data
            console.log(
                "✅ [Statistics] Using real insights data:",
                typedData.insights
            );
            return {
                ...typedData,
                averageScore: parseFloat(String(typedData.averageScore)) || 0,
                insightsCount: parseInt(String(typedData.insightsCount)) || 0,
            };
        } else if (
            typedData.insightsCount &&
            parseInt(String(typedData.insightsCount)) > 0
        ) {
            // We only have summary data - return as is, no mock generation
            console.log(
                "⚠️ [Statistics] Only summary data available, no mock generation"
            );
            return {
                averageScore: parseFloat(String(typedData.averageScore)) || 0,
                insightsCount: parseInt(String(typedData.insightsCount)) || 0,
                insights: [], // Empty array - sections will be hidden
            };
        }

        return {
            averageScore: 0,
            insightsCount: 0,
            insights: [],
        };
    };

    const processedInsights = processInsightsData(currentInsights);
    const stats = calculateStats(processedInsights);
    const hasRealInsights =
        processedInsights?.insights && processedInsights.insights.length > 0;
    const hasBasicStats = processedInsights?.insightsCount > 0;

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Quiz terminés
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.totalQuizzes}
                        </div>
                        <p className="text-xs text-gray-500">
                            Total des tentatives
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Score moyen
                        </CardTitle>
                        <Target className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round(stats.averageScore)}%
                        </div>
                        {hasRealInsights && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Meilleur score
                                </CardTitle>
                                <Trophy className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {Math.round(stats.highestScore)}%
                                </div>
                                <p className="text-xs text-gray-500">
                                    Record personnel
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Série actuelle
                                </CardTitle>
                                <Zap className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {stats.streakData.current}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Quiz réussis (≥70%)
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Message when only basic stats are available */}
            {!hasRealInsights && hasBasicStats && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                Statistiques détaillées bientôt disponibles
                            </h3>
                            <p className="text-gray-500">
                                Complétez plus de quiz pour débloquer les
                                graphiques détaillés, l&apos;évolution des
                                performances et l&apos;analyse des tendances.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Performance Chart - Only show with real insights data */}
            {hasRealInsights && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Évolution des performances
                        </CardTitle>
                        <CardDescription>Vos 10 derniers quiz</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentPerformance.map(
                                (performance, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                variant="outline"
                                                className="w-16 justify-center"
                                            >
                                                #{performance.attempt}
                                            </Badge>
                                            <div
                                                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(
                                                    performance.score
                                                )}`}
                                            >
                                                {Math.round(performance.score)}%
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(
                                                performance.date
                                            ).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Répartition des scores
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm">
                                            Excellent (90-100%)
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.scoreDistribution.excellent}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (stats.scoreDistribution.excellent /
                                            stats.totalQuizzes) *
                                        100
                                    }
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm">
                                            Bien (70-89%)
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.scoreDistribution.good}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (stats.scoreDistribution.good /
                                            stats.totalQuizzes) *
                                        100
                                    }
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm">
                                            Moyen (50-69%)
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.scoreDistribution.average}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (stats.scoreDistribution.average /
                                            stats.totalQuizzes) *
                                        100
                                    }
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-sm">
                                            À améliorer (&lt;50%)
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.scoreDistribution.needsWork}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (stats.scoreDistribution.needsWork /
                                            stats.totalQuizzes) *
                                        100
                                    }
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Activité de la semaine
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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Performances
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-yellow-600">
                                    {Math.round(stats.highestScore)}%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Meilleur score
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.streakData.best}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Meilleure série
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.scoreDistribution.excellent +
                                        stats.scoreDistribution.good}
                                </div>
                                <div className="text-sm text-gray-600">
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
