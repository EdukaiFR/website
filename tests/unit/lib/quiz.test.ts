import { describe, it, expect, vi, beforeEach } from "vitest";
import { shuffleArray, shuffleQuiz, type QuizQuestion } from "@/lib/utils/quiz";

function buildQuestion(overrides?: Partial<QuizQuestion>): QuizQuestion {
    return {
        question: "What is 2 + 2?",
        choices: ["A) 3", "B) 4", "C) 5", "D) 6"],
        answer: "B) 4",
        explanation: "Basic arithmetic",
        ...overrides,
    };
}

describe("shuffleArray", () => {
    it("returns an array with the same length", () => {
        const input = [1, 2, 3, 4, 5];
        const result = shuffleArray(input);
        expect(result).toHaveLength(input.length);
    });

    it("contains the same elements", () => {
        const input = [1, 2, 3, 4, 5];
        const result = shuffleArray(input);
        expect(result.sort()).toEqual(input.sort());
    });

    it("does not mutate the original array", () => {
        const input = [1, 2, 3, 4, 5];
        const copy = [...input];
        shuffleArray(input);
        expect(input).toEqual(copy);
    });

    it("returns empty array for empty input", () => {
        expect(shuffleArray([])).toEqual([]);
    });

    it("returns single element for single-element array", () => {
        expect(shuffleArray([42])).toEqual([42]);
    });
});

describe("shuffleQuiz", () => {
    it("preserves the correct answer text after shuffling choices", () => {
        const question = buildQuestion({
            choices: ["A) Paris", "B) London", "C) Berlin", "D) Madrid"],
            answer: "A) Paris",
        });

        // Run multiple times to account for randomness
        for (let i = 0; i < 20; i++) {
            const [shuffled] = shuffleQuiz([question]);

            // The answer should reference the correct text
            expect(shuffled.answer).toContain("Paris");

            // The answer letter should match the choice that contains "Paris"
            const answerLetter = shuffled.answer.charAt(0);
            const matchingChoice = shuffled.choices.find(c =>
                c.includes("Paris")
            );
            expect(matchingChoice).toBeDefined();
            expect(matchingChoice!.charAt(0)).toBe(answerLetter);
        }
    });

    it("preserves all choice texts", () => {
        const question = buildQuestion({
            choices: ["A) Paris", "B) London", "C) Berlin", "D) Madrid"],
            answer: "A) Paris",
        });

        const [shuffled] = shuffleQuiz([question]);
        const texts = shuffled.choices.map(c => c.substring(3));
        expect(texts.sort()).toEqual(
            ["Berlin", "London", "Madrid", "Paris"]
        );
    });

    it("assigns correct A/B/C/D letters to shuffled choices", () => {
        const question = buildQuestion();
        const [shuffled] = shuffleQuiz([question]);

        shuffled.choices.forEach((choice, i) => {
            const expectedLetter = ["A", "B", "C", "D"][i];
            expect(choice).toMatch(new RegExp(`^${expectedLetter}\\) `));
        });
    });

    it("returns the same number of questions", () => {
        const questions = [buildQuestion(), buildQuestion(), buildQuestion()];
        const result = shuffleQuiz(questions);
        expect(result).toHaveLength(3);
    });

    it("does not mutate original questions", () => {
        const question = buildQuestion({
            choices: ["A) Paris", "B) London", "C) Berlin", "D) Madrid"],
            answer: "A) Paris",
        });
        const originalAnswer = question.answer;
        const originalChoices = [...question.choices];

        shuffleQuiz([question]);

        expect(question.answer).toBe(originalAnswer);
        expect(question.choices).toEqual(originalChoices);
    });

    it("handles empty quiz", () => {
        expect(shuffleQuiz([])).toEqual([]);
    });
});
