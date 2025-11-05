"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { GraduationCap, School, Building2, Save } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersistentAlert } from "@/components/ui/persistent-alert";
import {
    educationSettingsSchema,
    type EducationSettingsFormValues,
} from "@/lib/schemas/user";
import { updateEducationAction } from "@/lib/actions/user";

export interface EducationSettingsProps {
    initialData?: EducationSettingsFormValues;
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function EducationSettings({
    initialData,
    userId,
    onSuccess,
    onError,
}: EducationSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [persistentError, setPersistentError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<EducationSettingsFormValues>({
        resolver: zodResolver(educationSettingsSchema),
        defaultValues: initialData || {
            grade: "",
            levelOfStudy: "",
            institution: "",
        },
    });

    const onSubmit = async (data: EducationSettingsFormValues) => {
        setIsLoading(true);
        setPersistentError(null);

        try {
            const result = await updateEducationAction(data, userId);

            if (result.success) {
                reset(data);
                onSuccess?.();
                setPersistentError(null);
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                setPersistentError(errorMessage);
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error("Error updating education:", error);
            const errorMessage = "Une erreur inattendue est survenue";
            setPersistentError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                    <GraduationCap className="w-5 h-5" />
                    Informations d&apos;études
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Persistent Error Alert */}
                {persistentError && (
                    <PersistentAlert
                        type="error"
                        message={persistentError}
                        title="Erreur lors de la mise à jour"
                        onDismiss={() => setPersistentError(null)}
                    />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Grade Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="grade"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <School className="w-4 h-4" />
                            Classe/Grade *
                        </label>
                        <Input
                            id="grade"
                            type="text"
                            placeholder="Ex: Terminale, Licence 3, Master 1..."
                            {...register("grade")}
                            className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                                errors.grade
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-200"
                            }`}
                        />
                        {errors.grade && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="w-4 h-4 text-xs">⚠</span>
                                {errors.grade.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Votre classe actuelle ou niveau d&apos;études (ex:
                            Terminale S, L3 Informatique, M1 Finance).
                        </p>
                    </div>

                    {/* Level of Study Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="levelOfStudy"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <GraduationCap className="w-4 h-4" />
                            Niveau d&apos;études *
                        </label>
                        <Input
                            id="levelOfStudy"
                            type="text"
                            placeholder="Ex: Lycée, Université, École d'ingénieur..."
                            {...register("levelOfStudy")}
                            className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                                errors.levelOfStudy
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-200"
                            }`}
                        />
                        {errors.levelOfStudy && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="w-4 h-4 text-xs">⚠</span>
                                {errors.levelOfStudy.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Type d&apos;établissement ou niveau général (ex:
                            Lycée, Université, École supérieure).
                        </p>
                    </div>

                    {/* Institution Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="institution"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <Building2 className="w-4 h-4" />
                            Établissement (optionnel)
                        </label>
                        <Input
                            id="institution"
                            type="text"
                            placeholder="Ex: Lycée Voltaire, Université Paris-Saclay..."
                            {...register("institution")}
                            className="h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 border-gray-200"
                        />
                        <p className="text-xs text-gray-500">
                            Nom de votre établissement scolaire ou
                            universitaire.
                        </p>
                    </div>

                    {/* Educational Information */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Aide :</strong> Ces informations
                                    nous aident à personnaliser votre expérience
                                    et à vous proposer du contenu adapté à votre
                                    niveau d&apos;études.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Errors */}
                    {errors.root && (
                        <PersistentAlert
                            type="error"
                            message={
                                errors.root.message ||
                                "Une erreur s'est produite"
                            }
                            title="Erreur de validation"
                        />
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="px-6 h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sauvegarde...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Sauvegarder
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
