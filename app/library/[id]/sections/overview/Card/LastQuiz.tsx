export type LastQuizProps = {
  lastQuiz: any[];
};

export const LastQuiz = ({ lastQuiz }: LastQuizProps) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-start justify-between gap-3 h-full satoshi-medium ">
      <h3 className="text-lg text-[rgba(26, 32, 44, 1)]">Tes derniers quiz</h3>
      <div className="flex flex-col items-center justify-center gap-1 h-full w-full">
        {lastQuiz.length > 0 ? (
          <p className="text-sm text-[rgba(26, 32, 44, 1)] opacity-80">
            Liste des derniers quiz lancé avec date + score
          </p>
        ) : (
          <p className="text-sm text-[rgba(26, 32, 44, 1)] opacity-80">
            Tu n'as pas encore lancé de quiz.
          </p>
        )}
      </div>
    </div>
  );
};
