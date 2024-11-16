export type ExamCardProps = {
  title: string;
  value: number;
};

export const ExamCard = ({ title, value }: ExamCardProps) => {
  return (
    <div className="p-5 bg-white bg-opacity-25 text-white outfit-regular rounded-lg border-2 border-white flex flex-col items-start gap-3 w-full">
      <p className="text-md text-white text-opacity-75">
        {title.toUpperCase()}
      </p>
      <div className="flex items-center justify-center gap-5 w-full">
        <p className="text-5xl outfit-regular">{value}</p>
        <p className="text-sm text-white text-opacity-75">jours restant</p>
      </div>
    </div>
  );
};
