"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { User, AtSign, Save } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersistentAlert } from "@/components/ui/persistent-alert";
import { ProfilePictureUpload } from "./profile-picture-upload";
import {
    profileSettingsSchema,
    type ProfileSettingsFormValues,
} from "@/lib/schemas/user";
import { updateProfileAction } from "@/lib/actions/user";

export interface ProfileSettingsProps {
    initialData?: ProfileSettingsFormValues & { email?: string };
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function ProfileSettings({
    initialData,
    userId,
    onSuccess,
    onError,
}: ProfileSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [persistentError, setPersistentError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
        setValue,
    } = useForm<ProfileSettingsFormValues>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: initialData || {
            firstName: "",
            lastName: "",
            username: "",
            profilePic: "",
        },
    });

    const onSubmit = async (data: ProfileSettingsFormValues) => {
        setIsLoading(true);
        setPersistentError(null);

        try {
            const result = await updateProfileAction(data, userId);

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
            console.error("Error updating profile:", error);
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
                    <User className="w-5 h-5" />
                    Informations personnelles
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
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="firstName"
                                className="text-sm font-medium text-gray-700"
                            >
                                Prénom *
                            </label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Votre prénom"
                                {...register("firstName")}
                                className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                                    errors.firstName
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-200"
                                }`}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <span className="w-4 h-4 text-xs">⚠</span>
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="lastName"
                                className="text-sm font-medium text-gray-700"
                            >
                                Nom *
                            </label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Votre nom"
                                {...register("lastName")}
                                className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                                    errors.lastName
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-200"
                                }`}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <span className="w-4 h-4 text-xs">⚠</span>
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <AtSign className="w-4 h-4" />
                            Nom d&apos;utilisateur *
                        </label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="votre_nom_utilisateur"
                            {...register("username")}
                            className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                                errors.username
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-200"
                            }`}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="w-4 h-4 text-xs">⚠</span>
                                {errors.username.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Le nom d&apos;utilisateur doit être unique et peut
                            contenir des lettres, chiffres et underscores.
                        </p>
                    </div>

                    {/* Email Field (Read-only) */}
                    {initialData?.email && (
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Adresse email (non modifiable)
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={initialData.email}
                                disabled
                                className="h-11 border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">
                                L&apos;adresse email ne peut pas être modifiée
                                pour des raisons de sécurité.
                            </p>
                        </div>
                    )}

                    {/* Profile Picture Upload */}
                    <ProfilePictureUpload
                        value={watch("profilePic") || ""}
                        onChange={value =>
                            setValue("profilePic", value, { shouldDirty: true })
                        }
                        error={errors.profilePic?.message}
                    />

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
