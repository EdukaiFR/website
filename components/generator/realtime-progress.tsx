"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGenerationProgress } from "@/hooks/useGenerationProgress";
import type { ProgressEventData, ProgressStep } from "@/lib/types/progress";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    FileText,
    Loader2,
    Sparkles,
    FileCheck,
    BookOpen,
    Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { ProgressBar } from "./progress-bar";
import { StepIndicator } from "./step-indicator";

interface RealtimeProgressProps {
    /** Job ID to track progress for */
    jobId: string | null;
    /** Course ID for navigation after completion */
    courseId?: string;
    /** Callback when user dismisses completion screen */
    onComplete?: (data: ProgressEventData | null) => void;
}

/**
 * Step configuration with icons and descriptions
 * Each step groups related backend steps for display purposes
 */
const PROGRESS_STEPS = [
    {
        id: 1,
        displaySteps: ["files_uploaded"] as ProgressStep[],
        icon: FileText,
        label: "Fichiers reçus",
        description: "Vos fichiers ont été analysés",
    },
    {
        id: 2,
        displaySteps: ["quiz_generating", "quiz_generated"] as ProgressStep[],
        icon: FileCheck,
        label: "Génération du quiz",
        description: "Création des questions intelligentes",
    },
    {
        id: 3,
        displaySteps: ["sheet_generating", "sheet_generated"] as ProgressStep[],
        icon: BookOpen,
        label: "Génération de la fiche",
        description: "Synthèse du contenu en cours",
    },
    {
        id: 4,
        displaySteps: ["linking_resources", "completed"] as ProgressStep[],
        icon: Link2,
        label: "Finalisation",
        description: "Association des ressources au cours",
    },
] as const;

/**
 * Order of steps for determining completion status
 */
const STEP_ORDER: ProgressStep[] = [
    "files_uploaded",
    "quiz_generating",
    "quiz_generated",
    "sheet_generating",
    "sheet_generated",
    "linking_resources",
    "completed",
];

/**
 * RealtimeProgress - Modern SSE-powered progress display
 *
 * Features:
 * - Real-time updates via Server-Sent Events
 * - Smooth animations and transitions
 * - Detailed step-by-step progress
 * - Error handling with retry capability
 * - Memoized for optimal performance
 */
export const RealtimeProgress = memo(function RealtimeProgress({
    jobId,
    courseId,
    onComplete: onCompleteCallback,
}: RealtimeProgressProps) {
    const router = useRouter();

    // Handle completion callback
    const handleComplete = useCallback(
        (data: ProgressEventData | null) => {
            onCompleteCallback?.(data);
        },
        [onCompleteCallback]
    );

    // Use SSE progress hook
    const { progress, message, step, isComplete, error, data, isConnected } =
        useGenerationProgress({
            jobId,
            onComplete: handleComplete,
        });

    // Navigate to course page
    const handleRedirect = useCallback(() => {
        if (courseId) {
            router.push(`/library/${courseId}`);
        }
    }, [courseId, router]);

    // Determine which steps are active/complete based on current backend step
    const stepStatuses = useMemo(() => {
        const currentStepOrderIndex = STEP_ORDER.indexOf(step as ProgressStep);

        return PROGRESS_STEPS.map(stepConfig => {
            // Find the latest step in this display group to determine completion
            const latestStepIndex = Math.max(
                ...stepConfig.displaySteps.map(s => STEP_ORDER.indexOf(s))
            );

            // Step is active if current step is within this group
            const isActive = stepConfig.displaySteps.includes(step as ProgressStep);

            // Step is complete if current step is past the latest step in this group
            const isComplete = currentStepOrderIndex > latestStepIndex;

            return {
                ...stepConfig,
                step: stepConfig.displaySteps[0], // Use first step for key
                isActive,
                isComplete,
            };
        });
    }, [step]);

    // Render error state
    if (error) {
        return (
            <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-red-50/30 to-orange-50/50">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm max-w-4xl mx-auto w-full">
                    <CardContent className="p-8">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Une erreur est survenue
                                </h3>
                                <p className="text-gray-600 mb-6">{error}</p>
                            </div>
                            <Button
                                onClick={() => router.push("/generate")}
                                variant="outline"
                                className="h-12"
                            >
                                Réessayer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render completion state
    if (isComplete) {
        return (
            <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-green-50/30 to-emerald-50/50">
                {/* Success Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                Terminé !
                            </div>
                        </div>
                        <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                            Génération terminée !
                        </h1>
                        <p className="text-green-100 text-base lg:text-lg max-w-2xl">
                            Votre cours a été généré avec succès ! Cliquez
                            ci-dessous pour l'explorer.
                        </p>
                    </div>
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 right-8 w-20 h-20 bg-emerald-300/20 rounded-full blur-lg"></div>
                </div>

                {/* Success Card */}
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm max-w-4xl mx-auto w-full">
                    <CardContent className="p-8">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Cours généré avec succès !
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Votre cours personnalisé est prêt. Vous
                                    pouvez maintenant commencer à apprendre !
                                </p>
                                {data?.quizId && (
                                    <p className="text-sm text-green-600 mb-1">
                                        ✓ Quiz généré avec succès
                                    </p>
                                )}
                                {data?.sheetId && (
                                    <p className="text-sm text-green-600">
                                        ✓ Fiche de révision créée
                                    </p>
                                )}
                            </div>
                            <Button
                                onClick={handleRedirect}
                                className="h-12 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={!courseId}
                            >
                                Voir mon cours
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render progress state
    return (
        <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
            {/* Modern Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Sparkles className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                            {isConnected ? (
                                <>
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Connexion...
                                </>
                            )}
                        </div>
                    </div>
                    <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                        Génération de votre cours
                    </h1>
                    <p className="text-blue-100 text-base lg:text-lg max-w-2xl">
                        {message ||
                            "Notre IA analyse vos documents et génère votre cours personnalisé."}
                    </p>
                </div>
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
            </div>

            {/* Progress Card */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm max-w-4xl mx-auto w-full">
                <CardContent className="p-8 space-y-8">
                    {/* Progress Bar */}
                    <ProgressBar
                        value={progress}
                        label="Progression globale"
                        showPercentage
                    />

                    {/* Step Indicators */}
                    <div className="space-y-3">
                        {stepStatuses.map(stepStatus => (
                            <StepIndicator
                                key={stepStatus.step}
                                icon={stepStatus.icon}
                                label={stepStatus.label}
                                description={stepStatus.description}
                                active={stepStatus.isActive}
                                complete={stepStatus.isComplete}
                            />
                        ))}
                    </div>

                    {/* Loading Message */}
                    <div className="text-center text-gray-500 text-sm pt-4">
                        <p className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Veuillez patienter pendant que nous créons votre
                            cours personnalisé...
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});
