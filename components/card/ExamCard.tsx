import { getDaysLeft, formatDate } from "@/lib/date-format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

export type ExamCardProps = {
  exam: {
    examId: number;
    title: string;
    description?: string;
    date: Date | string;
  };
};

export const ExamCard = ({ exam }: ExamCardProps) => {
  // Safely convert date to Date object
  const getDateObject = (date: Date | string): Date => {
    if (date instanceof Date) {
      return date;
    }
    return new Date(date);
  };

  const examDate = getDateObject(exam.date);
  const daysLeft = getDaysLeft(examDate);
  const isUrgent = daysLeft <= 7;
  const isPassed = daysLeft < 0;

  return (
    <div className="group relative">
      {/* Modern Card Container - Square Shape */}
      <div
        className={`
        relative overflow-hidden rounded-3xl bg-gradient-to-br backdrop-blur-sm 
        border-0 shadow-lg hover:shadow-2xl transition-all duration-300 
        transform hover:scale-[1.02] hover:-translate-y-1
        w-full aspect-square p-6 flex flex-col justify-between
        ${
          isPassed
            ? "from-gray-50 to-gray-100 opacity-75"
            : isUrgent
            ? "from-red-50 via-pink-50 to-orange-50 border border-red-100"
            : "from-blue-50 via-indigo-50 to-purple-50 bg-white/80"
        }
      `}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Header - Compact */}
        <div className="relative z-10 mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`
              p-2 rounded-xl flex items-center justify-center flex-shrink-0
              ${
                isPassed
                  ? "bg-gray-200"
                  : isUrgent
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }
            `}
            >
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h4
              className={`
              text-lg font-bold leading-tight truncate
              ${
                isPassed
                  ? "text-gray-600"
                  : isUrgent
                  ? "text-red-700"
                  : "text-blue-700"
              }
            `}
            >
              {exam.title}
            </h4>
          </div>
          {exam.description && (
            <p
              className={`
              text-sm leading-relaxed ml-11 line-clamp-2
              ${
                isPassed
                  ? "text-gray-500"
                  : isUrgent
                  ? "text-red-600/70"
                  : "text-blue-600/70"
              }
            `}
            >
              {exam.description}
            </p>
          )}
        </div>

        {/* Days Left - Center Focus (Larger in square) */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-2">
          <div className="text-center">
            <div
              className={`
              text-7xl xl:text-8xl font-black leading-none mb-3 
              bg-gradient-to-br bg-clip-text text-transparent
              ${
                isPassed
                  ? "from-gray-500 to-gray-600"
                  : isUrgent
                  ? "from-red-500 via-pink-500 to-orange-500"
                  : "from-blue-500 via-indigo-500 to-purple-500"
              }
            `}
            >
              {Math.abs(daysLeft)}
            </div>
            <div className="flex items-center justify-center gap-1">
              <Clock
                className={`
                w-4 h-4 flex-shrink-0
                ${
                  isPassed
                    ? "text-gray-500"
                    : isUrgent
                    ? "text-red-500"
                    : "text-blue-500"
                }
              `}
              />
              <p
                className={`
                text-sm font-semibold text-center
                ${
                  isPassed
                    ? "text-gray-600"
                    : isUrgent
                    ? "text-red-600"
                    : "text-blue-600"
                }
              `}
              >
                {isPassed
                  ? `${Math.abs(daysLeft)} jour${
                      Math.abs(daysLeft) > 1 ? "s" : ""
                    } passé${Math.abs(daysLeft) > 1 ? "s" : ""}`
                  : daysLeft === 0
                  ? "Aujourd'hui"
                  : `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${
                      daysLeft > 1 ? "s" : ""
                    }`}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="relative z-10 text-center">
          <div
            className={`
            inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs
            ${
              isPassed
                ? "bg-gray-200 text-gray-600"
                : "bg-white/60 backdrop-blur-sm text-gray-700"
            }
          `}
          >
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <p className="font-medium">
              {format(examDate, "d MMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>

        {/* Status Badge - Fixed Position */}
        {isPassed && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Passé
          </div>
        )}
        {isUrgent && !isPassed && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
            Urgent
          </div>
        )}
      </div>
    </div>
  );
};
