import axios from "axios";
import { getCurrentUserId } from "@/lib/auth-utils";

export interface InsightsService {
  createInsight: (quizId: string, score: number) => Promise<any>;
  getQuizInsights: (quizId: string) => Promise<any>;
}

export function useInsightsService() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const createInsight = async (quizId: string, score: number) => {
    try {
      const userId = getCurrentUserId();

      console.log(
        "🔍 [Insights Service] Debug - User ID from session:",
        userId
      );
      console.log(
        "🔍 [Insights Service] Debug - Quiz ID:",
        quizId,
        "Score:",
        score
      );

      if (!userId) {
        console.error(
          "❌ [Insights Service] User not authenticated - no userId found in session"
        );
        throw new Error("User not authenticated");
      }

      console.log("✅ [Insights Service] Creating insight for user:", userId);

      const response = await axios.post(
        `${apiUrl}/insights/${quizId}`,
        { score, userId },
        { withCredentials: true }
      );

      console.log(
        "✅ [Insights Service] Insight created successfully for user:",
        userId
      );
      return response.data;
    } catch (error) {
      console.error("❌ [Insights Service] Error creating insight:", error);
      throw error;
    }
  };

  const getQuizInsights = async (quizId: string) => {
    try {
      console.log("🔍 [Insights Service] Fetching insights for quiz:", quizId);

      const response = await axios.get(`${apiUrl}/insights/${quizId}`, {
        withCredentials: true,
      });

      console.log("✅ [Insights Service] Raw response:", response);
      console.log("✅ [Insights Service] Response data:", response.data);
      console.log("✅ [Insights Service] Response status:", response.status);

      const data = response.data;
      console.log(
        "✅ [Insights Service] Processed data structure:",
        JSON.stringify(data, null, 2)
      );

      return data;
    } catch (error) {
      console.error("❌ [Insights Service] Error fetching insights:", error);

      if (axios.isAxiosError(error)) {
        console.error("❌ [Insights Service] Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }

      throw error;
    }
  };

  return { createInsight, getQuizInsights };
}
