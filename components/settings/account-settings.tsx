"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PersistentAlert } from "@/components/ui/persistent-alert";
import { deleteAccountAction } from "@/lib/actions/user";
import {
    deleteAccountSchema,
    type DeleteAccountFormValues,
} from "@/lib/schemas/user";

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
    const [persistentError, setPersistentError] = useState<string | null>(null);
    const [confirmationStep, setConfirmationStep] = useState<
        "initial" | "confirm"
    >("initial");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: DeleteAccountFormValues) => {
        setIsLoading(true);
        setPersistentError(null);

        try {
            const result = await deleteAccountAction(data, userId);

            if (result.success) {
                onSuccess?.();
                // Redirect to homepage after successful deletion
                router.push("/");
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                setPersistentError(errorMessage);
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            const errorMessage = "Une erreur inattendue est survenue";
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
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Shield className="w-5 h-5" />
                    Gestion du compte
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">
                            Sécurité du compte
                        </span>
                    </div>
                    <p className="text-sm text-blue-700">
                        Votre compte est sécurisé avec une authentification par
                        cookies HTTP-only. L'adresse email ne peut pas être
                        modifiée pour des raisons de sécurité.
                    </p>
                </div>

                {/* Account Deletion Section */}
                <div className="space-y-4">
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            Suppression du compte
                        </h3>

                        {confirmationStep === "initial" ? (
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-yellow-800 mb-1">
                                                Attention : Action irréversible
                                            </h4>
                                            <p className="text-sm text-yellow-700">
                                                La suppression de votre compte
                                                entraînera la perte définitive
                                                de :
                                            </p>
                                            <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
                                                <li>
                                                    Toutes vos données
                                                    personnelles
                                                </li>
                                                <li>
                                                    Votre historique
                                                    d'activité
                                                </li>
                                                <li>
                                                    Vos cours et matériaux
                                                    sauvegardés
                                                </li>
                                                <li>
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
                                    className="w-full h-11"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer mon compte
                                </Button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-red-800 mb-1">
                                                Confirmation de suppression
                                            </h4>
                                            <p className="text-sm text-red-700">
                                                Pour confirmer la suppression de
                                                votre compte, veuillez saisir
                                                votre mot de passe actuel.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Mot de passe actuel *
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Saisissez votre mot de passe"
                                        {...register("confirmPassword")}
                                        className={`h-11 border-2 transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 ${
                                            errors.confirmPassword
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-gray-200"
                                        }`}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span className="w-4 h-4 text-xs">
                                                ⚠
                                            </span>
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="flex-1 h-11"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        variant="destructive"
                                        className="flex-1 h-11"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Suppression...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Trash2 className="w-4 h-4" />
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
