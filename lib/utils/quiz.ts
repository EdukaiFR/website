import { CHOICE_LETTERS } from "@/lib/constants/quiz";

export type QuizQuestion = {
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
};

export function shuffleArray<T>(array: readonly T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function shuffleQuiz(questions: QuizQuestion[]): QuizQuestion[] {
    const shuffledQuestions = shuffleArray(questions);

    return shuffledQuestions.map((q) => {
        const correctText = q.answer.substring(3);
        const choiceTexts = q.choices.map((c) => c.substring(3));
        const shuffledTexts = shuffleArray(choiceTexts);

        const newChoices = shuffledTexts.map(
            (text, i) => `${CHOICE_LETTERS[i]}) ${text}`
        );
        const correctIndex = shuffledTexts.indexOf(correctText);
        const newAnswer = `${CHOICE_LETTERS[correctIndex]}) ${correctText}`;

        return { ...q, choices: newChoices, answer: newAnswer };
    });
}
