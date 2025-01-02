export type InsightsCardProps = {
  title: string;
  value: number;
  unit: string;
  base: number;
};

export const InsightsCardAccent = ({
  title,
  value,
  unit,
  base,
}: InsightsCardProps) => {
  return (
    <div className="p-5 bg-accent bg-opacity-25 text-accent outfit-regular rounded-lg border-2 border-accent flex flex-col items-start gap-3 w-full">
      <p className="text-md text-accent text-opacity-75">
        {title.toUpperCase()}
      </p>
      <div className="flex items-center justify-center gap-1 w-full">
        <p className="text-5xl outfit-regular">
          {value}
          {unit}
        </p>
        <p className="text-sm text-accent text-opacity-75">sur {base} essais</p>
      </div>
    </div>
  );
};

export const InsightsCardPrimary = ({
  title,
  value,
  unit,
  base,
}: InsightsCardProps) => {
  return (
    <div className="p-5 bg-primary bg-opacity-25 text-primary outfit-regular rounded-lg border-2 border-primary flex flex-col items-start gap-3 w-full">
      <p className="text-md text-primary text-opacity-75">
        {title.toUpperCase()}
      </p>
      <div className="flex items-center justify-center gap-1 w-full">
        <p className="text-5xl outfit-regular">
          {value}
          {unit}
        </p>
        <p className="text-sm text-primary text-opacity-75">sur {base} personnes</p>
      </div>
    </div>
  );
};
