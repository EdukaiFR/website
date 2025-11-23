import axios from "axios";
import { getCurrentUserId } from "@/lib/auth-utils";

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

export interface InsightsService {
    createInsight: (quizId: string, score: number) => Promise<unknown>;
    getQuizInsights: (quizId: string) => Promise<unknown>;
    getAllMyInsights: () => Promise<unknown>;
    getAnalytics: () => Promise<AnalyticsData>;
}

export function useInsightsService() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createInsight = async (quizId: string, score: number) => {
        try {
            const userId = getCurrentUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await axios.post(
                `${apiUrl}/insights/${quizId}`,
                { score, userId },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error("[Insights Service] Error creating insight:", error);
            throw error;
        }
    };

    const getQuizInsights = async (quizId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/insights/${quizId}`, {
                withCredentials: true,
            });

            const data = response.data;

            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("[Insights Service] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }

            throw error;
        }
    };

    const getAllMyInsights = async () => {
        try {
            const userId = getCurrentUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await axios.get(`${apiUrl}/insights/my`, {
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error(
                "[Insights Service] Error fetching all user insights:",
                error
            );
            if (axios.isAxiosError(error)) {
                console.error("[Insights Service] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }

            throw error;
        }
    };

    const getAnalytics = async (): Promise<AnalyticsData> => {
        try {
            const userId = getCurrentUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await axios.get(`${apiUrl}/stats/analytics`, {
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error(
                "[Insights Service] Error fetching analytics:",
                error
            );
            if (axios.isAxiosError(error)) {
                console.error("[Insights Service] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }

            throw error;
        }
    };

    return { createInsight, getQuizInsights, getAllMyInsights, getAnalytics };
}
