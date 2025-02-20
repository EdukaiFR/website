export type SubjectBadgeProps = {
  text: string;
};

export const SubjectBadge = ({ text }: SubjectBadgeProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-1 rounded-full bg-[#28A745] bg-opacity-15 text-[#28A745] text-xs satoshi-medium">
      <p>{text.toUpperCase()}</p>
    </div>
  );
};
