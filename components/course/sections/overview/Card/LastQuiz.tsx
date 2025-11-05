import { BrainCircuit, Calendar, Clock, Trophy } from "lucide-react";

export type LastQuizProps = {
    lastQuiz: Array<{
        score: number;
        createdAt: string;
    }>;
    insights_data?: {
        averageScore: number;
        insightsCount: number;
        insights?: Array<{
            score: number;
            createdAt: string;
        }>;
    };
};

export const LastQuiz = ({ lastQuiz, insights_data }: LastQuizProps) => {
    // Function to format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays === 0) return "Aujourd'hui";
        if (diffInDays === 1) return "Hier";
        if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
        });
    };

    // Function for score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 60)
            return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    // Take the last 3 quizzes
    const recentQuizzes = lastQuiz.slice(-3).reverse();

    // Check if we have aggregated insights data but not the details
    const hasAggregatedData = insights_data && insights_data.insightsCount > 0;
    const hasDetailedData = lastQuiz && lastQuiz.length > 0;

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800">
                    Tes derniers quiz
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 h-full">
                {hasDetailedData ? (
                    <>
                        {/* Quick stats */}
                        {insights_data && insights_data.insightsCount > 0 && (
                            <div className="flex gap-2 mb-3">
                                <div className="flex-1 p-2 bg-blue-50/80 rounded-lg text-center">
                                    <p className="text-sm font-semibold text-blue-600">
                                        {Math.round(
                                            parseFloat(
                                                insights_data.averageScore.toString()
                                            )
                                        )}
                                        %
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Moyenne
                                    </p>
                                </div>
                                <div className="flex-1 p-2 bg-blue-50/80 rounded-lg text-center">
                                    <p className="text-sm font-semibold text-blue-600">
                                        {insights_data.insightsCount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Total
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* List of recent quizzes */}
                        <div className="space-y-2 flex-1">
                            {recentQuizzes.map((quiz, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <Trophy className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                Quiz #
                                                {recentQuizzes.length - index}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(quiz.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`px-2 py-1 rounded-md border text-xs font-semibold ${getScoreColor(quiz.score)}`}
                                    >
                                        {Math.round(quiz.score)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : hasAggregatedData ? (
                    /* Display aggregated stats when we don't have the details */
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2 mb-3">
                            <div className="flex-1 p-3 bg-blue-50/80 rounded-lg text-center">
                                <p className="text-lg font-semibold text-blue-600">
                                    {Math.round(
                                        parseFloat(
                                            insights_data.averageScore.toString()
                                        )
                                    )}
                                    %
                                </p>
                                <p className="text-xs text-gray-500">
                                    Score moyen
                                </p>
                            </div>
                            <div className="flex-1 p-3 bg-blue-50/80 rounded-lg text-center">
                                <p className="text-lg font-semibold text-blue-600">
                                    {insights_data.insightsCount}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Quiz réalisés
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 h-full">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <BrainCircuit className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-800 mb-1">
                                Aucun quiz lancé
                            </p>
                            <p className="text-xs text-gray-500">
                                Tu n'as pas encore lancé de quiz.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
