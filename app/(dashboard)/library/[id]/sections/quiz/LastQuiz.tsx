export type LastQuizProps = {
  last_attemps: any[];
  className?: string;
};

export const LastQuiz = ({ last_attemps, className }: LastQuizProps) => {
  return (
    <div
      className={`w-full flex flex-col items-start justify-between p-4 border rounded-lg bg-white satoshi-medium gap-4 h-full ${className}`}
    >
      <p className="text-lg text-[#3C517C]">Tes derniers scores</p>
      {last_attemps && last_attemps.length > 0 ? (
        <p className="text-black text-opacity-70">
          Je dois afficher l'historique des autres essais
        </p>
      ) : (
        <p className="text-black text-opacity-50 mx-auto my-auto text-sm">
          C'était ton premier quiz, lance-en d'autres pour suivre ta
          progression
        </p>
      )}
    </div>
  );
};
