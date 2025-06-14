import { CounterBadge } from "@/components/badge/CounterBadge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { ExamDialog } from "./ExamDialog";
import { ExamCard } from "./ExamCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ExamsProps = {
  course_id: string;
  exams: any[];
  createExam: (
    courseId: string,
    title: string,
    description: string,
    date: Date
  ) => void;
  updateExam: (examId: string, data: any) => void;
  getExams: (courseId: string[]) => void;
  deleteExam: (examId: string, courseId: string) => void;
  updateCourseData: () => void;
};

export const Exams = ({
  course_id,
  exams,
  createExam,
  updateExam,
  getExams,
  updateCourseData,
  deleteExam,
}: ExamsProps) => {
  const [examFilter, setExamFilter] = useState<"upcoming" | "all">("upcoming");

  // Separate exams into upcoming and past
  const now = new Date();
  const upcomingExams = exams.filter((exam) => new Date(exam.date) >= now);
  const pastExams = exams.filter((exam) => new Date(exam.date) < now);

  // Determine which exams to display based on filter
  const displayedExams = examFilter === "upcoming" ? upcomingExams : exams;

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-12rem)] sm:min-h-[65vh] gap-4 sm:gap-6 overflow-auto max-w-full">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-full">
        {/* Page Title and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl satoshi-medium">
              {examFilter === "upcoming"
                ? "Examens prévus"
                : "Tous les examens"}
            </h2>
            <CounterBadge counter={displayedExams.length || 0} />
          </div>

          {/* Exam Filter Selector */}
          <Select
            value={examFilter}
            onValueChange={(value: "upcoming" | "all") => setExamFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] rounded-full border-2 border-blue-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 focus:border-blue-400 transition-colors">
              <SelectValue placeholder="Filtrer les examens" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <SelectItem
                value="upcoming"
                className="rounded-xl hover:bg-blue-50 focus:bg-blue-50"
              >
                Examens prévus ({upcomingExams.length})
              </SelectItem>
              <SelectItem
                value="all"
                className="rounded-xl hover:bg-blue-50 focus:bg-blue-50"
              >
                Tous les examens ({exams.length})
                {pastExams.length > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (dont {pastExams.length} passé
                    {pastExams.length > 1 ? "s" : ""})
                  </span>
                )}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Exam Button */}
        <div className="flex-shrink-0">
          <ExamDialog
            courseId={course_id}
            createExam={createExam}
            getExams={getExams}
            updateCourseData={updateCourseData}
            deleteExam={deleteExam}
          />
        </div>
      </div>

      {/* Content */}
      {displayedExams.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] w-full">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl mb-4">📚</div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {examFilter === "upcoming"
                ? "Vous n'avez pas d'examen prévu"
                : "Vous n'avez pas encore créé d'examen"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 auto-rows-max w-full max-w-full">
          {displayedExams.map((exam) => {
            const isOutdated = new Date(exam.date) < now;
            return (
              <div
                key={exam._id}
                className={`relative w-full max-w-full ${
                  isOutdated ? "opacity-75" : ""
                }`}
              >
                {isOutdated && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full z-10 font-semibold">
                    Passé
                  </div>
                )}
                <ExamCard
                  exam={{
                    ...exam,
                    date: new Date(exam.date),
                  }}
                  courseId={course_id}
                  updateExam={updateExam}
                  getExams={getExams}
                  updateCourseData={updateCourseData}
                  createExam={createExam}
                  deleteExam={deleteExam}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
