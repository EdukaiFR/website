export type LevelBadgeProps = {
    text: string;
};

export const LevelBadge = ({ text }: LevelBadgeProps) => {
    return (
        <div className="flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/25 backdrop-blur-md text-white text-xs font-medium border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-200">
            <p>{text.toUpperCase()}</p>
        </div>
    );
};
