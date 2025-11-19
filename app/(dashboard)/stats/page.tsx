"use client";

import { useInsightsService } from "@/services/insights";
import { useCourseService } from "@/services";
import {
    BarChart3,
    BookOpen,
    Calendar,
    Target,
    TrendingDown,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface InsightData {
    _id: string;
    quizId: string | { _id: string; id?: string };
    score: number;
    userId: string;
    createdAt: string;
}

interface CourseData {
    _id: string;
    title: string;
    subject: string;
}

interface QuizData {
    _id: string;
    courseId?: string;
}

type TimePeriod = "7days" | "30days" | "year" | "lifetime";

export default function StatsPage() {
    const insightsService = useInsightsService();
    const courseService = useCourseService();
    const [insights, setInsights] = useState<InsightData[]>([]);
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [quizToCourseMap, setQuizToCourseMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30days");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch insights
                const insightsResponse =
                    await insightsService.getAllMyInsights();

                if (insightsResponse && Array.isArray(insightsResponse)) {
                    setInsights(insightsResponse);
                } else if (insightsResponse && "items" in insightsResponse) {
                    setInsights(insightsResponse.items as InsightData[]);
                } else {
                    setInsights([]);
                }

                // Fetch courses and build quiz-to-course mapping
                const coursesResponse = await courseService.getCourses();
                if (coursesResponse && "items" in coursesResponse && Array.isArray(coursesResponse.items)) {
                    const coursesData = coursesResponse.items as CourseData[];
                    setCourses(coursesData);

                    // Build mapping: quizId -> courseId
                    const mapping: Record<string, string> = {};

                    for (const course of coursesData) {
                        try {
                            if (!course?._id) continue;

                            const quizzesResponse = await courseService.getCourseQuizzes(course._id);
                            if (
                                quizzesResponse &&
                                "items" in quizzesResponse &&
                                Array.isArray(quizzesResponse.items)
                            ) {
                                const quizzes = quizzesResponse.items as QuizData[];
                                quizzes.forEach(quiz => {
                                    if (quiz?._id) {
                                        mapping[quiz._id] = course._id;
                                    }
                                });
                            }
                        } catch (error) {
                            console.error(`Error fetching quizzes for course ${course._id}:`, error);
                        }
                    }

                    setQuizToCourseMap(mapping);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setInsights([]);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter insights by selected period
    const filteredInsights = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();

        return insights.filter(insight => {
            if (!insight?.createdAt) return false;

            const insightDate = new Date(insight.createdAt);

            switch (selectedPeriod) {
                case "7days":
                    const sevenDaysAgo = new Date(now);
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    return insightDate >= sevenDaysAgo;

                case "30days":
                    const thirtyDaysAgo = new Date(now);
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    return insightDate >= thirtyDaysAgo;

                case "year":
                    return insightDate.getFullYear() === currentYear;

                case "lifetime":
                default:
                    return true;
            }
        });
    }, [insights, selectedPeriod]);

    // Calculate statistics
    const stats = useMemo(() => {
        const validScores = filteredInsights
            .map(insight => insight?.score)
            .filter(
                (score): score is number =>
                    typeof score === "number" && !isNaN(score)
            );

        const totalQuizzes = filteredInsights.length;
        const averageScore =
            validScores.length > 0
                ? Math.round(
                      validScores.reduce((sum, score) => sum + score, 0) /
                          validScores.length
                  )
                : 0;
        const bestScore =
            validScores.length > 0 ? Math.round(Math.max(...validScores)) : 0;
        const worstScore =
            validScores.length > 0 ? Math.round(Math.min(...validScores)) : 0;

        // Success rates
        const excellent = validScores.filter(score => score >= 90).length;
        const good = validScores.filter(score => score >= 70 && score < 90)
            .length;
        const average = validScores.filter(score => score >= 50 && score < 70)
            .length;
        const poor = validScores.filter(score => score < 50).length;

        // Trend calculation (compare first half vs second half)
        let trend: "up" | "down" | "stable" = "stable";
        if (validScores.length >= 4) {
            const midPoint = Math.floor(validScores.length / 2);
            const firstHalfAvg =
                validScores.slice(0, midPoint).reduce((a, b) => a + b, 0) /
                midPoint;
            const secondHalfAvg =
                validScores.slice(midPoint).reduce((a, b) => a + b, 0) /
                (validScores.length - midPoint);

            if (secondHalfAvg > firstHalfAvg + 5) trend = "up";
            else if (secondHalfAvg < firstHalfAvg - 5) trend = "down";
        }

        // Calculate scores by course
        const courseScores: Record<string, { scores: number[]; courseData: CourseData | null }> = {};

        console.log("🔍 Quiz to Course Map:", quizToCourseMap);
        console.log("🔍 Filtered Insights:", filteredInsights);
        console.log("🔍 Courses:", courses);

        filteredInsights.forEach(insight => {
            if (!insight?.quizId || !insight?.score) {
                console.log("⚠️ Skipping insight (no quizId or score):", insight);
                return;
            }

            // Extract quizId - it might be an object with _id or a string
            const quizId = typeof insight.quizId === 'string'
                ? insight.quizId
                : insight.quizId?._id || insight.quizId?.id;

            if (!quizId) {
                console.log("⚠️ Could not extract quizId from:", insight.quizId);
                return;
            }

            const courseId = quizToCourseMap[quizId];
            if (!courseId) {
                console.log(`⚠️ No course found for quiz ${quizId}`);
                return;
            }

            if (!courseScores[courseId]) {
                courseScores[courseId] = {
                    scores: [],
                    courseData: courses.find(c => c._id === courseId) || null,
                };
            }

            courseScores[courseId].scores.push(insight.score);
        });

        console.log("📊 Course Scores:", courseScores);

        // Calculate average scores per course and find best/worst
        const coursesWithAvg = Object.entries(courseScores)
            .map(([courseId, data]) => {
                const avgScore = data.scores.length > 0
                    ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
                    : 0;

                return {
                    courseId,
                    courseData: data.courseData,
                    avgScore,
                    quizCount: data.scores.length,
                };
            })
            .filter(course => course.quizCount > 0); // Only courses with completed quizzes

        const bestCourse = coursesWithAvg.length > 0
            ? coursesWithAvg.reduce((best, current) =>
                  current.avgScore > best.avgScore ? current : best
              )
            : null;

        const worstCourse = coursesWithAvg.length > 0
            ? coursesWithAvg.reduce((worst, current) =>
                  current.avgScore < worst.avgScore ? current : worst
              )
            : null;

        console.log("✅ Best Course:", bestCourse);
        console.log("✅ Worst Course:", worstCourse);
        console.log("✅ Courses with avg:", coursesWithAvg);

        return {
            totalQuizzes,
            averageScore,
            bestScore,
            worstScore,
            excellent,
            good,
            average,
            poor,
            trend,
            bestCourse,
            worstCourse,
        };
    }, [filteredInsights, quizToCourseMap, courses]);

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case "7days":
                return "7 derniers jours";
            case "30days":
                return "30 derniers jours";
            case "year":
                return `Année ${new Date().getFullYear()}`;
            case "lifetime":
                return "À vie";
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Header Section */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold mb-2">
                            Mes Statistiques
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Analyse détaillée de vos performances
                        </p>
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
                {/* Period Filter */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Période
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { value: "7days" as TimePeriod, label: "7 jours" },
                            { value: "30days" as TimePeriod, label: "30 jours" },
                            {
                                value: "year" as TimePeriod,
                                label: `${new Date().getFullYear()}`,
                            },
                            { value: "lifetime" as TimePeriod, label: "À vie" },
                        ].map(period => (
                            <button
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    selectedPeriod === period.value
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-gray-500">
                            Chargement des statistiques...
                        </div>
                    </div>
                ) : filteredInsights.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucune donnée pour {getPeriodLabel()}
                        </h3>
                        <p className="text-gray-600">
                            Complétez des quiz pour voir vos statistiques ici !
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Quizzes */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stats.totalQuizzes}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Quiz Complétés
                                </div>
                            </div>

                            {/* Average Score */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-blue-600" />
                                    </div>
                                    {stats.trend !== "stable" && (
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                                stats.trend === "up"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {stats.trend === "up" ? (
                                                <TrendingUp className="w-3 h-3" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3" />
                                            )}
                                            {stats.trend === "up"
                                                ? "En hausse"
                                                : "En baisse"}
                                        </div>
                                    )}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stats.averageScore}%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Score Moyen
                                </div>
                            </div>

                            {/* Best Score */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stats.bestScore}%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Meilleur Score
                                </div>
                            </div>

                            {/* Worst Score */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <TrendingDown className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stats.worstScore}%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Score le Plus Bas
                                </div>
                            </div>
                        </div>

                        {/* Performance Distribution */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Répartition des Performances
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Excellent */}
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-900">
                                            Excellent (≥90%)
                                        </span>
                                        <Trophy className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-green-900">
                                        {stats.excellent}
                                    </div>
                                    <div className="text-xs text-green-700 mt-1">
                                        {stats.totalQuizzes > 0
                                            ? Math.round(
                                                  (stats.excellent /
                                                      stats.totalQuizzes) *
                                                      100
                                              )
                                            : 0}
                                        % des quiz
                                    </div>
                                </div>

                                {/* Good */}
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-900">
                                            Bien (70-89%)
                                        </span>
                                        <Target className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-900">
                                        {stats.good}
                                    </div>
                                    <div className="text-xs text-blue-700 mt-1">
                                        {stats.totalQuizzes > 0
                                            ? Math.round(
                                                  (stats.good /
                                                      stats.totalQuizzes) *
                                                      100
                                              )
                                            : 0}
                                        % des quiz
                                    </div>
                                </div>

                                {/* Average */}
                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-yellow-900">
                                            Moyen (50-69%)
                                        </span>
                                        <BarChart3 className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-900">
                                        {stats.average}
                                    </div>
                                    <div className="text-xs text-yellow-700 mt-1">
                                        {stats.totalQuizzes > 0
                                            ? Math.round(
                                                  (stats.average /
                                                      stats.totalQuizzes) *
                                                      100
                                              )
                                            : 0}
                                        % des quiz
                                    </div>
                                </div>

                                {/* Poor */}
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-red-900">
                                            À améliorer (&lt;50%)
                                        </span>
                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-red-900">
                                        {stats.poor}
                                    </div>
                                    <div className="text-xs text-red-700 mt-1">
                                        {stats.totalQuizzes > 0
                                            ? Math.round(
                                                  (stats.poor /
                                                      stats.totalQuizzes) *
                                                      100
                                              )
                                            : 0}
                                        % des quiz
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Best and Worst Courses */}
                        {(stats.bestCourse || stats.worstCourse) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Best Course */}
                                {stats.bestCourse && (
                                    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                                <Trophy className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Cours le Mieux Réussi
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Meilleur score moyen
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-green-200">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <BookOpen className="w-5 h-5 text-green-600" />
                                                        <h4 className="font-semibold text-gray-900">
                                                            {stats.bestCourse.courseData?.title || "Cours inconnu"}
                                                        </h4>
                                                    </div>
                                                    {stats.bestCourse.courseData?.subject && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {stats.bestCourse.courseData.subject}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        {stats.bestCourse.quizCount} quiz complété{stats.bestCourse.quizCount > 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="text-3xl font-bold text-green-600">
                                                        {stats.bestCourse.avgScore}%
                                                    </div>
                                                    <div className="text-xs text-gray-600 text-center">
                                                        Score moyen
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Worst Course */}
                                {stats.worstCourse && stats.worstCourse.courseId !== stats.bestCourse?.courseId && (
                                    <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 shadow-lg border border-orange-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                                <Target className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Cours à Améliorer
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Score le plus bas
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-orange-200">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <BookOpen className="w-5 h-5 text-orange-600" />
                                                        <h4 className="font-semibold text-gray-900">
                                                            {stats.worstCourse.courseData?.title || "Cours inconnu"}
                                                        </h4>
                                                    </div>
                                                    {stats.worstCourse.courseData?.subject && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {stats.worstCourse.courseData.subject}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        {stats.worstCourse.quizCount} quiz complété{stats.worstCourse.quizCount > 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="text-3xl font-bold text-orange-600">
                                                        {stats.worstCourse.avgScore}%
                                                    </div>
                                                    <div className="text-xs text-gray-600 text-center">
                                                        Score moyen
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Historique Récent
                            </h3>
                            <div className="space-y-3">
                                {filteredInsights
                                    .filter(
                                        insight =>
                                            insight?.createdAt && insight?._id
                                    )
                                    .sort(
                                        (a, b) =>
                                            new Date(b.createdAt).getTime() -
                                            new Date(a.createdAt).getTime()
                                    )
                                    .slice(0, 10)
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
                                                        {new Date(
                                                            insight.createdAt
                                                        ).toLocaleDateString(
                                                            "fr-FR",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}{" "}
                                                        à{" "}
                                                        {new Date(
                                                            insight.createdAt
                                                        ).toLocaleTimeString(
                                                            "fr-FR",
                                                            {
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`px-4 py-2 rounded-full font-semibold ${
                                                    (insight.score || 0) >= 90
                                                        ? "bg-green-100 text-green-700"
                                                        : (insight.score || 0) >= 70
                                                          ? "bg-blue-100 text-blue-700"
                                                          : (insight.score || 0) >= 50
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {Math.round(insight.score || 0)}%
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
