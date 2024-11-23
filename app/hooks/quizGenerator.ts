import { useState } from 'react';
import { QuizService } from '@/services';

export function useQuizGenerator(quizService: QuizService) {
  const [quizData, setQuizData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateQuiz(recognizedTexts: string[]) {
    setIsGenerating(true);
    setError(null);

    try {
      const quiz = await quizService.generateQuiz(recognizedTexts);
      setQuizData(quiz);
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