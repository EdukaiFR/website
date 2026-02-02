export interface InsightItem {
    _id: string;
    score: number;
    createdAt: string;
    author: string;
    quizId: string;
    userId: string;
}

export interface InsightsResponse {
    items: InsightItem[];
}

export interface AnalyticsCourse {
    courseId: string;
    title: string;
    subject: string;
    avgScore: number;
    quizCount: number;
}

export interface AnalyticsData {
    status: string;
    message: string;
    insights: Array<{
        score: number;
        createdAt: string;
    }>;
    bestCourse: AnalyticsCourse | null;
    worstCourse: AnalyticsCourse | null;
}

export interface UserStatistics {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    excellent: number;
    good: number;
    average: number;
    poor: number;
    trend: "up" | "down" | "stable";
    recentPerformance: Array<{
        attempt: number;
        score: number;
        date: string;
    }>;
    scoreDistribution: {
        excellent: number;
        good: number;
        average: number;
        needsWork: number;
    };
    streakData: {
        current: number;
        best: number;
    };
    weeklyActivity: number[];
}
