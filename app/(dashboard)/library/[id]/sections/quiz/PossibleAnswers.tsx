import { Button } from "@/components/ui/button";
import { normalizeText } from "@/lib/utils";

export type PossibleAnswersProps = {
  answers: string[];
  correct_answer: string;
  setSelectedAnswer: (answer: string) => void;
  selectedAnswer: string;
  onSubmitQuestion: () => void;
  onNextQuestion: () => void;
  isFinish: boolean;
  isAnswer: boolean;
};

export const PossibleAnswers = ({
  answers,
  correct_answer,
  setSelectedAnswer,
  selectedAnswer,
  onSubmitQuestion,
  onNextQuestion,
  isFinish,
  isAnswer,
}: PossibleAnswersProps) => {
  return (
    <div className="flex flex-col items-start w-full gap-2">
      {answers.map((answer, index) => {
        const isCorrect = normalizeText(selectedAnswer).startsWith(
          normalizeText(correct_answer) + "."
        );
        const isSelected =
          normalizeText(selectedAnswer) === normalizeText(answer);
        const isCorrectAnswer = normalizeText(answer).startsWith(
          normalizeText(correct_answer) + "."
        );

        return (
          <Button
            key={index}
            onClick={() => {
              !isAnswer && setSelectedAnswer(answer);
            }}
            variant={"outline"}
            className={`transition-all w-full text-left justify-start flex items-center min-h-[3rem] text-wrap
              ${
                isSelected
                  ? "border-[#3678FF] text-[#3678FF]"
                  : "border text-black text-opacity-75"
              }
              ${
                isAnswer && isCorrect && isSelected
                  ? "border-[#28A745] text-[#28A745]"
                  : ""
              }
              ${
                isAnswer && !isCorrect && isSelected
                  ? "border-[#FF6B6B] text-[#FF6B6B]"
                  : ""
              }
              ${
                isAnswer && !isCorrect && isCorrectAnswer
                  ? "border-[#28A745] text-[#28A745]"
                  : ""
              }
  `}
            size={"lg"}
          >
            {answer}
          </Button>
        );
      })}

      {!isAnswer && (
        <Button
          onClick={onSubmitQuestion}
          disabled={selectedAnswer === ""}
          className="mt-3 w-full transition-all bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-lg hover:opacity-80"
        >
          Confirmer
        </Button>
      )}
      {isAnswer && (
        <Button
          onClick={onNextQuestion}
          disabled={selectedAnswer === ""}
          className="mt-3 w-full transition-all bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-lg hover:opacity-80"
        >
          Prochaine question
        </Button>
      )}
    </div>
  );
};
