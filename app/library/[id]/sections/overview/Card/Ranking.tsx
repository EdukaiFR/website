import { RankCard } from "@/components/card/RankCard";
import { Crown } from "lucide-react";

export type RankingProps = {
  ranking: any[];
  className?: string;
};

export const Ranking = ({ ranking, className }: RankingProps) => {
  return (
    <div
      className={`bg-[#3678FF] bg-opacity-10 rounded-lg p-4 flex flex-col items-start justify-between gap-3 h-full satoshi-medium ${className}`}
    >
      <div className="flex flex-col items-start gap-0 w-full">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-lg text-[rgba(26, 32, 44, 1)">Classement</h3>
          <Crown size={20} className="text-[#3678FF]" />
        </div>
        {/* TODO: Display user score here */}
      </div>

      <div className="flex flex-col items-start justify-between gap-4 h-full w-full">
        {ranking.map((item, index) => {
          if (index >= 3) {
            return;
          }
          return <RankCard ranking={item} rank={index + 1} />;
        })}
      </div>
    </div>
  );
};
