import { getPercentage } from "@/lib/utils";
import { rankings } from "@/public/mocks/default-value";
import { useState, useEffect } from "react";
import { Ranking } from "../overview/Card/Ranking";
import { EndQuizCard } from "./EndQuizCard";
import { LastQuiz } from "./LastQuiz";
import { PossibleAnswers } from "./PossibleAnswers";
import { quizToast, insightsToast } from "@/lib/toast";
import type { InsightsService } from "@/services";

export type QuizProps = {
    course_id: string;
    quiz_data: unknown[];
    quiz_id?: string;
    insights_service?: InsightsService;
    insights_data?: {
        averageScore: number;
        insightsCount: number;
        insights?: Array<{
            score: number;
            createdAt: string;
        }>;
    };
};

type QuizQuestion = {
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
};

export const Quiz = ({
    quiz_data,
    quiz_id,
    insights_service,
    insights_data,
}: QuizProps) => {
    const typedQuizData = quiz_data as QuizQuestion[];
    const [questionIndex, setQuestionIndex] = useState<number>(1);
    const [answeredQuestionsCount, setAnsweredQuestionsCount] =
        useState<number>(0);

    const [answer, setAnswer] = useState<string>(
        typedQuizData[questionIndex - 1]?.answer || ""
    );
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [isAnswer, setIsAnswer] = useState<boolean>(false);

    const [score, setScore] = useState<number>(0);

    const [processingSubmit, setProcessingSubmit] = useState<boolean>(false);
    const [isFinish, setIsFinish] = useState<boolean>(false);

    // Create insight when quiz is finished
    useEffect(() => {
        const createQuizInsight = async () => {
            if (isFinish && quiz_id && insights_service) {
                try {
                    const finalScore = getPercentage(
                        score,
                        typedQuizData.length
                    );
                    await insights_service.createInsight(quiz_id, finalScore);
                    console.log("✅ Quiz insight created successfully");
                    insightsToast.createSuccess();

                    // Force refresh insights data after creating new insight
                    console.log(
                        "🔄 [Quiz] Refreshing insights after quiz completion"
                    );
                    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure backend is updated
                } catch (error) {
                    console.error("❌ Failed to create quiz insight:", error);
                    insightsToast.createError();
                }
            }
        };

        createQuizInsight();
    }, [isFinish, quiz_id, score, typedQuizData.length, insights_service]);

    const handleSubmitQuestion = () => {
        try {
            setProcessingSubmit(true);

            // Extract just the letter from both selected answer and correct answer
            const selectedLetter = selectedAnswer.charAt(0);
            const correctLetter = answer.charAt(0);

            const isCorrectAnswer = selectedLetter === correctLetter;

            if (isCorrectAnswer) {
                setScore(score + 1);
            }
            setIsAnswer(true);
        } catch (error: unknown) {
            console.error("Oups.. Une erreur est survenue:", error);
            quizToast.generateError();
        } finally {
            setProcessingSubmit(false);
        }
    };

    const handleNextQuestion = () => {
        try {
            setProcessingSubmit(true);

            // Increment answered questions count when moving to next question
            setAnsweredQuestionsCount(answeredQuestionsCount + 1);

            if (questionIndex >= typedQuizData.length) {
                // end game
                setIsFinish(true);
                return;
            }
            setAnswer(typedQuizData[questionIndex]?.answer || "");
            setSelectedAnswer("");
            setIsAnswer(false);
            setQuestionIndex(questionIndex + 1);
        } catch (error: unknown) {
            console.error("Oups.. Une erreur est survenue:", error);
            quizToast.loadError();
        } finally {
            setProcessingSubmit(false);
        }
    };

    const restartQuiz = () => {
        try {
            setProcessingSubmit(true);
            setQuestionIndex(1);
            setAnsweredQuestionsCount(0);
            setAnswer(typedQuizData[0]?.answer || "");
            setSelectedAnswer("");
            setIsAnswer(false);
            setScore(0);
            setIsFinish(false);
        } catch (error: unknown) {
            console.error("Oups.. Une erreur est survenue:", error);
            quizToast.restartError();
        } finally {
            setProcessingSubmit(false);
        }
    };

    if (!typedQuizData || typedQuizData.length === 0) {
        return (
            <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full">
                <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-muted-foreground">
                            Aucune question disponible pour ce quiz.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            {isFinish ? (
                <div className="w-full flex flex-col items-start h-full gap-4">
                    {/* Results Section */}
                    <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
                        <div className="flex-1">
                            <EndQuizCard
                                score={getPercentage(
                                    score,
                                    typedQuizData.length
                                )}
                                restartFct={restartQuiz}
                                className="h-full"
                            />
                        </div>
                        <div className="flex-1">
                            <LastQuiz
                                last_attemps={insights_data?.insights || []}
                                insights_data={insights_data}
                                className="h-full"
                            />
                        </div>
                    </div>

                    {/* Ranking Section */}
                    <div className="w-full flex-1">
                        <Ranking ranking={rankings} />
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 flex flex-col">
                        {/* Quiz Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 mb-2">
                                    Quiz
                                </h1>
                                <p className="text-blue-600 font-medium text-sm">
                                    Question {questionIndex} sur{" "}
                                    {typedQuizData.length}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">
                                    Score actuel
                                </p>
                                <p className="text-lg font-bold text-blue-600">
                                    {score}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${
                                            (answeredQuestionsCount /
                                                typedQuizData.length) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Début</span>
                                <span>
                                    {Math.round(
                                        (answeredQuestionsCount /
                                            typedQuizData.length) *
                                            100
                                    )}
                                    % terminé
                                </span>
                                <span>Fin</span>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">
                                {typedQuizData[questionIndex - 1]?.question}
                            </h2>
                        </div>

                        {/* Answers - This will grow to fill remaining space */}
                        <div className="flex-1 flex flex-col">
                            <PossibleAnswers
                                answers={
                                    typedQuizData[questionIndex - 1]?.choices ||
                                    []
                                }
                                correct_answer={
                                    typedQuizData[questionIndex - 1]?.answer ||
                                    ""
                                }
                                explanation={
                                    typedQuizData[questionIndex - 1]
                                        ?.explanation || ""
                                }
                                setSelectedAnswer={setSelectedAnswer}
                                selectedAnswer={selectedAnswer}
                                onSubmitQuestion={handleSubmitQuestion}
                                onNextQuestion={handleNextQuestion}
                                isAnswer={isAnswer}
                                isFinish={isFinish}
                                processing={processingSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
