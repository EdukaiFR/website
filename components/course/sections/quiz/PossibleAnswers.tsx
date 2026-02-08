import { Button } from "@/components/ui/button";
import { EASE_OUT, REVEAL_DELAY_MS } from "@/lib/constants/quiz";
import {
    type AnswerIcon,
    type RevealPhase,
    getAnswerStyles,
} from "@/lib/utils/answer-styles";
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export interface PossibleAnswersProps {
    answers: string[];
    correct_answer: string;
    explanation: string;
    setSelectedAnswer: (answer: string) => void;
    selectedAnswer: string;
    onSubmitQuestion: () => void;
    onNextQuestion: () => void;
    isFinish: boolean;
    isAnswer: boolean;
    processing: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    correct: <CheckCircle className="w-5 h-5 text-green-600" />,
    wrong: <XCircle className="w-5 h-5 text-red-600" />,
};

function renderAnswerIcon(icon: AnswerIcon): React.ReactNode {
    if (!icon) return null;
    return ICON_MAP[icon] ?? null;
}

export const PossibleAnswers = ({
    answers,
    correct_answer,
    explanation,
    setSelectedAnswer,
    selectedAnswer,
    onSubmitQuestion,
    onNextQuestion,
    isAnswer,
    processing,
}: PossibleAnswersProps) => {
    const shouldReduceMotion = useReducedMotion();
    const [revealPhase, setRevealPhase] = useState<RevealPhase>("idle");

    const userIsCorrect =
        selectedAnswer.charAt(0) === correct_answer.charAt(0);

    useEffect(() => {
        if (!isAnswer) {
            setRevealPhase("idle");
            return;
        }

        if (userIsCorrect) {
            setRevealPhase("all-revealed");
            return;
        }

        setRevealPhase("wrong-shown");
        const timer = setTimeout(
            () => setRevealPhase("all-revealed"),
            REVEAL_DELAY_MS
        );
        return () => clearTimeout(timer);
    }, [isAnswer, userIsCorrect]);

    const getMotionProps = useCallback(
        (isCorrectAnswer: boolean, isSelected: boolean) => {
            const resetState = { scale: 1, x: 0, opacity: 1 };

            if (shouldReduceMotion || revealPhase === "idle") {
                return {
                    animate: resetState,
                    transition: { duration: 0.15 },
                };
            }

            if (
                revealPhase === "wrong-shown" &&
                isSelected &&
                !isCorrectAnswer
            ) {
                return {
                    animate: { ...resetState, x: [0, -8, 7, -5, 4, -2, 0] },
                    transition: { duration: 0.4 },
                };
            }

            if (
                revealPhase === "all-revealed" &&
                isCorrectAnswer &&
                !userIsCorrect
            ) {
                return {
                    animate: {
                        ...resetState,
                        scale: [0.95, 1.05, 1],
                    },
                    transition: { duration: 0.45, ease: EASE_OUT },
                };
            }

            if (
                revealPhase === "all-revealed" &&
                isCorrectAnswer &&
                userIsCorrect
            ) {
                return {
                    animate: {
                        ...resetState,
                        scale: [1, 1.05, 0.98, 1],
                    },
                    transition: { duration: 0.45, ease: EASE_OUT },
                };
            }

            if (!isCorrectAnswer && !isSelected) {
                return {
                    animate: { ...resetState, opacity: 0.5 },
                    transition: { duration: 0.3 },
                };
            }

            return { animate: resetState, transition: { duration: 0.15 } };
        },
        [revealPhase, userIsCorrect, shouldReduceMotion]
    );

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col gap-2">
                {answers.map((answer, index) => {
                    const correctLetter = correct_answer.charAt(0);
                    const answerLetter = answer.charAt(0);

                    const isSelected = selectedAnswer === answer;
                    const isCorrectAnswer = answerLetter === correctLetter;

                    const shouldShowCorrect =
                        isCorrectAnswer && revealPhase === "all-revealed";
                    const shouldShowWrong =
                        isSelected &&
                        !isCorrectAnswer &&
                        revealPhase !== "idle";

                    const { buttonStyles, badgeStyles, icon } =
                        getAnswerStyles({
                            isSelected,
                            isAnswer,
                            isCorrectAnswer,
                            shouldShowCorrect,
                            shouldShowWrong,
                            revealPhase,
                        });

                    const motionProps = getMotionProps(
                        isCorrectAnswer,
                        isSelected
                    );

                    return (
                        <motion.div key={index} {...motionProps}>
                            <Button
                                onClick={() => {
                                    if (!isAnswer && !processing) {
                                        setSelectedAnswer(answer);
                                    }
                                }}
                                variant="outline"
                                disabled={isAnswer || processing}
                                className={`${buttonStyles} disabled:opacity-100 transition-colors duration-300 w-full text-left justify-start flex items-center min-h-[3rem] text-wrap px-3 py-2.5 rounded-xl shadow-sm`}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div
                                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${badgeStyles}`}
                                    >
                                        {answer.charAt(0)}
                                    </div>
                                    <span className="flex-1 text-sm font-medium leading-relaxed">
                                        {answer.substring(3)}
                                    </span>
                                    {icon && (
                                        <div className="flex-shrink-0">
                                            {renderAnswerIcon(icon)}
                                        </div>
                                    )}
                                </div>
                            </Button>
                        </motion.div>
                    );
                })}
            </div>

            {revealPhase === "all-revealed" && explanation && (
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-blue-800 text-sm m-0">
                            Explication
                        </h4>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">
                        {explanation}
                    </p>
                </motion.div>
            )}

            <div className="flex flex-col gap-2 mt-4">
                {!isAnswer && (
                    <Button
                        onClick={onSubmitQuestion}
                        disabled={selectedAnswer === "" || processing}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Validation...
                            </div>
                        ) : (
                            "Confirmer ma reponse"
                        )}
                    </Button>
                )}

                {revealPhase === "all-revealed" && (
                    <motion.div
                        initial={
                            shouldReduceMotion ? false : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Button
                            onClick={onNextQuestion}
                            disabled={processing}
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <span className="mr-2">Question suivante</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
