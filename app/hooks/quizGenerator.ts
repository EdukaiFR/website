import type { QuizService } from "@/services";
import { useState } from "react";
import testData from "../json/testData/quizResponse.json";

export const tempData = testData; // Temporary test data for the quiz

export function useQuizGenerator(quizService: QuizService) {
  const [quizData, setQuizData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateQuiz(recognizedTexts: string[]) {
    setIsGenerating(true);
    setError(null);

    try {
      // const quiz = await quizService.generateQuiz(recognizedTexts);
      // setQuizData(quiz);
      setQuizData(testData);
      return true;
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

  return { quizData, isGenerating, error, setGeneratingState, generateQuiz };
}
