import { getDaysLeft } from "@/lib/date-format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
  return (
    <div className="rounded-lg bg-white border border-[#E3E3E7] flex flex-col gap-6 items-start justify-between w-full max-w-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start w-full">
          <h4 className="text-lg text-[#2D6BCF]">{exam.title}</h4>
          {exam.description && (
            <p className="text-sm text-[#90B4FF]">{exam.description}</p>
          )}
        </div>

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
      {/* Days left */}
      <div className="w-full flex items-center justify-center gap-2">
        <p className="text-6xl text-[#2D6BCF]">{getDaysLeft(exam.date)}</p>
        <p className="text-sm text-[#2D6BCF] text-opacity-50">
          {getDaysLeft(exam.date) === 1 ? "jour restant" : "jours restants"}
        </p>
      </div>
      {/* Footer */}
      <p className="ml-auto mr-auto mt-auto text-xs text-[#6C757D]">
        {format(new Date(exam.date), "PPP", { locale: fr })}
      </p>
    </div>
  );
};
