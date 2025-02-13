export type CounterBadgeProps = {
  counter: number;
};

export const CounterBadge = ({ counter }: CounterBadgeProps) => {
  return (
    <div className="rounded-full flex items-center justify-center bg-[#2D6BCF] bg-opacity-25 text-[#2D6BCF] satoshi-medium text-xs px-4 py-1">
      {counter}
    </div>
  );
};
