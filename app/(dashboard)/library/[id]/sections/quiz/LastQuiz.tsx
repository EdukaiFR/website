import { Clock, BarChart3, TrendingUp } from "lucide-react";

export type LastQuizProps = {
  last_attemps: unknown[];
  className?: string;
};

export const LastQuiz = ({ last_attemps, className }: LastQuizProps) => {
  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Tes derniers scores</h3>
      </div>

      {last_attemps && last_attemps.length > 0 ? (
        <div className="space-y-3">
          {/* TODO: Replace with actual quiz history */}
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Historique des tentatives</p>
                <p className="text-xs text-gray-500">Fonctionnalité en développement</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[150px] text-center">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">
              Premier quiz !
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              C'était ton premier quiz, lance-en d'autres pour suivre ta progression et voir tes scores précédents.
            </p>
          </div>
          
          {/* Encouragement Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2 w-full">
            <div className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-center">
              <p className="text-lg font-bold text-blue-600">1</p>
              <p className="text-xs text-gray-500">Quiz terminé</p>
            </div>
            <div className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-center">
              <p className="text-lg font-bold text-blue-600">+XP</p>
              <p className="text-xs text-gray-500">Expérience</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
