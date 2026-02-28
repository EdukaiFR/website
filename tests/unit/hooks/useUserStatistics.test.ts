import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import type { InsightItem } from "@/lib/types/insights";

function buildInsight(overrides?: Partial<InsightItem>): InsightItem {
    return {
        _id: "insight-1",
        score: 80,
        createdAt: new Date().toISOString(),
        author: "author-1",
        quizId: "quiz-1",
        userId: "user-1",
        ...overrides,
    };
}

function buildInsights(scores: number[], dates?: string[]): InsightItem[] {
    return scores.map((score, i) =>
        buildInsight({
            _id: `insight-${i}`,
            score,
            createdAt: dates?.[i] ?? new Date().toISOString(),
        })
    );
}

describe("useUserStatistics", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-02-20T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("empty insights", () => {
        it("returns empty statistics for empty array", () => {
            const { result } = renderHook(() => useUserStatistics([]));
            const stats = result.current;

            expect(stats.totalQuizzes).toBe(0);
            expect(stats.averageScore).toBe(0);
            expect(stats.bestScore).toBe(0);
            expect(stats.worstScore).toBe(0);
            expect(stats.trend).toBe("stable");
            expect(stats.recentPerformance).toEqual([]);
            expect(stats.streakData).toEqual({ current: 0, best: 0 });
            expect(stats.weeklyActivity).toEqual([0, 0, 0, 0, 0, 0, 0]);
        });
    });

    describe("basic statistics", () => {
        it("computes average score correctly", () => {
            const insights = buildInsights([60, 80, 100]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.averageScore).toBe(80);
        });

        it("rounds average score", () => {
            const insights = buildInsights([33, 67]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.averageScore).toBe(50);
        });

        it("finds best and worst scores", () => {
            const insights = buildInsights([40, 60, 95, 20]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.bestScore).toBe(95);
            expect(result.current.worstScore).toBe(20);
        });

        it("counts total quizzes", () => {
            const insights = buildInsights([50, 60, 70, 80, 90]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.totalQuizzes).toBe(5);
        });
    });

    describe("score distribution", () => {
        it("categorizes scores correctly", () => {
            // excellent >= 90, good >= 70, average >= 50, poor < 50
            const insights = buildInsights([95, 92, 75, 80, 55, 60, 30, 40]);
            const { result } = renderHook(() => useUserStatistics(insights));

            expect(result.current.excellent).toBe(2);
            expect(result.current.good).toBe(2);
            expect(result.current.average).toBe(2);
            expect(result.current.poor).toBe(2);
        });

        it("handles score at exact thresholds", () => {
            const insights = buildInsights([90, 70, 50, 49]);
            const { result } = renderHook(() => useUserStatistics(insights));

            expect(result.current.excellent).toBe(1); // 90
            expect(result.current.good).toBe(1); // 70
            expect(result.current.average).toBe(1); // 50
            expect(result.current.poor).toBe(1); // 49
        });
    });

    describe("trend calculation", () => {
        it("returns stable for fewer than 4 scores", () => {
            const insights = buildInsights([50, 60, 70]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.trend).toBe("stable");
        });

        it("detects upward trend when second half > first half + 5", () => {
            const insights = buildInsights([30, 30, 80, 80]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.trend).toBe("up");
        });

        it("detects downward trend when second half < first half - 5", () => {
            const insights = buildInsights([80, 80, 30, 30]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.trend).toBe("down");
        });

        it("returns stable when difference is within 5 points", () => {
            const insights = buildInsights([50, 50, 53, 53]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.trend).toBe("stable");
        });
    });

    describe("streak calculation", () => {
        it("calculates current streak from the end", () => {
            // >= 70 is a "good" score for streak
            const insights = buildInsights([40, 80, 75, 90]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.streakData.current).toBe(3);
        });

        it("breaks current streak at first failure from end", () => {
            const insights = buildInsights([80, 90, 40, 80]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.streakData.current).toBe(1);
        });

        it("calculates best streak across all insights", () => {
            const insights = buildInsights([80, 90, 95, 40, 70, 80]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.streakData.best).toBe(3);
        });

        it("returns 0 streak when all scores are below threshold", () => {
            const insights = buildInsights([30, 40, 50, 60]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.streakData.current).toBe(0);
            expect(result.current.streakData.best).toBe(0);
        });

        it("handles score exactly at threshold (70)", () => {
            const insights = buildInsights([70]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.streakData.current).toBe(1);
            expect(result.current.streakData.best).toBe(1);
        });
    });

    describe("weekly activity", () => {
        it("counts activity for each day of the last 7 days", () => {
            const now = new Date("2026-02-20T12:00:00Z");
            const insights = [
                buildInsight({
                    _id: "1",
                    createdAt: new Date("2026-02-20T10:00:00Z").toISOString(),
                }), // today
                buildInsight({
                    _id: "2",
                    createdAt: new Date("2026-02-20T08:00:00Z").toISOString(),
                }), // today
                buildInsight({
                    _id: "3",
                    createdAt: new Date("2026-02-19T10:00:00Z").toISOString(),
                }), // yesterday
            ];

            const { result } = renderHook(() => useUserStatistics(insights));
            const activity = result.current.weeklyActivity;
            expect(activity).toHaveLength(7);
            // Index 6 = today, index 5 = yesterday
            expect(activity[6]).toBe(2);
            expect(activity[5]).toBe(1);
        });

        it("ignores insights older than 7 days", () => {
            const insights = [
                buildInsight({
                    _id: "1",
                    createdAt: new Date("2026-02-10T10:00:00Z").toISOString(),
                }),
            ];

            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.weeklyActivity).toEqual([
                0, 0, 0, 0, 0, 0, 0,
            ]);
        });
    });

    describe("period filtering", () => {
        it("filters to last 7 days", () => {
            const insights = [
                buildInsight({
                    _id: "1",
                    score: 90,
                    createdAt: new Date("2026-02-19T10:00:00Z").toISOString(),
                }),
                buildInsight({
                    _id: "2",
                    score: 50,
                    createdAt: new Date("2026-01-01T10:00:00Z").toISOString(),
                }),
            ];

            const { result } = renderHook(() =>
                useUserStatistics(insights, "7days")
            );
            expect(result.current.totalQuizzes).toBe(1);
            expect(result.current.averageScore).toBe(90);
        });

        it("filters to current year", () => {
            const insights = [
                buildInsight({
                    _id: "1",
                    score: 80,
                    createdAt: new Date("2026-01-15T10:00:00Z").toISOString(),
                }),
                buildInsight({
                    _id: "2",
                    score: 40,
                    createdAt: new Date("2025-12-31T10:00:00Z").toISOString(),
                }),
            ];

            const { result } = renderHook(() =>
                useUserStatistics(insights, "year")
            );
            expect(result.current.totalQuizzes).toBe(1);
            expect(result.current.averageScore).toBe(80);
        });

        it("returns all insights for lifetime", () => {
            const insights = buildInsights([60, 80]);
            const { result } = renderHook(() =>
                useUserStatistics(insights, "lifetime")
            );
            expect(result.current.totalQuizzes).toBe(2);
        });
    });

    describe("recent performance", () => {
        it("returns up to 10 most recent entries", () => {
            const scores = Array.from({ length: 15 }, (_, i) => 50 + i);
            const insights = buildInsights(scores);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.recentPerformance).toHaveLength(10);
        });

        it("returns all entries when fewer than 10", () => {
            const insights = buildInsights([80, 90]);
            const { result } = renderHook(() => useUserStatistics(insights));
            expect(result.current.recentPerformance).toHaveLength(2);
        });
    });
});
