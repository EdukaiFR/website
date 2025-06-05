export type LevelBadgeProps = {
  text: string;
};

export const LevelBadge = ({ text }: LevelBadgeProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-medium border border-blue-200 shadow-sm">
      <p>{text.toUpperCase()}</p>
    </div>
  );
};
