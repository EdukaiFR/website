import axios from "axios";
import { getCurrentUserId } from "@/lib/auth-utils";

export interface QuizService {
  generateQuiz: (recognizedText: string[]) => Promise<any>;
  getQuizById: (quizId: string) => Promise<any>;
}

export function useQuizService(): QuizService {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const generateQuiz = async (recognizedText: string[]) => {
    try {
      const textString = recognizedText.join("\n");
      const userId = getCurrentUserId();

      console.log("🔍 [Quiz Service] Debug - User ID from session:", userId);
      console.log("🔍 [Quiz Service] Debug - Text length:", textString.length);

      if (!userId) {
        console.error(
          "❌ [Quiz Service] User not authenticated - no userId found in session"
        );
        throw new Error("User not authenticated");
      }

      console.log("✅ [Quiz Service] Sending request with userId:", userId);

      const response = await axios.post(
        `${apiUrl}/ai/generate-quiz`,
        {
          textString,
          userId, // Include the actual user ID from session
        },
        {
          withCredentials: true,
        }
      );

      console.log(
        "✅ [Quiz Service] Quiz generated successfully for user:",
        userId
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ [Quiz Service] Erreur lors de la génération du Quiz",
        error
      );
      throw error;
    }
  };

  const getQuizById = async (quizId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/quizzes/${quizId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du Quiz ${quizId}`, error);
    }
  };

  return { generateQuiz, getQuizById };
}
