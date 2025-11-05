"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "@/lib/schemas/auth";
import { resetPasswordAction } from "@/lib/actions/auth";

export interface ResetPasswordFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    onBack?: () => void;
}

export function ResetPasswordForm({
    onSuccess,
    onError,
    onBack,
}: ResetPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        getValues,
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setIsLoading(true);

        try {
            const result = await resetPasswordAction(data);

            if (result.success) {
                setIsSubmitted(true);
                onSuccess?.();
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                setError("root", { message: errorMessage });
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = "Une erreur inattendue est survenue";
            setError("root", { message: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        const email = getValues("email");
        if (email) {
            setIsLoading(true);
            try {
                await resetPasswordAction({ email });
            } catch (error) {
                console.error("Resend error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isSubmitted) {
        return (
            <div className="space-y-4 sm:space-y-6">
                {/* Success Header */}
                <div className="text-center space-y-3 sm:space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Email envoyé !
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                        Nous avons envoyé un lien de réinitialisation à{" "}
                        <strong>{getValues("email")}</strong>. Vérifiez votre
                        boîte de réception et vos spams.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        onClick={handleResend}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-11 sm:h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-base"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                Renvoi en cours...
                            </span>
                        ) : (
                            "Renvoyer l'email"
                        )}
                    </Button>

                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="w-full h-11 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 text-base"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Mot de passe oublié ?
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Pas de souci ! Indique ton email et reçois un lien pour créer un nouveau mot de passe
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
            >
                {/* Email Field */}
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Adresse email
                    </label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder="ton.email@exemple.com"
                            {...register("email")}
                            className={`pl-11 h-12 sm:h-13 border-2 rounded-xl transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base bg-gray-50/50 focus:bg-white ${
                                errors.email
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-200"
                            }`}
                        />
                        <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <span className="w-4 h-4 text-xs">⚠</span>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Error Display */}
                {errors.root && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <span className="text-red-500">⚠</span>
                            {errors.root.message}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Envoi en cours...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Envoyer le lien de réinitialisation
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    )}
                </Button>

                {/* Back Button */}
                <Button
                    type="button"
                    onClick={onBack}
                    variant="ghost"
                    className="w-full h-11 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 text-base"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                </Button>
            </form>
        </div>
    );
}
