import axios from "axios";
import { getCurrentUserId } from "@/lib/auth-utils";
import type {
    InsightsResponse,
    AnalyticsData,
    InsightItem,
} from "@/lib/types/insights";

export type { AnalyticsData } from "@/lib/types/insights";

interface CreateInsightResponse {
    success: boolean;
    insight: InsightItem;
}

export interface InsightsService {
    createInsight: (
        quizId: string,
        score: number,
        signal?: AbortSignal
    ) => Promise<CreateInsightResponse>;
    getQuizInsights: (
        quizId: string,
        signal?: AbortSignal
    ) => Promise<InsightsResponse>;
    getAllMyInsights: (signal?: AbortSignal) => Promise<InsightItem[]>;
    getAnalytics: (signal?: AbortSignal) => Promise<AnalyticsData>;
}

export function useInsightsService() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createInsight = async (
        quizId: string,
        score: number,
        signal?: AbortSignal
    ): Promise<CreateInsightResponse> => {
        const userId = getCurrentUserId();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const response = await axios.post<CreateInsightResponse>(
            `${apiUrl}/insights/${quizId}`,
            { score, userId },
            { withCredentials: true, signal }
        );

        return response.data;
    };

    const getQuizInsights = async (
        quizId: string,
        signal?: AbortSignal
    ): Promise<InsightsResponse> => {
        const response = await axios.get<InsightsResponse>(
            `${apiUrl}/insights/${quizId}`,
            {
                withCredentials: true,
                signal,
            }
        );

        return response.data;
    };

    const getAllMyInsights = async (
        signal?: AbortSignal
    ): Promise<InsightItem[]> => {
        const userId = getCurrentUserId();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const response = await axios.get<InsightItem[]>(`${apiUrl}/insights`, {
            withCredentials: true,
            signal,
        });

        return response.data;
    };

    const getAnalytics = async (
        signal?: AbortSignal
    ): Promise<AnalyticsData> => {
        const userId = getCurrentUserId();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const response = await axios.get<AnalyticsData>(
            `${apiUrl}/stats/analytics`,
            {
                withCredentials: true,
                signal,
            }
        );

        return response.data;
    };

    return { createInsight, getQuizInsights, getAllMyInsights, getAnalytics };
}
