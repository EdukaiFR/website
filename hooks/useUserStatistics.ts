import { useMemo } from "react";
import type { InsightItem, UserStatistics } from "@/lib/types/insights";

type TimePeriod = "7days" | "30days" | "year" | "lifetime";

/**
 * Calculate user statistics from insights data
 * @param insights - Array of insight items
 * @param period - Optional time period filter
 * @returns Calculated statistics
 */
export const useUserStatistics = (
    insights: InsightItem[],
    period?: TimePeriod
): UserStatistics => {
    return useMemo(() => {
        // Filter insights by period
        const filteredInsights = period
            ? filterInsightsByPeriod(insights, period)
            : insights;

        if (filteredInsights.length === 0) {
            return getEmptyStatistics();
        }

        const scores = filteredInsights.map(i => i.score);
        const totalQuizzes = filteredInsights.length;

        // Basic stats
        const averageScore = Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
        );
        const bestScore = Math.round(Math.max(...scores));
        const worstScore = Math.round(Math.min(...scores));

        // Score distribution
        const excellent = scores.filter(s => s >= 90).length;
        const good = scores.filter(s => s >= 70 && s < 90).length;
        const average = scores.filter(s => s >= 50 && s < 70).length;
        const poor = scores.filter(s => s < 50).length;

        // Improvement trend
        const trend = calculateTrend(scores);

        // Recent performance (last 10)
        const recentPerformance = filteredInsights
            .slice(-10)
            .map((insight, index) => ({
                attempt: totalQuizzes - 9 + index,
                score: insight.score,
                date: insight.createdAt,
            }));

        // Streak data
        const streakData = calculateStreaks(filteredInsights);

        // Weekly activity
        const weeklyActivity = calculateWeeklyActivity(filteredInsights);

        return {
            totalQuizzes,
            averageScore,
            bestScore,
            worstScore,
            excellent,
            good,
            average,
            poor,
            trend,
            recentPerformance,
            scoreDistribution: {
                excellent,
                good,
                average,
                needsWork: poor,
            },
            streakData,
            weeklyActivity,
        };
    }, [insights, period]);
};

/**
 * Filter insights by time period
 */
const filterInsightsByPeriod = (
    insights: InsightItem[],
    period: TimePeriod
): InsightItem[] => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return insights.filter(insight => {
        if (!insight?.createdAt) return false;

        const insightDate = new Date(insight.createdAt);

        switch (period) {
            case "7days": {
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 7);
                return insightDate >= sevenDaysAgo;
            }

            case "30days": {
                const thirtyDaysAgo = new Date(now);
                thirtyDaysAgo.setDate(now.getDate() - 30);
                return insightDate >= thirtyDaysAgo;
            }

            case "year":
                return insightDate.getFullYear() === currentYear;

            case "lifetime":
            default:
                return true;
        }
    });
};

/**
 * Calculate improvement trend
 */
const calculateTrend = (scores: number[]): "up" | "down" | "stable" => {
    if (scores.length < 4) return "stable";

    const midPoint = Math.floor(scores.length / 2);
    const firstHalfAvg =
        scores.slice(0, midPoint).reduce((a, b) => a + b, 0) / midPoint;
    const secondHalfAvg =
        scores.slice(midPoint).reduce((a, b) => a + b, 0) /
        (scores.length - midPoint);

    if (secondHalfAvg > firstHalfAvg + 5) return "up";
    if (secondHalfAvg < firstHalfAvg - 5) return "down";
    return "stable";
};

/**
 * Calculate current and best streaks
 */
const calculateStreaks = (
    insights: InsightItem[]
): { current: number; best: number } => {
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (starting from most recent)
    for (let i = insights.length - 1; i >= 0; i--) {
        if (insights[i].score >= 70) {
            currentStreak++;
        } else {
            break;
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

    return { current: currentStreak, best: bestStreak };
};

/**
 * Calculate weekly activity (last 7 days)
 */
const calculateWeeklyActivity = (insights: InsightItem[]): number[] => {
    const weeklyActivity = Array(7).fill(0);
    const today = new Date();

    insights.forEach(insight => {
        const insightDate = new Date(insight.createdAt);
        const daysDiff = Math.floor(
            (today.getTime() - insightDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff < 7) {
            weeklyActivity[6 - daysDiff]++;
        }
    });

    return weeklyActivity;
};

/**
 * Get empty statistics object
 */
const getEmptyStatistics = (): UserStatistics => ({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
    trend: "stable",
    recentPerformance: [],
    scoreDistribution: {
        excellent: 0,
        good: 0,
        average: 0,
        needsWork: 0,
    },
    streakData: { current: 0, best: 0 },
    weeklyActivity: Array(7).fill(0),
});
