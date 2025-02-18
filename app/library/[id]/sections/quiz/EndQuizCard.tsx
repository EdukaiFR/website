import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export type EndQuizCardProps = {
  restartFct: () => void;
  score: number;
  className?: string;
};

export const EndQuizCard = ({
  restartFct,
  score,
  className,
}: EndQuizCardProps) => {
  return (
    <div
      className={`flex flex-col items-start justify-between p-4 border rounded-lg bg-white satoshi-medium gap-2 ${className} w-full lg:max-w-[30%]`}
    >
      <h4 className="text-lg text-[#3C517C]">Quiz terminé !</h4>
      <div className="flex items-end justify-center gap-2 w-full">
        <p className="text-4xl lg:text-6xl text-[#3678FF]">{score}%</p>
        <p className="text-xs lg:text-sm text-[#3678FF] text-opacity-75">
          de bonne réponse
        </p>
      </div>
      <Button
        onClick={restartFct}
        variant={"default"}
        className="mt-3 w-full transition-all bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-lg hover:opacity-80"
      >
        <RotateCcw size={20} className="mr-3" />
        Relancer le quiz
      </Button>
    </div>
  );
};
