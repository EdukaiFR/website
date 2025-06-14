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
        { score, userId }, // Include the actual user ID from session
        { withCredentials: true }
      );

      console.log(
        "✅ [Insights Service] Insight created successfully for user:",
        userId
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ [Insights Service] Erreur lors de la création de l'insight",
        error
      );
      throw error;
    }
  };

  const getQuizInsights = async (quizId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/insights/${quizId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des insights`, error);
    }
  };

  return { createInsight, getQuizInsights };
}
