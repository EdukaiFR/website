"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Eye, EyeOff, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PersistentAlert } from "@/components/ui/persistent-alert";
import { useSession } from "@/hooks/useSession";
import {
    deleteAccountSchema,
    type DeleteAccountFormValues,
} from "@/lib/schemas/user";
import { ApiError } from "@/lib/types/api";
import { useAuthService } from "@/services";

const API_ERROR_TRANSLATIONS: Record<string, string> = {
    "Invalid password": "Mot de passe incorrect",
    "User not found": "Utilisateur introuvable",
    "Unauthorized": "Non autorisé",
};

function translateApiError(message?: string): string {
    if (!message) return "Une erreur inattendue est survenue";
    return API_ERROR_TRANSLATIONS[message] ?? message;
}

export interface AccountSettingsProps {
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function AccountSettings({
    userId,
    onSuccess,
    onError,
}: AccountSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [persistentError, setPersistentError] = useState<string | null>(null);
    const [confirmationStep, setConfirmationStep] = useState<
        "initial" | "confirm"
    >("initial");
    const router = useRouter();

    const { verifyPassword, deleteUserAccount } = useAuthService();
    const { logout } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            currentPassword: "",
        },
    });

    const handleSignOut = async () => {
        await logout();
        router.push("/auth");
    };

    const onSubmit = async (data: DeleteAccountFormValues) => {
        setIsLoading(true);
        setPersistentError(null);

        try {
            const verificationResponse = await verifyPassword(data.currentPassword);

            if (verificationResponse.status !== "success") {
                setPersistentError(verificationResponse?.message);
                return;
            }
            const deletionResponse = await deleteUserAccount(userId);

            if (deletionResponse.status === "success") {
                onSuccess?.();
                handleSignOut();
            } else {
                const errorMessage = deletionResponse.message || "Une erreur est survenue";
                setPersistentError(errorMessage);
                onError?.(errorMessage);
            }

        } catch (error: unknown) {
            console.error("Error deleting account:", error);
            const err = error as ApiError;
            const rawMessage = err.response?.data?.message;
            const errorMessage = translateApiError(rawMessage);
            setPersistentError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitialDelete = () => {
        setConfirmationStep("confirm");
        setPersistentError(null);
    };

    const handleCancel = () => {
        setConfirmationStep("initial");
        reset();
        setPersistentError(null);
    };

    return (
        <Card className="bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative border-b border-gray-100/50 bg-gradient-to-r from-red-50/30 to-transparent pb-6">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                    <div className="p-2.5 bg-gradient-to-br from-red-600 to-red-500 rounded-xl shadow-md">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    Gestion du compte
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2 ml-12">
                    Sécurité et paramètres de votre compte
                </p>
            </CardHeader>
            <CardContent className="space-y-6 relative">
                {/* Persistent Error Alert */}
                {persistentError && (
                    <PersistentAlert
                        type="error"
                        message={persistentError}
                        title="Erreur"
                        onDismiss={() => setPersistentError(null)}
                    />
                )}

                {/* Account Information */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200/50 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                Sécurité du compte
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Votre compte est sécurisé avec une
                                authentification par cookies HTTP-only.
                                L'adresse email ne peut pas être modifiée pour
                                des raisons de sécurité.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Deletion Section */}
                <div className="space-y-4">
                    <div className="border-t-2 border-gray-100/50 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-red-600 to-red-500 rounded-lg">
                                <Trash2 className="w-5 h-5 text-white" />
                            </div>
                            Suppression du compte
                        </h3>

                        {confirmationStep === "initial" ? (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex-shrink-0">
                                            <AlertTriangle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-2">
                                                Attention : Action irréversible
                                            </h4>
                                            <p className="text-sm text-gray-700 mb-3">
                                                La suppression de votre compte
                                                entraînera la perte définitive
                                                de :
                                            </p>
                                            <ul className="text-sm text-gray-700 space-y-2 ml-1">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                                    Toutes vos données
                                                    personnelles
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                                    Votre historique d'activité
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                                    Vos cours et matériaux
                                                    sauvegardés
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                                    Votre abonnement (sans
                                                    remboursement)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleInitialDelete}
                                    variant="destructive"
                                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Supprimer mon compte
                                </Button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex-shrink-0">
                                            <AlertTriangle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">
                                                Confirmation de suppression
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                                Pour confirmer la suppression de
                                                votre compte, veuillez saisir
                                                votre mot de passe actuel.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="currentPassword"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Mot de passe actuel *
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Saisissez votre mot de passe"
                                            {...register("currentPassword")}
                                            className={`h-11 pr-12 border-2 transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 ${
                                                errors.currentPassword
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                    : "border-gray-200"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.currentPassword && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span className="w-4 h-4 text-xs">
                                                ⚠
                                            </span>
                                            {errors.currentPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="flex-1 h-12 border-2 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        variant="destructive"
                                        className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Suppression en cours...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Trash2 className="w-5 h-5" />
                                                Confirmer la suppression
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
