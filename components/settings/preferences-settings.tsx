"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Settings, Save, Bell, Eye, Shield, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    preferencesSettingsSchema,
    type PreferencesSettingsFormValues,
} from "@/lib/schemas/user";
import {
    updatePreferencesAction,
    deleteAccountAction,
} from "@/lib/actions/user";

export interface PreferencesSettingsProps {
    initialData?: PreferencesSettingsFormValues;
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function PreferencesSettings({
    initialData,
    userId,
    onSuccess,
    onError,
}: PreferencesSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        setError,
        reset,
    } = useForm<PreferencesSettingsFormValues>({
        resolver: zodResolver(preferencesSettingsSchema),
        defaultValues: initialData || {
            notifications: {
                email: true,
                push: true,
                weeklyReport: false,
            },
            profileVisibility: "friends",
            dataSharing: false,
        },
    });

    const onSubmit = async (data: PreferencesSettingsFormValues) => {
        setIsLoading(true);

        try {
            const result = await updatePreferencesAction(data, userId);

            if (result.success) {
                reset(data);
                onSuccess?.();
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                setError("root", { message: errorMessage });
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error("Error updating preferences:", error);
            const errorMessage = "Une erreur inattendue est survenue";
            setError("root", { message: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);

        try {
            const result = await deleteAccountAction(
                { confirmPassword: "" },
                userId
            );

            if (result.success) {
                // Redirect to home or login page
                window.location.href = "/";
            } else {
                const errorMessage =
                    result.error ||
                    "Une erreur est survenue lors de la suppression";
                setError("root", { message: errorMessage });
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            const errorMessage = "Une erreur inattendue est survenue";
            setError("root", { message: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Preferences Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Préférences
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Notifications Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Notifications
                                </h3>
                            </div>

                            <div className="space-y-4 pl-7">
                                <Controller
                                    name="notifications.email"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <label className="text-sm font-medium text-gray-700 block">
                                                    Notifications par email
                                                </label>
                                                <p className="text-xs text-gray-500 break-words">
                                                    Recevoir des notifications
                                                    importantes par email
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="notifications.push"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <label className="text-sm font-medium text-gray-700 block">
                                                    Notifications push
                                                </label>
                                                <p className="text-xs text-gray-500 break-words">
                                                    Recevoir des notifications
                                                    sur votre navigateur
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="notifications.weeklyReport"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <label className="text-sm font-medium text-gray-700 block">
                                                    Rapport hebdomadaire
                                                </label>
                                                <p className="text-xs text-gray-500 break-words">
                                                    Recevoir un résumé de vos
                                                    progrès chaque semaine
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Privacy Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Confidentialité
                                </h3>
                            </div>

                            <div className="space-y-4 pl-7">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Eye className="w-4 h-4 flex-shrink-0" />
                                        <span className="break-words">
                                            Visibilité du profil
                                        </span>
                                    </label>
                                    <Controller
                                        name="profileVisibility"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="h-11 border-2 transition-all duration-200 focus:border-blue-500 border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="max-w-[300px]">
                                                    <SelectItem value="public">
                                                        <div className="w-full">
                                                            <div className="font-medium truncate">
                                                                Public
                                                            </div>
                                                            <div className="text-xs text-gray-500 break-words whitespace-normal leading-relaxed">
                                                                Visible par tous
                                                                les utilisateurs
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="friends">
                                                        <div className="w-full">
                                                            <div className="font-medium truncate">
                                                                Amis uniquement
                                                            </div>
                                                            <div className="text-xs text-gray-500 break-words whitespace-normal leading-relaxed">
                                                                Visible par vos
                                                                amis seulement
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="private">
                                                        <div className="w-full">
                                                            <div className="font-medium truncate">
                                                                Privé
                                                            </div>
                                                            <div className="text-xs text-gray-500 break-words whitespace-normal leading-relaxed">
                                                                Profil non
                                                                visible
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="dataSharing"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <label className="text-sm font-medium text-gray-700 block">
                                                    Partage de données anonymes
                                                </label>
                                                <p className="text-xs text-gray-500 break-words">
                                                    Aider à améliorer
                                                    l&apos;application en
                                                    partageant des données
                                                    anonymes
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Error Display */}
                        {errors.root && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 flex items-start gap-2 break-words">
                                    <span className="text-red-500 flex-shrink-0 mt-0.5">
                                        ⚠
                                    </span>
                                    <span className="break-words">
                                        {errors.root.message}
                                    </span>
                                </p>
                            </div>
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
                                        Sauvegarder
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="w-5 h-5 flex-shrink-0" />
                        <span className="break-words">Zone dangereuse</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-semibold text-red-800 mb-2 break-words">
                                Supprimer mon compte
                            </h4>
                            <p className="text-sm text-red-700 mb-4 break-words leading-relaxed">
                                Cette action est irréversible. Toutes vos
                                données seront définitivement supprimées.
                            </p>

                            {!showDeleteConfirm ? (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Supprimer mon compte
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-red-800 break-words">
                                        Êtes-vous sûr de vouloir supprimer votre
                                        compte ?
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-700 whitespace-normal text-center"
                                        >
                                            {isDeleting ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Suppression...
                                                </span>
                                            ) : (
                                                "Oui, supprimer définitivement"
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setShowDeleteConfirm(false)
                                            }
                                            disabled={isDeleting}
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
