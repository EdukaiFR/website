export type ExamCardProps = {
  exam: {
    title: string;
    description?: string;
    date: Date;
  };
};

// Create a function that take a date in parameter and return the number of days left before this date
const getDaysLeft = (date: Date) => {
  const today = new Date();
  const timeDiff = date.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const ExamCard = (props: ExamCardProps) => {
  const { title, description, date } = props.exam;
  const daysLeft = getDaysLeft(date);

  return (
    <div className="transition-all hover:scale-105 p-5 bg-white bg-opacity-25 text-white outfit-regular rounded-lg border-2 border-white flex flex-col items-start gap-3 w-full max-w-xs min-w-xs lg:min-w-[48.5%] lg:max-w-[48.5%]">
      <p className="text-md text-white text-opacity-75">
        {title.toUpperCase()}
      </p>
      <div className="flex items-center justify-center gap-5 w-full">
        <p className="text-5xl outfit-regular">{daysLeft}</p>
        <p className="text-sm text-white text-opacity-75">
          {daysLeft === 1 ? "jour restant" : "jours restants"}
        </p>
      </div>
    </div>
  );
};
