"use client";

import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";

export type QuizzSectionProps = {
  questions: {
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
  }[];
  setIsQuizzVisible: (value: boolean) => void;
};

export const QuizzSection = ({
  questions,
  setIsQuizzVisible,
}: QuizzSectionProps) => {
  const [goodAnswers, setGoodAnswers] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isQuizzCompleted, setIsQuizzCompleted] = useState<boolean>(false);
  const [lastQuestion, setLastQuestion] = useState<boolean>(false);

  const playAgain = () => {
    setGoodAnswers(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsQuizzCompleted(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setIsAnswered(true);
    if (isCorrect) {
      setGoodAnswers(goodAnswers + 1);
    }
  };

  const nextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestion(currentQuestion + 1);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="p-5 rounded-lg w-full lg:w-[50%] border-2 border-white border-opacity-25 flex flex-col gap-5 items-center justify-center">
      {/* Header */}
      {!isQuizzCompleted && (
        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <h2 className="text-xl text-white outfit-regular text-center">
            Quiz
          </h2>
          <p className="text-sm text-white text-opacity-75 outfit-regular">
            {currentQuestion > questions.length - 1
              ? `Question ${currentQuestion} / ${questions.length}`
              : `Question ${currentQuestion + 1} / ${questions.length}`}
          </p>
        </div>
      )}

      {/* Quiz Section */}
      {!isQuizzCompleted && (
        <div className="flex flex-col items-start w-full gap-4">
          {/* Question */}
          {currentQuestion <= questions.length - 1 && !isQuizzCompleted && (
            <p className="text-white text-md lg:text-lg outfit-regular">
              {currentQuestionData.question}
            </p>
          )}

          {/* Possible Answers */}
          <div className="flex flex-col gap-2 w-full">
            {!isQuizzCompleted &&
              currentQuestionData.choices.map((answer, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-lg cursor-pointer border-2 flex items-center justify-between w-full outfit-regular ${
                    selectedAnswer === answer && !isAnswered
                      ? "border-2 border-primary border-opacity-50"
                      : ""
                  } ${
                    selectedAnswer === answer &&
                    isAnswered &&
                    answer === questions[currentQuestion].answer
                      ? "border-2 border-[#01D539] bg-[#01D539] bg-opacity-15"
                      : ""
                  } ${
                    selectedAnswer === answer &&
                    isAnswered &&
                    answer !== questions[currentQuestion].answer
                      ? "border-2 border-[#D50101] bg-[#D50101] bg-opacity-15"
                      : ""
                  } ${
                    isAnswered &&
                    answer === questions[currentQuestion].answer &&
                    selectedAnswer !== answer
                      ? "border-2 border-[#01D539] bg-[#01D539] bg-opacity-15"
                      : ""
                  }`}
                  onClick={() => {
                    if (!isAnswered) {
                      setSelectedAnswer(answer);
                    }
                  }}
                >
                  {/* Answer */}
                  <div className="flex flex-col items-start gap-1">
                    <p
                      className={`text-sm ${
                        selectedAnswer === answer && !isAnswered
                          ? " text-primary"
                          : " text-white text-opacity-75"
                      } ${
                        isAnswered &&
                        answer === questions[currentQuestion].answer &&
                        selectedAnswer === answer
                          ? " text-[#01D539]"
                          : ""
                      } ${
                        isAnswered &&
                        answer !== questions[currentQuestion].answer &&
                        selectedAnswer === answer
                          ? " text-[#D50101]"
                          : ""
                      } outfit-regular ${
                        isAnswered &&
                        answer === questions[currentQuestion].answer &&
                        selectedAnswer !== answer
                          ? " text-[#01D539]"
                          : ""
                      }`}
                    >
                      {answer}
                    </p>
                    {/* Explanation */}
                    {isAnswered &&
                      answer === questions[currentQuestion].answer &&
                      questions[currentQuestion].explanation && (
                        <p className="text-sm text-[#01D539] text-opacity-50 outfit-regular mt-4">
                          {questions[currentQuestion].explanation}
                        </p>
                      )}
                  </div>
                  {/* Checkbox */}
                  {!isAnswered && (
                    <div className="lg:ml-auto transition-all w-6 h-6 rounded-full flex items-center justify-center">
                      {answer === selectedAnswer ? (
                        <div className="w-3 h-3 bg-primary-500 rounded-full transition-all" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-white border-opacity-50 rounded-full transition-all" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            {/* Go to the next question */}
            {isAnswered && currentQuestion < questions.length - 1 && (
              <Button
                onClick={() => nextQuestion()}
                className="text-md mt-5 flex items-center justify-center gap-5 rounded-full w-full text-white outfit-regular text-md py-[3%] h-full"
              >
                <ChevronRight size={24} />
                Question Suivante
              </Button>
            )}
            {/* Confirm the answer */}
            {!isAnswered && currentQuestion <= questions.length + 1 && (
              <Button
                disabled={!selectedAnswer}
                onClick={() => {
                  if (selectedAnswer) {
                    const selected = currentQuestionData.choices.find(
                      (answer: string) => answer === selectedAnswer
                    );
                    if (selected)
                      handleAnswer(
                        selected === questions[currentQuestion].answer
                      );
                    // Si on est a la dernière question alors mettre isQuizzCompleted à true
                    if (currentQuestion === questions.length) {
                      setIsQuizzCompleted(true);
                    }
                  }
                }}
                className="text-md mt-5 flex items-center justify-center gap-5 rounded-full w-full text-white outfit-regular text-md py-[3%] h-full"
              >
                <Check size={24} />
                Confirmer
              </Button>
            )}
            {/* Finished the quiz */}
            {currentQuestion >= questions.length - 1 &&
              isAnswered &&
              !isQuizzCompleted && (
                <Button
                  onClick={() => setIsQuizzCompleted(true)}
                  className="text-md mt-5 flex items-center justify-center gap-5 rounded-full w-full text-white outfit-regular text-md py-[3%] h-full"
                >
                  Terminer
                </Button>
              )}
          </div>
        </div>
      )}

      {/* Quiz Completed */}
      {isQuizzCompleted && (
        <div className="text-center flex flex-col items-center justify-center gap-3">
          <h2 className="text-2xl text-accent outfit-regular mt-0">
            Quiz terminé !
          </h2>

          <p className="text-primary text-lg outfit-regular">
            Votre score est de{" "}
            <span className="text-xl">
              {
                // Calculate the percentage of good answers
                Math.round((goodAnswers / questions.length) * 100)
              }
              %
            </span>
          </p>
          <p className="text-sm text-white outfit-regular">
            Vous avez répondu correctement à {goodAnswers} question(s) sur{" "}
            {questions.length}.
          </p>

          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <Button
              onClick={() => playAgain()}
              className="w-full text-md mt-5 flex items-center justify-center gap-5 rounded-full w-full text-white outfit-regular text-md py-[3%] h-full"
            >
              Relancer le quiz
            </Button>
            <Button
              variant={"outline"}
              size={"lg"}
              className="w-full px-[3%] ml-auto bg-transparent border-2 border-white text-white outfit-regular text-sm rounded-full hover:bg-white hover:bg-opacity-10"
              onClick={() => setIsQuizzVisible(false)}
            >
              Fermer le quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
