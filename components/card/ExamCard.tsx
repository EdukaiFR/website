export type ExamCardProps = {
  exam: {
    examId: number;
    title: string;
    description?: string;
    date: Date;
  };
};

export const ExamCard = ({ exam }: ExamCardProps) => {
  function getDaysLeft(date: Date | string) {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  function formatDate(dateString: string): string {
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    const [day, month, year] = dateString.split("/").map(Number);
    return `${day} ${months[month - 1]} ${year}`;
  }

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
        <p className="text-6xl text-[#2D6BCF]">{getDaysLeft(exam.date)}</p>
        <p className="text-sm text-[#2D6BCF] text-opacity-50">Jours restant</p>
      </div>
      {/* Footer */}
      <p className="ml-auto mr-auto mt-auto text-xs text-[#6C757D]">
        {formatDate(exam.date.toLocaleDateString("fr-FR"))}
      </p>
    </div>
  );
};
