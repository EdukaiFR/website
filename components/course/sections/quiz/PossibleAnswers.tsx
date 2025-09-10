import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from "lucide-react";

export type PossibleAnswersProps = {
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
};

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
    return (
        <div className="flex flex-col w-full gap-4">
            {/* Answer Options */}
            <div className="flex flex-col gap-2">
                {answers.map((answer, index) => {
                    // const selectedLetter = selectedAnswer.charAt(0);
                    const correctLetter = correct_answer.charAt(0);
                    const answerLetter = answer.charAt(0);

                    const isSelected = selectedAnswer === answer;
                    const isCorrectAnswer = answerLetter === correctLetter;
                    // const userSelectedCorrect = selectedLetter === correctLetter;

                    let buttonStyles =
                        "border border-gray-200 bg-white/80 text-gray-700 hover:bg-blue-50 hover:border-blue-300";
                    let iconElement = null;

                    if (isSelected && !isAnswer) {
                        buttonStyles =
                            "border-blue-600 bg-blue-50 text-blue-700";
                    } else if (isAnswer) {
                        if (isCorrectAnswer) {
                            buttonStyles =
                                "border-green-500 bg-green-50 text-green-700";
                            iconElement = (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            );
                        } else if (isSelected) {
                            buttonStyles =
                                "border-red-500 bg-red-50 text-red-700";
                            iconElement = (
                                <XCircle className="w-4 h-4 text-red-600" />
                            );
                        } else {
                            buttonStyles =
                                "border-gray-200 bg-gray-50 text-gray-500";
                        }
                    }

                    return (
                        <Button
                            key={index}
                            onClick={() => {
                                if (!isAnswer && !processing) {
                                    setSelectedAnswer(answer);
                                }
                            }}
                            variant="outline"
                            disabled={isAnswer || processing}
                            className={`${buttonStyles} transition-all duration-200 w-full text-left justify-start flex items-center min-h-[3rem] text-wrap px-3 py-2.5 rounded-xl shadow-sm hover:shadow-md`}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                                    {answer.charAt(0)}
                                </div>
                                <span className="flex-1 text-sm font-medium leading-relaxed">
                                    {answer.substring(3)}
                                </span>
                                {iconElement && (
                                    <div className="flex-shrink-0">
                                        {iconElement}
                                    </div>
                                )}
                            </div>
                        </Button>
                    );
                })}
            </div>

            {/* Explanation Section - Shows after answer is submitted */}
            {isAnswer && explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-xl">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-800 mb-1 text-sm">
                                Explication
                            </h4>
                            <p className="text-blue-700 text-sm leading-relaxed">
                                {explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-4">
                {!isAnswer && (
                    <Button
                        onClick={onSubmitQuestion}
                        disabled={selectedAnswer === "" || processing}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Validation...
                            </div>
                        ) : (
                            "Confirmer ma réponse"
                        )}
                    </Button>
                )}

                {isAnswer && (
                    <Button
                        onClick={onNextQuestion}
                        disabled={processing}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <span className="mr-2">Question suivante</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};
