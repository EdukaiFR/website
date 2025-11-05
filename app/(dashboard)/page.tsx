"use client";

import { useUserProfile } from "@/contexts/UserContext";
import { useAllExams } from "@/hooks/useAllExams";
import { getDaysLeft } from "@/lib/date-format";
import { useCourseService } from "@/services";
import {
    Activity,
    BookOpen,
    Calendar,
    Clock,
    Target,
    TrendingUp,
    Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CourseData {
    _id: string;
    title: string;
    subject: string;
    level: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function Home() {
    const { userProfile, loading } = useUserProfile();
    const router = useRouter();
    const { allExams, loading: examsLoading } = useAllExams();
    const courseService = useCourseService();
    const [recentCourses, setRecentCourses] = useState<CourseData[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);

    useEffect(() => {
        const fetchRecentCourses = async () => {
            try {
                setCoursesLoading(true);
                const response = await courseService.getCourses();
                if (response && "items" in response) {
                    const courses = response.items as CourseData[];
                    // Trier par date de mise à jour (plus récent en premier) et limiter à 4
                    const sortedCourses = courses.toSorted((a, b) => {
                        const dateA = new Date(
                            a.updatedAt || a.createdAt || 0
                        ).getTime();
                        const dateB = new Date(
                            b.updatedAt || b.createdAt || 0
                        ).getTime();
                        return dateB - dateA;
                    }).slice(0, 4);
                    setRecentCourses(sortedCourses);
                }
            } catch (error) {
                console.error("Error fetching recent courses:", error);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchRecentCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Détermine le nom à afficher
    const getDisplayName = () => {
        if (!userProfile) return "";

        // Si le username est une adresse email ou identique à l'email
        if (
            userProfile.username.includes("@") ||
            userProfile.username === userProfile.email
        ) {
            // Affiche firstName et première lettre du lastName
            return `${userProfile.firstName} ${userProfile.lastName.charAt(0)}.`;
        }

        // Sinon affiche le username
        return userProfile.username;
    };
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
            {/* Beautiful Header Section */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-32 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-indigo-300/15 rounded-full blur-xl"></div>

                <div className="relative z-10 container mx-auto px-6 py-16 lg:py-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <BookOpen className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Tableau de Bord
                                </span>
                            </div>

                            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
                                Bienvenue{" "}
                                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                    {loading ? (
                                        <span className="inline-block animate-pulse bg-yellow-300/30 rounded h-10 w-32"></span>
                                    ) : (
                                        getDisplayName()
                                    )}
                                </span>
                            </h1>

                            <p className="text-base lg:text-lg text-blue-100 mb-8 max-w-2xl">
                                Voici un petit résumé de ton compte et de tes
                                progrès récents dans ton parcours
                                d&apos;apprentissage.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => router.push("/library")}
                                    className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
                                >
                                    <BookOpen className="w-6 h-6" />
                                    Continuer l&apos;Apprentissage
                                </button>
                                <button
                                    onClick={() =>
                                        toast.warning(
                                            "Fonctionnalité en développement",
                                            {
                                                description:
                                                    "La gestion des objectifs arrive bientôt ! Restez connecté.",
                                            }
                                        )
                                    }
                                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                                >
                                    <Target className="w-6 h-6" />
                                    Voir les Objectifs
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Quick Stats */}
                        <div className="flex-1 max-w-md">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Courses Progress */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-blue-400/30 group-hover:scale-110">
                                        <BookOpen className="w-6 h-6 text-blue-300 transition-all duration-300 group-hover:text-blue-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        12
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Cours en Cours
                                    </div>
                                </div>

                                {/* Study Time */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-green-400/30 group-hover:scale-110">
                                        <Clock className="w-6 h-6 text-green-300 transition-all duration-300 group-hover:text-green-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        45h
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Temps d&apos;Étude
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-yellow-400/30 group-hover:scale-110">
                                        <Trophy className="w-6 h-6 text-yellow-300 transition-all duration-300 group-hover:text-yellow-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        8
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Succès Débloqués
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-purple-400/30 group-hover:scale-110">
                                        <TrendingUp className="w-6 h-6 text-purple-300 transition-all duration-300 group-hover:text-purple-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        78%
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Progression
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg
                        className="w-full h-12 lg:h-20 text-blue-50"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 120"
                        fill="currentColor"
                    >
                        <path d="M0,120 C240,60 480,60 720,80 C960,100 1200,40 1440,60 L1440,120 Z" />
                    </svg>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 bg-blue-50/50">
                <div className="container mx-auto px-6 py-12">
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Upcoming Exams */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-800">
                                        Examens à Venir
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Prochaines échéances
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {(() => {
                                    if (examsLoading) {
                                        return (
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex justify-center items-center">
                                                    <span className="text-gray-500 text-sm">
                                                        Chargement...
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (allExams.length === 0) {
                                        return (
                                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                    <Calendar className="w-6 h-6 text-blue-600" />
                                                    <span className="font-semibold text-gray-800 text-sm">
                                                        Aucun examen prévu
                                                    </span>
                                                    <span className="text-gray-600 text-xs">
                                                        Ajoute des examens dans tes
                                                        cours pour les voir ici
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return allExams.slice(0, 2).map(exam => {
                                        const daysLeft = getDaysLeft(exam.date);
                                        const isUrgent = daysLeft <= 7;
                                        const bgColor = isUrgent
                                            ? "bg-red-50"
                                            : "bg-orange-50";
                                        const borderColor = isUrgent
                                            ? "border-red-100"
                                            : "border-orange-100";
                                        const textColor = isUrgent
                                            ? "text-red-600"
                                            : "text-orange-600";

                                        const getDaysLeftText = () => {
                                            if (daysLeft === 0) return "Aujourd'hui";
                                            if (daysLeft === 1) return "Demain";
                                            return `Dans ${daysLeft} jours`;
                                        };

                                        return (
                                            <button
                                                key={exam._id}
                                                type="button"
                                                className={`w-full text-left p-4 ${bgColor} rounded-xl border ${borderColor} hover:shadow-md transition-all duration-200 cursor-pointer`}
                                                onClick={() => {
                                                    if (exam.courseId) {
                                                        router.push(
                                                            `/library/${exam.courseId}`
                                                        );
                                                    } else {
                                                        router.push(`/library`);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        {exam.courseTitle ? (
                                                            <>
                                                                <span className="font-semibold text-gray-800 block truncate">
                                                                    {
                                                                        exam.courseTitle
                                                                    }
                                                                </span>
                                                                <span className="text-sm text-gray-700 block truncate">
                                                                    {exam.courseSubject &&
                                                                        `${exam.courseSubject} • `}
                                                                    {exam.title}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-semibold text-gray-800 block truncate">
                                                                {exam.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`${textColor} text-sm font-medium whitespace-nowrap flex-shrink-0`}
                                                    >
                                                        {getDaysLeftText()}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="md:col-span-1 lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-800">
                                        Cours Récents
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Tes derniers cours
                                    </p>
                                </div>
                            </div>
                            {(() => {
                                if (coursesLoading) {
                                    return (
                                        <div className="flex justify-center items-center py-8">
                                            <span className="text-gray-500 text-sm">
                                                Chargement...
                                            </span>
                                        </div>
                                    );
                                }

                                if (recentCourses.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                            <div className="p-3 bg-purple-50 rounded-2xl">
                                                <BookOpen className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 mb-1">
                                                    Aucun cours disponible
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Crée ton premier cours pour
                                                    commencer !
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {recentCourses.map(course => (
                                            <button
                                                key={course._id}
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/library/${course._id}`
                                                    )
                                                }
                                                className="w-full text-left p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 truncate">
                                                            {course.title}
                                                        </p>
                                                        <p className="text-gray-600 text-sm truncate">
                                                            {course.subject}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Objectives */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-800">
                                        Tes Objectifs
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Progresse vers tes buts
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-1">
                                        Objectifs non disponibles
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        La fonctionnalité de suivi des objectifs
                                        arrive bientôt !
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
