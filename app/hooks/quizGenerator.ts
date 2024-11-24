import { QuizService } from "@/services";
import { useState } from "react";

// Temp value of quizData to remove when QuizService is implemented
export const tempData = {
  success: true,
  message: [
    {
      question:
        "Quelle est la caractéristique des propositions indépendantes selon le contenu donné ?",
      choices: [
        "A. Elles sont reliées par une ponctuation forte",
        "B. Elles sont autonomes et ont un seul verbe conjugué",
        "C. Elles ont plusieurs verbes conjugués",
        "D. Elles dépendent d'une autre proposition",
      ],
      answer: "B. Elles sont autonomes et ont un seul verbe conjugué",
      explanation:
        "Les propositions indépendantes sont autonomes et contiennent un seul verbe conjugué.",
    },
    {
      question:
        "Comment sont souvent séparées les propositions indépendantes selon le contenu donné ?",
      choices: [
        "A. Par des conjonctions de coordination",
        "B. Par des conjonctions de subordination",
        "C. Par une ponctuation forte",
        "D. Par une ponctuation faible",
      ],
      answer: "D. Par une ponctuation faible",
      explanation:
        "Les propositions indépendantes sont souvent séparées par une ponctuation faible comme une virgule ou un point-virgule.",
    },
  ],
};

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
