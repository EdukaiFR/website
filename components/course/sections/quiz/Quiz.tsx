import { MASCOT_IDLE, MASCOT_SUCCESS, MASCOT_WRONG } from "@/lib/constants/mascot";
import { insightsToast, quizToast } from "@/lib/toast";
import { getPercentage } from "@/lib/utils";
import { rankings } from "@/public/mocks/default-value";
import type { InsightsService } from "@/services";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { Ranking } from "../overview/Card/Ranking";
import { EndQuizCard } from "./EndQuizCard";
import { LastQuiz } from "./LastQuiz";
import { PossibleAnswers } from "./PossibleAnswers";

export type QuizProps = {
    course_id: string;
    quiz_data: unknown[];
    quiz_id?: string;
    insights_service?: InsightsService;
    insights_data?: {
        items: Array<{
            _id: string;
            score: number;
            createdAt: string;
            author: string;
        }>;
    };
    refreshInsights?: (quizId: string) => Promise<unknown>;
};

type QuizQuestion = {
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
};

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];


function shuffleArray<T>(array: readonly T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleQuiz(questions: QuizQuestion[]): QuizQuestion[] {
    const shuffledQuestions = shuffleArray(questions);

    return shuffledQuestions.map(q => {
        const correctText = q.answer.substring(3);
        const choiceTexts = q.choices.map(c => c.substring(3));
        const shuffledTexts = shuffleArray(choiceTexts);

        const newChoices = shuffledTexts.map(
            (text, i) => `${CHOICE_LETTERS[i]}) ${text}`
        );
        const correctIndex = shuffledTexts.indexOf(correctText);
        const newAnswer = `${CHOICE_LETTERS[correctIndex]}) ${correctText}`;

        return { ...q, choices: newChoices, answer: newAnswer };
    });
}

export const Quiz = ({
    quiz_data,
    quiz_id,
    insights_service,
    insights_data,
    refreshInsights,
}: QuizProps) => {
    const typedQuizData = quiz_data as QuizQuestion[];
    const [shuffledData, setShuffledData] = useState<QuizQuestion[]>(() =>
        shuffleQuiz(typedQuizData)
    );
    const [questionIndex, setQuestionIndex] = useState<number>(1);
    const [answeredQuestionsCount, setAnsweredQuestionsCount] =
        useState<number>(0);

    const [answer, setAnswer] = useState<string>(shuffledData[0]?.answer || "");
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [isAnswer, setIsAnswer] = useState<boolean>(false);

    const [score, setScore] = useState<number>(0);

    const [processingSubmit, setProcessingSubmit] = useState<boolean>(false);
    const [isFinish, setIsFinish] = useState<boolean>(false);

    const insightCreatedRef = useRef<boolean>(false);

    const userIsCorrect =
        selectedAnswer !== "" && selectedAnswer.charAt(0) === answer.charAt(0);

    const getMascotSrc = (): string => {
        if (!isAnswer) return MASCOT_IDLE;
        return userIsCorrect ? MASCOT_SUCCESS : MASCOT_WRONG;
    };
    const mascotSrc = getMascotSrc();

    useEffect(() => {
        const img1 = new Image();
        img1.src = MASCOT_SUCCESS;
        const img2 = new Image();
        img2.src = MASCOT_WRONG;
    }, []);

    const createQuizInsight = async () => {
        if (
            isFinish &&
            quiz_id &&
            insights_service &&
            !insightCreatedRef.current
        ) {
            insightCreatedRef.current = true;
            try {
                const finalScore = getPercentage(score, typedQuizData.length);
                await insights_service.createInsight(quiz_id, finalScore);
                insightsToast.createSuccess();

                if (refreshInsights) {
                    await refreshInsights(quiz_id);
                }
            } catch (error) {
                console.error("❌ Failed to create quiz insight:", error);
                insightsToast.createError();
                insightCreatedRef.current = false;
            }
        }
    };

    useEffect(() => {
        createQuizInsight();
    }, [
        isFinish,
        quiz_id,
        score,
        typedQuizData.length,
        insights_service,
        refreshInsights,
    ]);

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
            setAnsweredQuestionsCount(answeredQuestionsCount + 1);

            if (questionIndex >= shuffledData.length) {
                // end game
                setIsFinish(true);
                return;
            }
            setAnswer(shuffledData[questionIndex]?.answer || "");
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
            const newShuffle = shuffleQuiz(typedQuizData);
            setShuffledData(newShuffle);
            setQuestionIndex(1);
            setAnsweredQuestionsCount(0);
            setAnswer(newShuffle[0]?.answer || "");
            setSelectedAnswer("");
            setIsAnswer(false);
            setScore(0);
            setIsFinish(false);
            insightCreatedRef.current = false;
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
                                last_attemps={insights_data?.items || []}
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
                        <div className="flex items-center justify-between mb-6 relative">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 mb-2">
                                    Quiz
                                </h1>
                                <p className="text-blue-600 font-medium text-sm">
                                    Question {questionIndex} sur{" "}
                                    {typedQuizData.length}
                                </p>
                            </div>

                            <div className="absolute left-[50%] -bottom-3 -translate-x-1/2 z-10 scale-[1.6]">
                                <NextImage
                                    key={mascotSrc}
                                    src={mascotSrc}
                                    alt="Mascot"
                                    width={80}
                                    height={75}
                                    unoptimized
                                />
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
                                {shuffledData[questionIndex - 1]?.question}
                            </h2>
                        </div>

                        {/* Answers - This will grow to fill remaining space */}
                        <div className="flex-1 flex flex-col">
                            <PossibleAnswers
                                answers={
                                    shuffledData[questionIndex - 1]?.choices ||
                                    []
                                }
                                correct_answer={
                                    shuffledData[questionIndex - 1]?.answer ||
                                    ""
                                }
                                explanation={
                                    shuffledData[questionIndex - 1]
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
