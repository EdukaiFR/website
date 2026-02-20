import type { QuizQuestion } from "@/lib/utils/quiz";

let questionCounter = 0;

export function buildQuizQuestion(
    overrides?: Partial<QuizQuestion>
): QuizQuestion {
    questionCounter++;
    return {
        question: `Question ${questionCounter}?`,
        choices: [
            `A) Answer A${questionCounter}`,
            `B) Answer B${questionCounter}`,
            `C) Answer C${questionCounter}`,
            `D) Answer D${questionCounter}`,
        ],
        answer: `A) Answer A${questionCounter}`,
        explanation: `Explanation for question ${questionCounter}`,
        ...overrides,
    };
}

export function buildQuiz(count: number = 5): QuizQuestion[] {
    return Array.from({ length: count }, () => buildQuizQuestion());
}
