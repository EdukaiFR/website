import { getDaysLeft, formatDate } from "@/lib/date-format";

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

  return (
    <div className="rounded-lg bg-white border border-[#E3E3E7] flex flex-col gap-6 items-start justify-between w-full p-4">
      {/* Header */}
      <div className="flex flex-col items-start w-full">
        <h4 className="text-lg text-[#2D6BCF]">{exam.title}</h4>
        {exam.description && (
          <p className="text-sm text-[#90B4FF]">{exam.description}</p>
        )}
      </div>
      {/* Days left */}
      <div className="w-full flex items-center justify-center gap-2">
        <p className="text-6xl text-[#2D6BCF]">{getDaysLeft(examDate)}</p>
        <p className="text-sm text-[#2D6BCF] text-opacity-50">Jours restant</p>
      </div>
      {/* Footer */}
      <p className="ml-auto mr-auto mt-auto text-xs text-[#6C757D]">
        {formatDate(examDate.toLocaleDateString("fr-FR"))}
      </p>
    </div>
  );
};
