export type LevelBadgeProps = {
  text: string;
};

export const LevelBadge = ({ text }: LevelBadgeProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-1 rounded-full bg-[#3678FF] bg-opacity-25 text-[#3678FF] text-sm font-semibold">
      <p>{text.toUpperCase()}</p>
    </div>
  );
};
