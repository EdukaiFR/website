"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { GraduationCap, Save, Plus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormErrorAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    educationSettingsSchema,
    type EducationSettingsFormValues,
    educationLevels,
    type EducationLevel,
} from "@/lib/schemas/user";
import { updateEducationAction } from "@/lib/actions/user";

export interface EducationSettingsProps {
    initialData?: EducationSettingsFormValues;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function EducationSettings({
    initialData,
    onSuccess,
    onError,
}: EducationSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomClass, setShowCustomClass] = useState(false);
    const [showCustomSpecialization, setShowCustomSpecialization] =
        useState(false);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
        setError,
        reset,
        setValue,
    } = useForm<EducationSettingsFormValues>({
        resolver: zodResolver(educationSettingsSchema),
        defaultValues: initialData || {
            educationLevel: "lycee",
            currentClass: "",
            specialization: "",
            customClassRequest: "",
            customSpecializationRequest: "",
        },
    });

    const selectedEducationLevel = watch("educationLevel");
    const customClassRequest = watch("customClassRequest");
    const customSpecializationRequest = watch("customSpecializationRequest");

    const onSubmit = async (data: EducationSettingsFormValues) => {
        setIsLoading(true);

        try {
            // Convert "none" back to empty string for submission
            const submitData = {
                ...data,
                specialization:
                    data.specialization === "none" ? "" : data.specialization,
            };

            const result = await updateEducationAction(submitData);

            if (result.success) {
                // Clear custom request fields after successful submission
                setValue("customClassRequest", "");
                setValue("customSpecializationRequest", "");
                setShowCustomClass(false);
                setShowCustomSpecialization(false);

                reset({
                    ...data,
                    customClassRequest: "",
                    customSpecializationRequest: "",
                });
                onSuccess?.();
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                setError("root", { message: errorMessage });
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error("Error updating education settings:", error);
            const errorMessage = "Une erreur inattendue est survenue";
            setError("root", { message: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getClassOptions = (level: EducationLevel) => {
        if (level === "superieur") {
            return educationLevels.superieur.cursus;
        }
        return educationLevels[level].classes;
    };

    const getSpecializationOptions = (level: EducationLevel) => {
        if (level === "lycee") {
            return educationLevels.lycee.specializations;
        }
        return [];
    };

    const handleCustomClassToggle = () => {
        setShowCustomClass(!showCustomClass);
        if (!showCustomClass) {
            setValue("currentClass", "custom");
        } else {
            setValue("currentClass", "");
            setValue("customClassRequest", "");
        }
    };

    const handleCustomSpecializationToggle = () => {
        setShowCustomSpecialization(!showCustomSpecialization);
        if (!showCustomSpecialization) {
            setValue("specialization", "custom");
        } else {
            setValue("specialization", "");
            setValue("customSpecializationRequest", "");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Informations d&apos;études
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Education Level */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Niveau d&apos;études
                        </label>
                        <Controller
                            name="educationLevel"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 ${
                                            errors.educationLevel
                                                ? "border-red-300"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <SelectValue placeholder="Sélectionnez votre niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(educationLevels).map(
                                            ([key, value]) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {value.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.educationLevel && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="w-4 h-4 text-xs">⚠</span>
                                {errors.educationLevel.message}
                            </p>
                        )}
                    </div>

                    {/* Current Class/Cursus */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                {selectedEducationLevel === "superieur"
                                    ? "Cursus actuel"
                                    : "Classe actuelle"}
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCustomClassToggle}
                                className="text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {showCustomClass ? "Annuler" : "Autre"}
                            </Button>
                        </div>

                        {!showCustomClass ? (
                            <Controller
                                name="currentClass"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 ${
                                                errors.currentClass
                                                    ? "border-red-300"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    selectedEducationLevel ===
                                                    "superieur"
                                                        ? "Sélectionnez votre cursus"
                                                        : "Sélectionnez votre classe"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getClassOptions(
                                                selectedEducationLevel
                                            ).map(option => (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    placeholder={`Décrivez votre ${
                                        selectedEducationLevel === "superieur"
                                            ? "cursus"
                                            : "classe"
                                    } personnalisé`}
                                    {...register("customClassRequest")}
                                    className="h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 border-gray-200"
                                />
                                {customClassRequest && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <Send className="w-4 h-4 inline mr-1" />
                                            Cette demande sera envoyée à nos
                                            équipes pour validation et ajout à
                                            notre système.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {errors.currentClass && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="w-4 h-4 text-xs">⚠</span>
                                {errors.currentClass.message}
                            </p>
                        )}
                    </div>

                    {/* Specialization (only for Lycée) */}
                    {selectedEducationLevel === "lycee" && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Spécialisation (optionnel)
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCustomSpecializationToggle}
                                    className="text-xs"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    {showCustomSpecialization
                                        ? "Annuler"
                                        : "Autre"}
                                </Button>
                            </div>

                            {!showCustomSpecialization ? (
                                <Controller
                                    name="specialization"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || "none"}
                                            onValueChange={value =>
                                                field.onChange(
                                                    value === "none"
                                                        ? ""
                                                        : value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 border-2 transition-all duration-200 focus:border-blue-500 border-gray-200">
                                                <SelectValue placeholder="Sélectionnez votre spécialisation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Aucune spécialisation
                                                </SelectItem>
                                                {getSpecializationOptions(
                                                    selectedEducationLevel
                                                ).map(spec => (
                                                    <SelectItem
                                                        key={spec}
                                                        value={spec}
                                                    >
                                                        {spec}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Décrivez votre spécialisation personnalisée"
                                        {...register(
                                            "customSpecializationRequest"
                                        )}
                                        className="h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 border-gray-200"
                                    />
                                    {customSpecializationRequest && (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                <Send className="w-4 h-4 inline mr-1" />
                                                Cette demande sera envoyée à nos
                                                équipes pour validation et ajout
                                                à notre système.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Information Box */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Pourquoi ces informations ?</strong>
                            <br />
                            Ces données nous permettent de personnaliser vos
                            questions et exercices selon votre niveau
                            d&apos;études et vos spécialisations.
                            {(customClassRequest ||
                                customSpecializationRequest) && (
                                <>
                                    <br />
                                    <br />
                                    <strong>
                                        📝 Demandes personnalisées :
                                    </strong>{" "}
                                    Vos demandes sont directement transmises à
                                    notre équipe pédagogique pour enrichir notre
                                    catalogue.
                                </>
                            )}
                        </p>
                    </div>

                    {/* Error Display */}
                    {errors.root && (
                        <FormErrorAlert
                            message={
                                errors.root.message || "Une erreur est survenue"
                            }
                        />
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="px-6 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sauvegarde...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {customClassRequest ||
                                    customSpecializationRequest
                                        ? "Sauvegarder et envoyer les demandes"
                                        : "Sauvegarder"}
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
