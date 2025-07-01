import {
    BookOpen,
    Brain,
    Clock,
    Lightbulb,
    Sparkles,
    Users,
} from "lucide-react";

export type SimilarCoursesProps = {
    course_id: string;
    similarCourses: unknown;
};

export const SimilarCourses = ({
    course_id,
    similarCourses,
}: SimilarCoursesProps) => {
    console.log(course_id);
    console.log(similarCourses);

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 rounded-3xl p-8 relative overflow-hidden">
            {/* Background animated elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full animate-pulse"></div>
                <div
                    className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-teal-400/10 to-cyan-400/10 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>
                <div
                    className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-ping"
                    style={{ animationDelay: "3s" }}
                ></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 max-w-lg">
                {/* Icon with animation */}
                <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    {/* Floating sparkles */}
                    <div className="absolute -top-2 -right-2 animate-bounce">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                </div>

                {/* Title with gradient */}
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                        Bientôt disponible
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                        Cours similaires
                    </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-lg">
                    Découvrez bientôt des cours similaires personnalisés selon
                    vos intérêts et votre niveau pour enrichir votre parcours
                    d&apos;apprentissage.
                </p>

                {/* Coming soon badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200/50 shadow-sm">
                    <Clock className="w-5 h-5 text-green-600 animate-pulse" />
                    <span className="text-green-700 font-semibold">
                        En développement
                    </span>
                </div>

                {/* Features preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Brain className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                                IA personnalisée
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Recommandations intelligentes basées sur vos
                            préférences
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                                Communauté
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Découvrez ce que les autres étudiants apprennent
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                <Lightbulb className="w-4 h-4 text-teal-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                                Suggestions avancées
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Parcours d&apos;apprentissage optimisés
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-cyan-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                                Contenu adaptatif
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Contenus adaptés à votre rythme et style
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
