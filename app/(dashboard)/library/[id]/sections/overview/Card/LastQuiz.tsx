import { Clock, BrainCircuit } from "lucide-react";

export type LastQuizProps = {
  lastQuiz: unknown[];
};

export const LastQuiz = ({ lastQuiz }: LastQuizProps) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Tes derniers quiz</h3>
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center gap-3 h-full">
        {lastQuiz.length > 0 ? (
          <div className="w-full space-y-2">
            {/* TODO: Replace with actual quiz list */}
            <p className="text-sm text-gray-600 text-center">
              Liste des derniers quiz lancé avec date + score
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <BrainCircuit className="w-6 h-6 text-blue-600" />
            </div>
            <div>
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
