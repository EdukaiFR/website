import axios from "axios";

export interface InsightsService {
  createInsight: (quizId: string, score: number) => Promise<any>;
  getQuizInsights: (quizId: string) => Promise<any>;
}

export function useInsightsService() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const createInsight = async (quizId: string, score: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/insights/${quizId}`,
        { score },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'insight", error);
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
