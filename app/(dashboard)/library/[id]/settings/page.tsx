"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/course/Header";
import { LoadingState } from "@/components/course/components";
import { useCourseLogic } from "@/hooks/course";
import { useCourseService } from "@/services";
import { ArrowLeft, Globe, Lock, Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CourseSettingsPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const { courseData, setSelectedTab, selectedTab } = useCourseLogic();
    const [saving, setSaving] = useState(false);
    const [isShared, setIsShared] = useState(false);

    const { toggleShare } = useCourseService();

    // Initialize isShared from courseData
    useEffect(() => {
        if (courseData) {
            setIsShared(courseData.isShared || false);

            // Redirect if not owner
            if (courseData.isOwner === false) {
                toast.error("Vous n'avez pas accès à cette page");
                router.push(`/library/${courseId}`);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseData]);

    const handleSave = async () => {
        if (!courseData) return;

        // Only save if changed
        if (isShared === courseData.isShared) {
            toast.info("Aucune modification à enregistrer");
            return;
        }

        setSaving(true);
        try {
            const response = await toggleShare(courseId);

            if (response.status === "success") {
                toast.success(
                    isShared
                        ? "Cours rendu public avec succès !"
                        : "Cours rendu privé avec succès !"
                );
                // Reload the page to refresh course data
                window.location.reload();
            } else {
                // Revert on error
                setIsShared(courseData.isShared || false);
                toast.error(
                    response.message || "Erreur lors de la modification"
                );
            }
        } catch (error) {
            console.error("Error toggling share:", error);
            setIsShared(courseData.isShared || false);
            toast.error("Une erreur est survenue");
        } finally {
            setSaving(false);
        }
    };

    if (!courseData) {
        return <LoadingState />;
    }

    const hasChanges = isShared !== courseData.isShared;

    return (
        <div className="course-content flex flex-col gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 w-full max-w-full">
            {/* Course Header */}
            <Header
                courseData={courseData}
                setSelectedTab={setSelectedTab}
                selectedTab={selectedTab}
            />

            {/* Back Button */}
            <div className="mt-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/library/${courseId}`)}
                    className="hover:bg-white/50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au cours
                </Button>
            </div>

            {/* Settings Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="space-y-8">
                    {/* Settings Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Paramètres du cours
                        </h1>
                    </div>
                    {/* Visibility Section */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Visibilité du cours
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Contrôlez qui peut voir votre cours
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${
                                        isShared
                                            ? "bg-green-100"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    {isShared ? (
                                        <Globe className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Lock className="w-5 h-5 text-gray-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {isShared ? "Public" : "Privé"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {isShared
                                            ? "Visible dans le Club Edukai"
                                            : "Uniquement visible par vous"}
                                    </p>
                                </div>
                            </div>

                            {/* Custom Slider */}
                            <button
                                onClick={() => setIsShared(!isShared)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isShared ? "bg-blue-600" : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                        isShared
                                            ? "translate-x-7"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900 font-medium mb-2">
                                ℹ️ À propos de la visibilité publique
                            </p>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>
                                    Les cours publics apparaissent dans le Club
                                    Edukai
                                </li>
                                <li>
                                    Les utilisateurs peuvent consulter le cours
                                    en lecture seule
                                </li>
                                <li>
                                    Vous restez le seul propriétaire et pouvez
                                    modifier le cours
                                </li>
                                <li>
                                    Vous pouvez repasser en privé à tout moment
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Save Button */}
                    {hasChanges && (
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                variant="outline"
                                onClick={() => setIsShared(courseData.isShared || false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Enregistrer
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
