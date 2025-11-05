import { RankCard } from "@/components/card/RankCard";
import { Crown, Trophy, Users } from "lucide-react";

export type RankingProps = {
    ranking: unknown[];
    className?: string;
};

type RankingData = {
    user: {
        firstname: string;
        lastname: string;
        profile_picture?: string;
    };
    score: number;
};

export const Ranking = ({ ranking, className }: RankingProps) => {
    const typedRanking = ranking as RankingData[];

    if (!typedRanking || typedRanking.length === 0) {
        return (
            <div
                className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                        Classement
                    </span>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                            Le classement sera bientôt disponible.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                        Classement
                    </span>
                </div>
                <div className="p-2 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-600" />
                </div>
            </div>

            {/* User Score Section */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <p className="text-xs text-gray-500 mb-1">Ton score</p>
                <p className="text-lg font-bold text-blue-600">1236 pts</p>
            </div>

            {/* Rankings List */}
            <div className="flex flex-col gap-2 flex-1">
                {typedRanking.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                        <RankCard ranking={item} rank={index + 1} />
                    </div>
                ))}
            </div>
        </div>
    );
};
