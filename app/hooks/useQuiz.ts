import type { QuizService } from "@/services";
import { useState } from "react";
import testData from "../json/testData/quizResponse.json";

export const tempData = testData; // Temporary test data for the quiz

export function useQuiz(quizService: QuizService) {
  const [quizData, setQuizData] = useState({});
  const [quizId, setQuizId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error(`Error getting quiz ${quizId} `, error);
      setError("Failed to load quiz. Please try again.");
      return null;
    }
  }

  return { quizData, quizId, isGenerating, error, setGeneratingState,
    generateQuiz, loadQuiz };
}
