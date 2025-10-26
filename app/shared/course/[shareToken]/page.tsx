"use client";

import { Button } from "@/components/ui/button";
import { useCourseService } from "@/services";
import {
    ArrowLeft,
    BookmarkPlus,
    BookOpen,
    Calendar,
    FileText,
    Loader2,
    Share2,
    User,
    XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SharedCourse {
    _id: string;
    title: string;
    subject: string;
    level: string;
    author: {
        firstName: string;
        lastName: string;
        username: string;
    };
    createdAt: string;
    summarySheets: unknown[];
    quizzes: unknown[];
    exams: unknown[];
}

export default function SharedCoursePage() {
    const params = useParams();
    const router = useRouter();
    const shareToken = params.shareToken as string;

    const [course, setCourse] = useState<SharedCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);

    const { getSharedCourse, duplicateSharedCourse } = useCourseService();

    useEffect(() => {
        async function fetchSharedCourse() {
            try {
                setLoading(true);
                const response = await getSharedCourse(shareToken);

                if (response.status === "success") {
                    setCourse(response.item);
                } else {
                    setError(
                        response.message || "Le cours partagé n'a pas été trouvé."
                    );
                }
            } catch {
                setError("Une erreur est survenue lors du chargement.");
            } finally {
                setLoading(false);
            }
        }

        if (shareToken) {
            fetchSharedCourse();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shareToken]);

    const handleAddToLibrary = async () => {
        try {
            setIsAddingToLibrary(true);
            const response = await duplicateSharedCourse(shareToken);

            if (response.status === "success") {
                toast.success("Cours ajouté à votre bibliothèque !");
                // Rediriger vers la bibliothèque
                setTimeout(() => {
                    router.push("/library");
                }, 1500);
            } else {
                if (response.message?.includes("logged in")) {
                    toast.error(
                        "Vous devez être connecté pour ajouter ce cours à votre bibliothèque."
                    );
                    // Redirect to login page
                    setTimeout(() => {
                        router.push(`/login?redirect=/shared/course/${shareToken}`);
                    }, 1500);
                } else {
                    toast.error(response.message || "Erreur lors de l'ajout");
                }
            }
        } catch {
            toast.error("Une erreur est survenue");
        } finally {
            setIsAddingToLibrary(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement du cours...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="p-4 bg-red-50 rounded-2xl w-fit mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Cours introuvable
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            "Le cours partagé n&apos;existe pas ou le lien a été révoqué."}
                    </p>
                    <Button onClick={() => router.push("/")} className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à l&apos;accueil
                    </Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border-0">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                                    {course.title}
                                </h1>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        Par {course.author.firstName}{" "}
                                        {course.author.lastName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(course.createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        {course.subject}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                        {course.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={handleAddToLibrary}
                                disabled={isAddingToLibrary}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                            >
                                {isAddingToLibrary ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Ajout en cours...
                                    </>
                                ) : (
                                    <>
                                        <BookmarkPlus className="w-4 h-4 mr-2" />
                                        Ajouter à ma bibliothèque
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Share2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Cours partagé publiquement
                                    </p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Vous pouvez ajouter ce cours à votre
                                        bibliothèque pour accéder à tout son contenu.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Fiches de révision */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">
                                Fiches de révision
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">
                            {course.summarySheets?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {course.summarySheets?.length === 0
                                ? "Aucune fiche"
                                : course.summarySheets?.length === 1
                                ? "fiche disponible"
                                : "fiches disponibles"}
                        </p>
                    </div>

                    {/* Quizzes */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">
                                Quizzes
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">
                            {course.quizzes?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {course.quizzes?.length === 0
                                ? "Aucun quiz"
                                : course.quizzes?.length === 1
                                ? "quiz disponible"
                                : "quizzes disponibles"}
                        </p>
                    </div>

                    {/* Examens */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">
                                Examens
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            {course.exams?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {course.exams?.length === 0
                                ? "Aucun examen"
                                : course.exams?.length === 1
                                ? "examen disponible"
                                : "examens disponibles"}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Créé avec{" "}
                        <a
                            href="https://edukai.fr"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Edukai
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
