import type { InsightsService, QuizService } from "@/services";
import { useState } from "react";
import testData from "../json/testData/quizResponse.json";

export const tempData = testData; // Temporary test data for the quiz

export type Quiz = {
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
}[];

type Insights = {
    averageScore: number;
    insightsCount: number;
    insights?: Array<{
        score: number;
        createdAt: string;
    }>;
};

export function useQuiz(
    quizService: QuizService,
    insightsService?: InsightsService
) {
    const [quizData, setQuizData] = useState<Quiz>([]);
    const [quizId, setQuizId] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [insightsData, setInsightsData] = useState<Insights>({
        averageScore: 0,
        insightsCount: 0,
    });

    async function generateQuiz(recognizedTexts: string[]) {
        setIsGenerating(true);
        setError(null);

        try {
            const quiz = await quizService.generateQuiz(recognizedTexts);
            const newQuizId = quiz.id;
            setQuizId(quiz._id);
            return { success: true, newQuizId };
        } catch (error) {
            console.error("Error generating quiz: ", error);
            setError("Failed to generate quiz. Please try again.");
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Erreur inconnue",
            };
        } finally {
            setIsGenerating(false);
        }
    }

    const setGeneratingState = (state: boolean) => {
        setIsGenerating(state);
    };

    const loadQuiz = async (quizId: string) => {
        try {
            const quizResponse = await quizService.getQuizById(quizId);
            setQuizData(quizResponse.item.quiz);
            return quizResponse.item;
        } catch (error) {
            console.error(`Error getting quiz ${quizId} `, error);
            setError("Failed to load quiz. Please try again.");
            return null;
        }
    };

    const getQuizInsights = async (quizId: string) => {
        try {
            console.log("🔍 [useQuiz] Getting insights for quiz:", quizId);
            const insights = (await insightsService?.getQuizInsights(
                quizId
            )) as Insights;
            console.log("✅ [useQuiz] Raw insights from API:", insights);
            console.log("✅ [useQuiz] Insights type:", typeof insights);
            console.log(
                "✅ [useQuiz] Insights structure:",
                JSON.stringify(insights, null, 2)
            );

            setInsightsData(insights);
            console.log("✅ [useQuiz] Set insights data to state");
            return insights;
        } catch (error) {
            console.error(
                `❌ [useQuiz] Error getting insights for quiz ${quizId}:`,
                error
            );
            setError("Failed to load quiz insights.");
            return null;
        }
    };

    const createInsight = async (quizId: string, score: number) => {
        try {
            if (!insightsService) {
                console.warn("Insights service not available");
                return null;
            }

            const insight = await insightsService.createInsight(quizId, score);

            // Refresh insights data after creating new insight
            await getQuizInsights(quizId);

            return insight;
        } catch (error) {
            console.error(`Error creating insight for quiz ${quizId}`, error);
            setError("Failed to save quiz result.");
            return null;
        }
    };

    return {
        quizData,
        quizId,
        insightsData,
        isGenerating,
        error,
        setGeneratingState,
        generateQuiz,
        loadQuiz,
        getQuizInsights,
        createInsight,
    };
}
