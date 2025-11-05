interface FeatureCardProps {
    readonly color: "yellow" | "green" | "pink" | "purple";
    readonly title: string;
    readonly description: string;
}

export function FeatureCard({ color, title, description }: Readonly<FeatureCardProps>) {
    const colorClasses = {
        yellow: {
            bg: "bg-yellow-400/20",
            dot: "bg-yellow-400",
        },
        green: {
            bg: "bg-green-400/20",
            dot: "bg-green-400",
        },
        pink: {
            bg: "bg-pink-400/20",
            dot: "bg-pink-400",
        },
        purple: {
            bg: "bg-purple-400/20",
            dot: "bg-purple-400",
        },
    };

    const colors = colorClasses[color];

    return (
        <div className="bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.bg} rounded-full flex items-center justify-center`}
                >
                    <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.dot} rounded-full`}
                    ></div>
                </div>
                <div>
                    <p className="text-white font-bold text-xs sm:text-sm drop-shadow-md">
                        {title}
                    </p>
                    <p className="text-white/80 text-xs drop-shadow-sm hidden sm:block">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
