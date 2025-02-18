import { getPercentage, normalizeText } from "@/lib/utils";
import { rankings } from "@/public/mocks/default-value";
import { useState } from "react";
import { Ranking } from "../overview/Card/Ranking";
import { EndQuizCard } from "./EndQuizCard";
import { LastQuiz } from "./LastQuiz";
import { PossibleAnswers } from "./PossibleAnswers";

export type QuizProps = {
  course_id: string;
  quiz_data: any[];
};

export const Quiz = ({ course_id, quiz_data }: QuizProps) => {
  const [questionIndex, setQuestionIndex] = useState<number>(1);

  const [answer, setAnswer] = useState<string>(
    quiz_data[questionIndex - 1].answer
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswer, setIsAnswer] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);

  const [processingSubmit, setProcessingSubmit] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);

  const handleSubmitQuestion = () => {
    try {
      setProcessingSubmit(!processingSubmit);
      const isCorrectAnswer = normalizeText(selectedAnswer).startsWith(
        normalizeText(answer) + "."
      );
      // const isCorrectAnswer = normalizeText(answer).startsWith(
      //   normalizeText(correct_answer) + "."
      // );
      if (isCorrectAnswer) {
        setScore(score + 1);
      }
      setIsAnswer(true);
    } catch (error: any) {
      console.error("Oups.. An error occured:", error);
    } finally {
      setProcessingSubmit(!processingSubmit);
    }
  };

  const handleNextQuestion = () => {
    try {
      setProcessingSubmit(!processingSubmit);
      if (questionIndex >= quiz_data.length) {
        // end game
        setIsFinish(true);
        return;
      }
      setAnswer(quiz_data[questionIndex].answer);
      setSelectedAnswer("");
      setIsAnswer(false);
      setQuestionIndex(questionIndex + 1);
    } catch (error: any) {
      console.error("Oups.. An error occured:", error);
    } finally {
      setProcessingSubmit(!processingSubmit);
    }
  };

  const restartQuiz = () => {
    try {
      setSelectedAnswer("");
      setIsFinish(false);
      setIsAnswer(false);
      setScore(0);
      setAnswer(quiz_data[0].answer);
      setQuestionIndex(1);
    } catch (error: any) {
      console.error(
        "Oups... an error occured when we restart the quiz: ",
        error
      );
    }
  };

  return (
    <>
      {isFinish ? (
        <div className="w-full flex flex-col items-start min-h-[65vh] lg:max-h-[73vh] gap-4">
          {/* Line 1 */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-2 w-full lg:h-[35%]">
            <EndQuizCard
              score={getPercentage(score, quiz_data.length)}
              restartFct={restartQuiz}
              className="flex-1 h-full"
            />
            <LastQuiz last_attemps={[]} className="flex-1 h-full" />
          </div>

          {/* Line 2 */}
          <div className="flex flex-1 items-center justify-between gap-2 w-full">
            <Ranking ranking={rankings} className="flex-1" />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg flex flex-col items-start w-[18rem] md:w-[20rem] lg: lg:w-2/3 p-4 gap-3 satoshi-medium mx-auto">
          {/* Header */}
          <div className="flex flex-col items-start gap-0">
            <h4 className="text-xl text-[#3C517C]">Quiz</h4>
            <p className="text-sm text-[#3678FF] text-opacity-50">
              Question {questionIndex}
              {"/"}
              {quiz_data.length}
            </p>
          </div>

          <p className="text-xl text-[#3C517C]">
            {quiz_data[questionIndex - 1].question}
          </p>
          <PossibleAnswers
            answers={quiz_data[questionIndex - 1].choices}
            correct_answer={quiz_data[questionIndex - 1].answer}
            setSelectedAnswer={setSelectedAnswer}
            selectedAnswer={selectedAnswer}
            onSubmitQuestion={handleSubmitQuestion}
            onNextQuestion={handleNextQuestion}
            isAnswer={isAnswer}
            isFinish={isFinish}
          />
        </div>
      )}
    </>
  );
};
