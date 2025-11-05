import { fallingIcons } from "@/config/auth/falling-icons.config";

export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-2000" />

            {/* Falling Icons - Hidden on mobile */}
            <div className="hidden lg:block">
                {fallingIcons.map((item, index) => {
                    const { Icon, delay, duration, left } = item;
                    return (
                        <Icon
                            key={`falling-icon-${index}-${delay}-${left}`}
                            className="absolute w-6 h-6 text-blue-400/30"
                            style={{
                                left,
                                top: "-50px",
                                animation: `fall ${duration}s linear ${delay}s infinite`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
