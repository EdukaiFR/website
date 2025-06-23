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

            const response = await axios.post(
                `${apiUrl}/ai/generate-quiz`,
                { textString },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error("Error generating quiz", error);
        }
    };

    const getQuizById = async (quizId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/quizzes/${quizId}`, {
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching quiz", error);
        }
    };

    return { generateQuiz, getQuizById };
}
