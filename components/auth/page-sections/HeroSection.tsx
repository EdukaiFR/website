import { Share2 } from "lucide-react";
import { features } from "@/config/auth/features.config";

interface HeroSectionProps {
    readonly mounted: boolean;
}

export function HeroSection({ mounted }: HeroSectionProps) {
    return (
        <div
            className={`flex items-center lg:order-1 order-2 min-h-screen py-12 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
            <div className="space-y-6 lg:space-y-8 w-full">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/60 shadow-md hover:shadow-lg transition-shadow">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Plateforme d'apprentissage
                    </span>
                </div>

                {/* Main Title */}
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                            Révise mieux,{" "}
                        </span>
                        <span className="text-gray-900">pas plus.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                        Edukai génère des questions personnalisées à partir de
                        tes cours en <span className="font-bold text-blue-600">20 secondes</span>.
                    </p>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feature) => (
                        <div
                            key={feature.text}
                            className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100/50 hover:bg-white/90 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-md">
                                <feature.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {feature.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Instagram Link */}
                <div className="flex items-center justify-center pt-4">
                    <a
                        href="https://www.instagram.com/edukaifr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Suivez-nous sur Instagram</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
