import { Calendar, Clock, Sparkles, Target } from "lucide-react";

export type ObjectivesProps = {
    course_id: string;
    objectives: unknown;
};

export const Objectives = ({ course_id, objectives }: ObjectivesProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-blue-50/30 via-blue-100/20 to-blue-50/30 rounded-3xl p-8 relative overflow-hidden">
            {/* Background animated elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse"></div>
                <div
                    className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
                <div
                    className="absolute top-1/3 right-1/3 w-1 h-1 bg-indigo-400/40 rounded-full animate-ping"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping"
                    style={{ animationDelay: "3s" }}
                ></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 max-w-lg">
                {/* Icon with animation */}
                <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <Target className="w-12 h-12 text-white" />
                    </div>
                    {/* Floating sparkles */}
                    <div className="absolute -top-2 -right-2 animate-bounce">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                </div>

                {/* Title with gradient */}
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent leading-tight">
                        Bientôt disponible
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                        Objectifs du cours
                    </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-lg">
                    Nous travaillons actuellement sur cette fonctionnalité pour
                    vous offrir une expérience d&apos;apprentissage encore plus
                    personnalisée et efficace.
                </p>

                {/* Coming soon badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-200/50 shadow-sm">
                    <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                    <span className="text-blue-700 font-semibold">
                        En développement
                    </span>
                </div>

                {/* Features preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                                Objectifs personnalisés
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Définissez vos objectifs d&apos;apprentissage
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                                Suivi de progrès
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Visualisez votre avancement
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
