import { CounterBadge } from "@/components/badge/CounterBadge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExamDialog } from "./ExamDialog";
import { ExamCard } from "./ExamCard";

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
  updateCourseData: () => void;
};

export const Exams = ({
  course_id,
  exams,
  createExam,
  updateExam,
  getExams,
  updateCourseData,
}: ExamsProps) => {
  return (
    <div className="w-full flex flex-col items-start min-h-[65vh] gap-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center justify-start gap-2">
          <h2 className="text-xl satoshi-medium">Examen prévus</h2>
          <CounterBadge counter={exams.length || 0} />
        </div>
        {/* Add Exam Button */}
        <ExamDialog
          courseId={course_id}
          createExam={createExam}
          getExams={getExams}
          updateCourseData={updateCourseData}
        />
      </div>

      {/* Content */}
      {exams.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          Vous n'avez pas encore créé d'examen
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4 w-full items-center">
          {exams.map((exam) => (
            <ExamCard
              key={exam._id}
              exam={{
                ...exam,
                date: new Date(exam.date),
              }}
              courseId={course_id}
              updateExam={updateExam}
              getExams={getExams}
              updateCourseData={updateCourseData}
              createExam={createExam}
            />
          ))}
        </div>
      )}
    </div>
  );
};
