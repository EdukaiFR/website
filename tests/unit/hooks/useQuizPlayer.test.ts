import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuizPlayer } from "@/hooks/useQuizPlayer";
import type { QuizQuestion } from "@/lib/utils/quiz";

// Mock shuffleQuiz to return deterministic order in tests
vi.mock("@/lib/utils/quiz", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/utils/quiz")>();
    return {
        ...actual,
        shuffleQuiz: (questions: QuizQuestion[]) => [...questions],
    };
});

vi.mock("@/lib/toast", () => ({
    insightsToast: {
        createSuccess: vi.fn(),
        createError: vi.fn(),
    },
    quizToast: {
        generateError: vi.fn(),
        loadError: vi.fn(),
        restartError: vi.fn(),
    },
}));

vi.mock("@/lib/constants/mascot", () => ({
    MASCOT_IDLE: "/mascot-idle.gif",
    MASCOT_SUCCESS: "/mascot-success.gif",
    MASCOT_WRONG: "/mascot-wrong.gif",
}));

function buildQuizData(): QuizQuestion[] {
    return [
        {
            question: "What is 2+2?",
            choices: ["A) 3", "B) 4", "C) 5", "D) 6"],
            answer: "B) 4",
            explanation: "Basic math",
        },
        {
            question: "Capital of France?",
            choices: ["A) Paris", "B) London", "C) Berlin", "D) Madrid"],
            answer: "A) Paris",
            explanation: "Geography",
        },
        {
            question: "Largest planet?",
            choices: ["A) Mars", "B) Venus", "C) Jupiter", "D) Saturn"],
            answer: "C) Jupiter",
            explanation: "Astronomy",
        },
    ];
}

describe("useQuizPlayer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("initialization", () => {
        it("starts at question 1", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );
            expect(result.current.questionIndex).toBe(1);
            expect(result.current.currentQuestion.question).toBe(
                "What is 2+2?"
            );
        });

        it("starts with score 0", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );
            expect(result.current.score).toBe(0);
            expect(result.current.isFinish).toBe(false);
            expect(result.current.isAnswer).toBe(false);
        });

        it("computes total questions", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );
            expect(result.current.totalQuestions).toBe(3);
        });

        it("starts with 0% progress", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );
            expect(result.current.progressPercent).toBe(0);
        });

        it("shows idle mascot initially", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );
            expect(result.current.mascotSrc).toBe("/mascot-idle.gif");
        });
    });

    describe("answer submission", () => {
        it("increments score for correct answer", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            act(() => {
                result.current.setSelectedAnswer("B) 4");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });

            expect(result.current.score).toBe(1);
            expect(result.current.isAnswer).toBe(true);
            expect(result.current.userIsCorrect).toBe(true);
        });

        it("does not increment score for wrong answer", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            act(() => {
                result.current.setSelectedAnswer("A) 3");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });

            expect(result.current.score).toBe(0);
            expect(result.current.isAnswer).toBe(true);
            expect(result.current.userIsCorrect).toBe(false);
        });

        it("shows success mascot for correct answer", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            act(() => {
                result.current.setSelectedAnswer("B) 4");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });

            expect(result.current.mascotSrc).toBe("/mascot-success.gif");
        });

        it("shows wrong mascot for incorrect answer", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            act(() => {
                result.current.setSelectedAnswer("A) 3");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });

            expect(result.current.mascotSrc).toBe("/mascot-wrong.gif");
        });
    });

    describe("navigation", () => {
        it("moves to next question", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            act(() => {
                result.current.setSelectedAnswer("B) 4");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });
            act(() => {
                result.current.handleNextQuestion();
            });

            expect(result.current.questionIndex).toBe(2);
            expect(result.current.currentQuestion.question).toBe(
                "Capital of France?"
            );
            expect(result.current.isAnswer).toBe(false);
            expect(result.current.selectedAnswer).toBe("");
        });

        it("updates progress after moving to next question", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            act(() => {
                result.current.setSelectedAnswer("B) 4");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });
            act(() => {
                result.current.handleNextQuestion();
            });

            // 1 answered out of 3 = ~33.33%
            expect(result.current.progressPercent).toBeCloseTo(33.33, 0);
        });

        it("finishes quiz after last question", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            // Answer all 3 questions
            for (let i = 0; i < 3; i++) {
                act(() => {
                    result.current.setSelectedAnswer("A) something");
                });
                act(() => {
                    result.current.handleSubmitQuestion();
                });
                act(() => {
                    result.current.handleNextQuestion();
                });
            }

            expect(result.current.isFinish).toBe(true);
        });
    });

    describe("restart", () => {
        it("resets all state", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: buildQuizData() })
            );

            // Play through some questions
            act(() => {
                result.current.setSelectedAnswer("B) 4");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });
            act(() => {
                result.current.handleNextQuestion();
            });

            act(() => {
                result.current.restartQuiz();
            });

            expect(result.current.questionIndex).toBe(1);
            expect(result.current.score).toBe(0);
            expect(result.current.isFinish).toBe(false);
            expect(result.current.isAnswer).toBe(false);
            expect(result.current.selectedAnswer).toBe("");
            expect(result.current.answeredQuestionsCount).toBe(0);
            expect(result.current.progressPercent).toBe(0);
        });
    });

    describe("insight creation", () => {
        it("creates insight when quiz finishes with quizId and service", async () => {
            const mockInsightsService = {
                createInsight: vi.fn().mockResolvedValue({}),
                getInsightsByQuizId: vi.fn(),
            };

            const { result } = renderHook(() =>
                useQuizPlayer({
                    quizData: buildQuizData(),
                    quizId: "quiz-123",
                    insightsService: mockInsightsService,
                })
            );

            // Answer all questions correctly
            for (let i = 0; i < 3; i++) {
                const correctAnswer =
                    result.current.currentQuestion?.answer ?? "";
                act(() => {
                    result.current.setSelectedAnswer(correctAnswer);
                });
                act(() => {
                    result.current.handleSubmitQuestion();
                });
                act(() => {
                    result.current.handleNextQuestion();
                });
            }

            // Wait for the async insight creation
            await vi.waitFor(() => {
                expect(mockInsightsService.createInsight).toHaveBeenCalledWith(
                    "quiz-123",
                    expect.any(Number)
                );
            });
        });

        it("does not create insight when quizId is missing", () => {
            const mockInsightsService = {
                createInsight: vi.fn().mockResolvedValue({}),
                getInsightsByQuizId: vi.fn(),
            };

            const { result } = renderHook(() =>
                useQuizPlayer({
                    quizData: buildQuizData(),
                    insightsService: mockInsightsService,
                })
            );

            // Finish quiz
            for (let i = 0; i < 3; i++) {
                act(() => {
                    result.current.setSelectedAnswer("A) something");
                });
                act(() => {
                    result.current.handleSubmitQuestion();
                });
                act(() => {
                    result.current.handleNextQuestion();
                });
            }

            expect(mockInsightsService.createInsight).not.toHaveBeenCalled();
        });
    });

    describe("edge cases", () => {
        it("handles empty quiz data", () => {
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: [] })
            );
            expect(result.current.totalQuestions).toBe(0);
            expect(result.current.progressPercent).toBe(0);
            expect(result.current.currentQuestion).toBeUndefined();
        });

        it("handles single-question quiz", () => {
            const singleQuestion = [buildQuizData()[0]];
            const { result } = renderHook(() =>
                useQuizPlayer({ quizData: singleQuestion })
            );

            act(() => {
                result.current.setSelectedAnswer("B) 4");
            });
            act(() => {
                result.current.handleSubmitQuestion();
            });
            act(() => {
                result.current.handleNextQuestion();
            });

            expect(result.current.isFinish).toBe(true);
            expect(result.current.score).toBe(1);
        });
    });
});
