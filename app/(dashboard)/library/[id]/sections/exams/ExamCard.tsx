import { getDaysLeft } from "@/lib/date-format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Edit3 } from "lucide-react";
import { ExamDialog } from "./ExamDialog";

export type ExamCardProps = {
  exam: any;
  updateExam: (examId: string, data: any) => void;
  getExams: (courseId: string[]) => void;
  updateCourseData: () => void;
  courseId: string;
  isEditing?: boolean;
  createExam: (
    courseId: string,
    title: string,
    description: string,
    date: Date
  ) => void;
  deleteExam: (examId: string, courseId: string) => void;
};

export const ExamCard = ({
  exam,
  updateExam,
  getExams,
  updateCourseData,
  courseId,
  createExam,
  deleteExam,
}: ExamCardProps) => {
  const daysLeft = getDaysLeft(exam.date);
  const isUrgent = daysLeft <= 7;
  const isPassed = daysLeft < 0;

  return (
    <div className="group relative">
      {/* Modern Card Container - Responsive Size */}
      <div
        className={`
        relative overflow-hidden rounded-3xl bg-gradient-to-br backdrop-blur-sm 
        border-0 shadow-lg hover:shadow-2xl transition-all duration-300 
        transform hover:scale-[1.02] hover:-translate-y-1
        w-full h-72 sm:h-80 p-4 sm:p-6 flex flex-col justify-between
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
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-blue-400 to-transparent rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-purple-400 to-transparent rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
        </div>

        {/* Header - Fixed Height */}
        <div className="relative z-10 flex items-start justify-between mb-3 sm:mb-4 h-16 sm:h-20">
          <div className="flex-1 mr-2 sm:mr-3 overflow-hidden">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div
                className={`
                p-1.5 sm:p-2 rounded-xl flex items-center justify-center flex-shrink-0
                ${
                  isPassed
                    ? "bg-gray-200"
                    : isUrgent
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                }
              `}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4
                className={`
                text-base sm:text-lg font-bold leading-tight truncate
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
                text-xs sm:text-sm leading-relaxed line-clamp-2
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

          {/* Edit Button - Fixed Position */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <ExamDialog
              courseId={courseId}
              exam={{
                ...exam,
                date: new Date(exam.date),
              }}
              isEditing={true}
              createExam={createExam}
              updateExam={updateExam}
              getExams={getExams}
              updateCourseData={updateCourseData}
              deleteExam={deleteExam}
            />
          </div>
        </div>

        {/* Days Left - Fixed Center Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-2 sm:py-4">
          <div className="text-center">
            <div
              className={`
              text-5xl sm:text-6xl font-black leading-none mb-2 sm:mb-3
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
                w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0
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
                text-xs sm:text-sm font-semibold text-center
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

        {/* Footer - Fixed Height */}
        <div className="relative z-10 text-center h-10 sm:h-12 flex items-center justify-center">
          <div
            className={`
            inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full
            ${
              isPassed
                ? "bg-gray-200 text-gray-600"
                : "bg-white/60 backdrop-blur-sm text-gray-700"
            }
          `}
          >
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
              {format(new Date(exam.date), "PPP", { locale: fr })}
            </p>
          </div>
        </div>

        {/* Status Badge - Fixed Position */}
        {isPassed && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold">
            Passé
          </div>
        )}
        {isUrgent && !isPassed && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold animate-pulse">
            Urgent
          </div>
        )}
      </div>
    </div>
  );
};
