"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, GraduationCap, Save, School } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PersistentAlert } from "@/components/ui/persistent-alert";
import { updateEducationAction } from "@/lib/actions/user";
import {
    educationSettingsSchema,
    type EducationSettingsFormValues,
} from "@/lib/schemas/user";

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
        <Card className="bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative border-b border-gray-100/50 bg-gradient-to-r from-blue-50/30 to-transparent pb-6">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-md">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    Informations d'études
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2 ml-12">
                    Personnalisez votre expérience selon votre niveau
                </p>
            </CardHeader>
            <CardContent className="space-y-6 relative">
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
                            Votre classe actuelle ou niveau d'études (ex:
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
                            Niveau d'études *
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
                            Type d'établissement ou niveau général (ex: Lycée,
                            Université, École supérieure).
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
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 p-5 rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                    Pourquoi ces informations ?
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Ces informations nous aident à personnaliser
                                    votre expérience et à vous proposer du
                                    contenu adapté à votre niveau d'études.
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
                    <div className="flex justify-end pt-6 border-t border-gray-100/50">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="px-8 h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sauvegarde en cours...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    Sauvegarder les modifications
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
