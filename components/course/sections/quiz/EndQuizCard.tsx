import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy } from "lucide-react";

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
    const getScoreColor = () => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-blue-600";
        if (score >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBg = () => {
        if (score >= 80) return "bg-green-50";
        if (score >= 60) return "bg-blue-50";
        if (score >= 40) return "bg-yellow-50";
        return "bg-red-50";
    };

    const getScoreMessage = () => {
        if (score >= 80) return "Excellent travail !";
        if (score >= 60) return "Bon résultat !";
        if (score >= 40) return "Peut mieux faire.";
        return "Continue tes efforts !";
    };

    return (
        <div
            className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                    <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                    Quiz terminé !
                </h3>
            </div>

            {/* Score Display */}
            <div className={`${getScoreBg()} rounded-2xl p-4 mb-4 text-center`}>
                <div className="flex items-end justify-center gap-2 mb-3">
                    <span className={`text-2xl font-bold ${getScoreColor()}`}>
                        {score}
                    </span>
                    <span
                        className={`text-lg font-medium ${getScoreColor()} mb-1`}
                    >
                        %
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">de bonnes réponses</p>
                <p className={`font-semibold ${getScoreColor()}`}>
                    {getScoreMessage()}
                </p>
            </div>

            {/* Stats */}
            {/* <div className="mb-4 space-y-2">
        <div className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-xl">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Précision</p>
            <p className="font-semibold text-gray-800">{score}%</p>
          </div>
        </div>
      </div> */}

            {/* Restart Button */}
            <Button
                onClick={restartFct}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <RotateCcw className="w-4 h-4 mr-2" />
                Relancer le quiz
            </Button>
        </div>
    );
};
