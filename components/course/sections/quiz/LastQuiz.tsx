import {
    Clock,
    BarChart3,
    TrendingUp,
    Award,
    Zap,
    Trophy,
    Activity,
} from "lucide-react";

export type LastQuizProps = {
    last_attemps: Array<{
        score: number;
        createdAt: string;
    }>;
    insights_data?: {
        items: Array<{
            _id: string;
            score: number;
            createdAt: string;
            author: string;
        }>;
    };
    className?: string;
};

export const LastQuiz = ({
    last_attemps,
    insights_data,
    className,
}: LastQuizProps) => {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "Date invalide";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50";
        if (score >= 60) return "text-blue-600 bg-blue-50";
        if (score >= 40) return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };

    // Calculate trend and performance insights
    const calculateInsights = () => {
        // Return defaults if no insights data or insufficient data
        if (!insights_data?.items || insights_data.items.length === 0) {
            return {
                trend: 0,
                trendDirection: "stable" as const,
                streak: 0,
                recentAverage: 0,
                improvement: 0,
                totalCount: 0,
                averageScore: 0,
            };
        }

        const insights = insights_data.items;
        // const scores = insights.map((i) => i.score);

        // Calculate trend only if we have enough data (6+ attempts)
        let trend = 0;
        let trendDirection: "up" | "down" | "stable" = "stable";
        if (insights.length >= 6) {
            const recent =
                insights.slice(-3).reduce((a, b) => a + b.score, 0) / 3;
            const previous =
                insights.slice(-6, -3).reduce((a, b) => a + b.score, 0) / 3;
            trend = recent - previous;
            trendDirection = trend > 5 ? "up" : trend < -5 ? "down" : "stable";
        }

        // Calculate current streak (only meaningful with real data)
        let streak = 0;
        for (let i = insights.length - 1; i >= 0; i--) {
            if (insights[i].score >= 70) {
                streak++;
            } else {
                break;
            }
        }

        // Recent average (use all available data if less than 5)
        const recentScores =
            insights.length >= 5 ? insights.slice(-5) : insights;
        const recentAverage =
            recentScores.reduce((a, b) => a + b.score, 0) / recentScores.length;

        // Overall improvement only if we have enough data (4+ attempts)
        let improvement = 0;
        if (insights.length >= 4) {
            const firstScore = insights[0].score;
            const lastThreeAvg =
                insights.slice(-3).reduce((a, b) => a + b.score, 0) / 3;
            improvement = lastThreeAvg - firstScore;
        }

        // Calculate average score
        const scores = insights.map(i => i.score);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        return {
            trend,
            trendDirection,
            streak,
            recentAverage,
            improvement,
            totalCount: insights.length,
            averageScore,
        };
    };

    const insights = calculateInsights();

    const getMotivationalMessage = () => {
        if (!insights_data || insights_data.items.length === 0) {
            return {
                title: "Premier quiz !",
                message:
                    "C'était ton premier quiz, lance-en d'autres pour suivre ta progression et voir tes scores précédents.",
                type: "first",
            };
        }

        const avgScore = insights.averageScore;
        const streak = insights.streak;
        const trend = insights.trendDirection;

        if (streak >= 3) {
            return {
                title: `🔥 Série de ${streak} !`,
                message:
                    "Tu es en feu ! Continue sur cette lancée pour atteindre de nouveaux sommets.",
                type: "streak",
            };
        }

        if (trend === "up") {
            return {
                title: "📈 Progression excellente !",
                message:
                    "Tes scores s'améliorent régulièrement. Continue comme ça !",
                type: "improving",
            };
        }

        if (avgScore >= 80) {
            return {
                title: "🌟 Performance exceptionnelle !",
                message:
                    "Tu maîtrises parfaitement ce sujet. Prêt pour de nouveaux défis ?",
                type: "excellent",
            };
        }

        if (avgScore >= 60) {
            return {
                title: "💪 Bon travail !",
                message:
                    "Tu progresses bien. Quelques révisions et tu seras au top !",
                type: "good",
            };
        }

        return {
            title: "🎯 Continue tes efforts !",
            message:
                "Chaque quiz est une opportunité d'apprendre. Tu y arrives !",
            type: "encouraging",
        };
    };

    const motivationalData = getMotivationalMessage();

    return (
        <div
            className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800">
                    Tes statistiques
                </span>
            </div>

            {/* Statistics Cards */}
            {insights_data && insights_data.items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Award className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                            {Math.round(insights.averageScore)}%
                        </p>
                        <p className="text-xs text-gray-500">Score moyen</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Award className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                            {insights.totalCount}
                        </p>
                        <p className="text-xs text-gray-500">Tentatives</p>
                    </div>
                </div>
            )}

            {/* Performance Insights - Only show with sufficient real data */}
            {insights_data &&
                insights_data.items &&
                insights_data.items.length >= 2 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Trend - Only show if we have enough data for meaningful calculation */}
                        {insights_data.items.length >= 6 ? (
                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    {insights.trendDirection === "up" ? (
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                    ) : insights.trendDirection === "down" ? (
                                        <BarChart3 className="w-4 h-4 text-red-600" />
                                    ) : (
                                        <Activity className="w-4 h-4 text-gray-600" />
                                    )}
                                </div>
                                <p className="text-lg font-bold text-green-600">
                                    {insights.trend > 0 ? "+" : ""}
                                    {Math.round(insights.trend)}%
                                </p>
                                <p className="text-xs text-gray-500">
                                    Tendance
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Activity className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-lg font-bold text-gray-400">
                                    -
                                </p>
                                <p className="text-xs text-gray-400">
                                    Tendance
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Besoin de plus de données
                                </p>
                            </div>
                        )}

                        <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Zap className="w-4 h-4 text-orange-600" />
                            </div>
                            <p className="text-lg font-bold text-orange-600">
                                {insights.streak}
                            </p>
                            <p className="text-xs text-gray-500">
                                Série actuelle
                            </p>
                        </div>
                    </div>
                )}

            {/* Recent Results or Motivational Message */}
            {last_attemps && last_attemps.length > 0 ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                            Derniers résultats
                        </span>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {[...last_attemps]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 3)
                            .map((attempt, index) => (
                            <div
                                key={attempt.createdAt}
                                className="p-3 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`px-2 py-1 rounded-lg text-xs font-semibold ${getScoreColor(
                                                attempt.score
                                            )}`}
                                        >
                                            {Math.round(attempt.score)}%
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(attempt.createdAt)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        #{last_attemps.length - index}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Motivational Section */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-semibold text-blue-800">
                                {motivationalData.title}
                            </span>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            {motivationalData.message}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[150px] text-center">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 mb-2">
                            {motivationalData.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {motivationalData.message}
                        </p>
                    </div>

                    {/* Encouragement Stats
          <div className="mt-3 grid grid-cols-2 gap-2 w-full">
            <div className="p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl text-center">
              <p className="text-lg font-bold text-blue-600">1</p>
              <p className="text-xs text-gray-500">Quiz terminé</p>
            </div>
            <div className="p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl text-center">
              <p className="text-lg font-bold text-blue-600">+XP</p>
              <p className="text-xs text-gray-500">Expérience</p>
            </div>
          </div> */}
                </div>
            )}
        </div>
    );
};
