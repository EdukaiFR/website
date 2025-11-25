"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageLoadingSkeleton } from "@/components/ui/stat-card-skeleton";
import { useUserProfile } from "@/contexts/UserContext";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { getImageDisplaySrc } from "@/lib/image-utils";
import type { InsightItem } from "@/lib/types/insights";
import { formatFullDate } from "@/lib/utils/date";
import { useCourseService } from "@/services";
import { useInsightsService } from "@/services/insights";
import {
    BookOpen,
    Crown,
    GraduationCap,
    Mail,
    Target,
    Trophy,
    Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface CourseData {
    _id: string;
    title: string;
    subject: string;
    level: string;
    createdAt?: string;
    updatedAt?: string;
}

interface QuizData {
    _id: string;
    title?: string;
    courseId?: string;
    createdAt?: string;
}

export default function ProfilePage() {
    const { userProfile, loading } = useUserProfile();

    const courseService = useCourseService();
    const insightsService = useInsightsService();

    const [courses, setCourses] = useState<CourseData[]>([]);
    const [insights, setInsights] = useState<InsightItem[]>([]);
    const [allQuizzes, setAllQuizzes] = useState<QuizData[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);

                // Fetch courses
                const coursesResponse = await courseService.getCourses();
                if (
                    coursesResponse &&
                    "items" in coursesResponse &&
                    Array.isArray(coursesResponse.items)
                ) {
                    const coursesData = coursesResponse.items as CourseData[];
                    setCourses(coursesData || []);

                    // Fetch all quizzes from all courses
                    const quizzesPromises = coursesData.map(async course => {
                        try {
                            if (!course?._id) {
                                return [];
                            }
                            const quizzesResponse =
                                await courseService.getCourseQuizzes(course._id);
                            if (
                                quizzesResponse &&
                                "items" in quizzesResponse &&
                                Array.isArray(quizzesResponse.items)
                            ) {
                                return quizzesResponse.items as QuizData[];
                            }
                            return [];
                        } catch {
                            return [];
                        }
                    });

                    const quizzesArrays = await Promise.all(quizzesPromises);
                    const allQuizzesFlat = quizzesArrays.flat();
                    setAllQuizzes(allQuizzesFlat);
                }

                // Fetch insights (quiz results)
                try {
                    const insightsResponse =
                        await insightsService.getAllMyInsights();

                    // Check if response has items array (API returns {items: [...], message: '...', status: '...'})
                    if (
                        insightsResponse &&
                        "items" in insightsResponse &&
                        Array.isArray(insightsResponse.items)
                    ) {
                        const insightsData = insightsResponse.items as InsightItem[];
                        setInsights(insightsData);
                    } else if (Array.isArray(insightsResponse)) {
                        // Fallback: if response is directly an array
                        setInsights(insightsResponse);
                    } else {
                        setInsights([]);
                    }
                } catch {
                    setInsights([]);
                }
            } catch {
                // Error fetching stats
            } finally {
                setStatsLoading(false);
            }
        };

        if (!loading && userProfile) {
            fetchStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, userProfile]);

    // Use shared statistics hook (same as /stats page)
    const userStats = useUserStatistics(insights);

    // Calculate additional profile-specific stats
    const profileStats = useMemo(() => {
        const totalCourses = courses.length;
        const totalQuizzes = allQuizzes.length;

        return {
            totalCourses,
            totalQuizzes,
        };
    }, [courses, allQuizzes]);

    // Determine the display name
    const getDisplayName = useCallback(() => {
        if (!userProfile) return "";

        if (
            userProfile.username.includes("@") ||
            userProfile.username === userProfile.email
        ) {
            return `${userProfile.firstName} ${userProfile.lastName}`;
        }

        return userProfile.username;
    }, [userProfile]);

    // Get user initials for avatar fallback
    const getInitials = useCallback(() => {
        if (!userProfile) return "U";

        const displayName = getDisplayName();
        return displayName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }, [userProfile, getDisplayName]);

    const getPlanBadge = useCallback(() => {
        const plan = userProfile?.accountPlan || "free";
        const badges = {
            free: { label: "Gratuit", color: "bg-gray-500", icon: Crown },
            pro: { label: "Pro", color: "bg-blue-500", icon: Crown },
            premium: { label: "Premium", color: "bg-gradient-to-r from-yellow-500 to-amber-600 shadow-lg", icon: Crown },
        };
        return badges[plan as keyof typeof badges] || badges.free;
    }, [userProfile]);

    if (loading || statsLoading) {
        return <PageLoadingSkeleton />;
    }

    const getScoreColor = (score: number): string => {
        if (score >= 80) return "bg-green-100 text-green-700";
        if (score >= 60) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Header Section */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <div className="flex flex-col items-center text-center">
                        {/* Profile Picture */}
                        <Avatar className="w-20 h-20 mb-4 border-4 border-white/30 shadow-xl">
                            <AvatarImage
                                src={getImageDisplaySrc(userProfile?.profilePic)}
                                alt={getDisplayName()}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-white text-2xl font-bold">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Name with Plan Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-3xl font-bold">
                                {loading ? (
                                    <span className="inline-block animate-pulse bg-white/30 rounded h-10 w-48"></span>
                                ) : (
                                    getDisplayName()
                                )}
                            </h1>
                            {!loading && (
                                <div
                                    className={`${getPlanBadge().color} px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1.5`}
                                >
                                    <Crown className="w-4 h-4" />
                                    {getPlanBadge().label}
                                </div>
                            )}
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* Email Badge */}
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">
                                    {loading ? "..." : userProfile?.email}
                                </span>
                            </div>

                            {/* Level Badge */}
                            {userProfile?.levelOfStudy && (
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="text-sm">
                                        {userProfile.levelOfStudy}
                                        {userProfile.grade &&
                                            ` - ${userProfile.grade}`}
                                    </span>
                                </div>
                            )}

                            {/* Institution Badge */}
                            {userProfile?.institution && (
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm">
                                        {userProfile.institution}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg
                        className="w-full h-12 text-white"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 120"
                        fill="currentColor"
                    >
                        <path d="M0,120 C240,60 480,60 720,80 C960,100 1200,40 1440,60 L1440,120 Z" />
                    </svg>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-12">
                {/* Statistics Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Mes Statistiques
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Courses */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {statsLoading ? "..." : profileStats.totalCourses}
                            </div>
                            <div className="text-sm text-gray-600">
                                Cours Générés
                            </div>
                        </div>

                        {/* Total Quizzes */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-purple-200">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {statsLoading ? "..." : profileStats.totalQuizzes}
                            </div>
                            <div className="text-sm text-gray-600">
                                Quiz Créés
                            </div>
                        </div>

                        {/* Average Score */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-green-200">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {userStats.totalQuizzes > 0
                                    ? `${userStats.averageScore}%`
                                    : "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                                Score Moyen
                            </div>
                        </div>

                        {/* Best Score */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-200">
                                    <Trophy className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {userStats.totalQuizzes > 0
                                    ? `${userStats.bestScore}%`
                                    : "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                                Meilleur Score
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                {!statsLoading && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Activité Récente
                        </h2>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            {userStats.totalQuizzes > 0 ? (
                                <div className="space-y-4">
                                    {insights
                                        .filter(insight => insight?.createdAt && insight?._id)
                                        .sort(
                                            (a, b) =>
                                                new Date(b.createdAt).getTime() -
                                                new Date(a.createdAt).getTime()
                                        )
                                        .slice(0, 5)
                                        .map((insight) => (
                                            <div
                                                key={insight._id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Zap className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            Quiz Complété
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatFullDate(
                                                                insight.createdAt
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(
                                                        insight.score || 0
                                                    )}`}
                                                >
                                                    {Math.round(insight.score || 0)}%
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Zap className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Aucune activité pour le moment
                                    </h3>
                                    <p className="text-sm text-gray-600 text-center max-w-md">
                                        Commence à faire des quiz pour voir ton activité ici !
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
