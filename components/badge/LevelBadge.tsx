export type LevelBadgeProps = {
    text: string;
};

export const LevelBadge = ({ text }: LevelBadgeProps) => {
    return (
        <div className="flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-medium border border-orange-200 shadow-sm">
            <p>{text.toUpperCase()}</p>
        </div>
    );
};
