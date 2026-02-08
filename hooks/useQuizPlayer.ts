import {
    MASCOT_IDLE,
    MASCOT_SUCCESS,
    MASCOT_WRONG,
} from "@/lib/constants/mascot";
import { insightsToast, quizToast } from "@/lib/toast";
import { getPercentage } from "@/lib/utils";
import { type QuizQuestion, shuffleQuiz } from "@/lib/utils/quiz";
import type { InsightsService } from "@/services";
import { useEffect, useRef, useState } from "react";

interface UseQuizPlayerParams {
    quizData: QuizQuestion[];
    quizId?: string;
    insightsService?: InsightsService;
    refreshInsights?: (quizId: string) => Promise<unknown>;
}

function logQuizError(context: string, error: unknown): void {
    if (process.env.NODE_ENV === "development") {
        console.error(`[Quiz] ${context}:`, error);
    }
}

export function useQuizPlayer({
    quizData,
    quizId,
    insightsService,
    refreshInsights,
}: UseQuizPlayerParams) {
    const [shuffledData, setShuffledData] = useState<QuizQuestion[]>(() =>
        shuffleQuiz(quizData)
    );
    const [questionIndex, setQuestionIndex] = useState(1);
    const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState(0);
    const [answer, setAnswer] = useState(shuffledData[0]?.answer ?? "");
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [isAnswer, setIsAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [processingSubmit, setProcessingSubmit] = useState(false);
    const [isFinish, setIsFinish] = useState(false);

    const insightCreatedRef = useRef(false);

    const userIsCorrect =
        selectedAnswer !== "" &&
        selectedAnswer.charAt(0) === answer.charAt(0);

    const mascotSrc = !isAnswer
        ? MASCOT_IDLE
        : userIsCorrect
          ? MASCOT_SUCCESS
          : MASCOT_WRONG;

    const currentQuestion = shuffledData[questionIndex - 1];

    const progressPercent =
        quizData.length > 0
            ? (answeredQuestionsCount / quizData.length) * 100
            : 0;

    useEffect(() => {
        const img1 = new Image();
        img1.src = MASCOT_SUCCESS;
        const img2 = new Image();
        img2.src = MASCOT_WRONG;
    }, []);

    useEffect(() => {
        if (
            !isFinish ||
            !quizId ||
            !insightsService ||
            insightCreatedRef.current
        ) {
            return;
        }

        insightCreatedRef.current = true;

        const createInsight = async () => {
            try {
                const finalScore = getPercentage(score, quizData.length);
                await insightsService.createInsight(quizId, finalScore);
                insightsToast.createSuccess();

                if (refreshInsights) {
                    await refreshInsights(quizId);
                }
            } catch (error: unknown) {
                logQuizError("Failed to create quiz insight", error);
                insightsToast.createError();
                insightCreatedRef.current = false;
            }
        };

        createInsight();
    }, [
        isFinish,
        quizId,
        score,
        quizData.length,
        insightsService,
        refreshInsights,
    ]);

    function handleSubmitQuestion() {
        try {
            setProcessingSubmit(true);

            const selectedLetter = selectedAnswer.charAt(0);
            const correctLetter = answer.charAt(0);

            if (selectedLetter === correctLetter) {
                setScore(score + 1);
            }
            setIsAnswer(true);
        } catch (error: unknown) {
            logQuizError("handleSubmitQuestion", error);
            quizToast.generateError();
        } finally {
            setProcessingSubmit(false);
        }
    }

    function handleNextQuestion() {
        try {
            setProcessingSubmit(true);
            setAnsweredQuestionsCount(answeredQuestionsCount + 1);

            if (questionIndex >= shuffledData.length) {
                setIsFinish(true);
                return;
            }
            setAnswer(shuffledData[questionIndex]?.answer ?? "");
            setSelectedAnswer("");
            setIsAnswer(false);
            setQuestionIndex(questionIndex + 1);
        } catch (error: unknown) {
            logQuizError("handleNextQuestion", error);
            quizToast.loadError();
        } finally {
            setProcessingSubmit(false);
        }
    }

    function restartQuiz() {
        try {
            setProcessingSubmit(true);
            const newShuffle = shuffleQuiz(quizData);
            setShuffledData(newShuffle);
            setQuestionIndex(1);
            setAnsweredQuestionsCount(0);
            setAnswer(newShuffle[0]?.answer ?? "");
            setSelectedAnswer("");
            setIsAnswer(false);
            setScore(0);
            setIsFinish(false);
            insightCreatedRef.current = false;
        } catch (error: unknown) {
            logQuizError("restartQuiz", error);
            quizToast.restartError();
        } finally {
            setProcessingSubmit(false);
        }
    }

    return {
        currentQuestion,
        questionIndex,
        answeredQuestionsCount,
        totalQuestions: quizData.length,
        selectedAnswer,
        setSelectedAnswer,
        isAnswer,
        score,
        processingSubmit,
        isFinish,
        userIsCorrect,
        mascotSrc,
        progressPercent,
        handleSubmitQuestion,
        handleNextQuestion,
        restartQuiz,
    };
}
