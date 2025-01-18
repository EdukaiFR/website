import type { InsightsService, QuizService } from "@/services";
import { useState } from "react";
import testData from "../json/testData/quizResponse.json";

export const tempData = testData; // Temporary test data for the quiz

type Quiz = {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}[];

type Insights = {
  averageScore: number;
  insightsCount: number;
};

export function useQuiz(quizService: QuizService, insightsService?: InsightsService) {
  const [quizData, setQuizData] = useState<Quiz>([]);
  const [quizId, setQuizId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insightsData, setInsightsData] = useState<Insights>({
    averageScore: 0, insightsCount: 0
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
  }

  const getQuizInsights = async (quizId: string) => {
    try {
      const insights = await insightsService?.getQuizInsights(quizId);
      setInsightsData(insights);
    } catch (error) {
      console.error(`Error getting quiz ${quizId} `, error);
      setError("Failed to load quiz. Please try again.");
      return null;
    }
  }

  return { quizData, quizId, insightsData, isGenerating, error, setGeneratingState,
    generateQuiz, loadQuiz, getQuizInsights };
}
