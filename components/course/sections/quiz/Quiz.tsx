import { useQuizPlayer } from "@/hooks/useQuizPlayer";
import { getPercentage } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/utils/quiz";
import { rankings } from "@/public/mocks/default-value";
import type { InsightsService } from "@/services";
import NextImage from "next/image";
import { Ranking } from "../overview/Card/Ranking";
import { EndQuizCard } from "./EndQuizCard";
import { LastQuiz } from "./LastQuiz";
import { PossibleAnswers } from "./PossibleAnswers";

export interface QuizProps {
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
}

export const Quiz = ({
    quiz_data,
    quiz_id,
    insights_service,
    insights_data,
    refreshInsights,
}: QuizProps) => {
    const quizData = quiz_data as QuizQuestion[];

    const {
        currentQuestion,
        questionIndex,
        totalQuestions,
        selectedAnswer,
        setSelectedAnswer,
        isAnswer,
        score,
        processingSubmit,
        isFinish,
        mascotSrc,
        progressPercent,
        handleSubmitQuestion,
        handleNextQuestion,
        restartQuiz,
    } = useQuizPlayer({
        quizData,
        quizId: quiz_id,
        insightsService: insights_service,
        refreshInsights,
    });

    if (!quizData || quizData.length === 0) {
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

    if (isFinish) {
        return (
            <div className="flex flex-col gap-4 h-full">
                <div className="w-full flex flex-col items-start h-full gap-4">
                    <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
                        <div className="flex-1">
                            <EndQuizCard
                                score={getPercentage(score, totalQuestions)}
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
                    <div className="w-full flex-1">
                        <Ranking ranking={rankings} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6 relative">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 mb-2">
                                Quiz
                            </h1>
                            <p className="text-blue-600 font-medium text-sm">
                                Question {questionIndex} sur {totalQuestions}
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

                    <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${progressPercent}%`,
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Debut</span>
                            <span>
                                {Math.round(progressPercent)}% termine
                            </span>
                            <span>Fin</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">
                            {currentQuestion?.question}
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <PossibleAnswers
                            answers={currentQuestion?.choices ?? []}
                            correct_answer={currentQuestion?.answer ?? ""}
                            explanation={currentQuestion?.explanation ?? ""}
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
        </div>
    );
};
