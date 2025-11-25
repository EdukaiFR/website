"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentService } from "@/services/payment";
import {
    AlertCircle,
    Clock,
    CreditCard,
    Crown,
    ExternalLink,
    FileQuestion,
    Shield,
    Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface SubscriptionSettingsProps {
    initialData?: {
        accountPlan?: string;
    };
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function SubscriptionSettings({
    initialData,
    userId: _userId,
    onSuccess: _onSuccess,
    onError,
}: SubscriptionSettingsProps) {
    const router = useRouter();
    const paymentService = usePaymentService();
    const [isLoadingPortal, setIsLoadingPortal] = useState(false);

    const accountPlan = initialData?.accountPlan || "free";
    const isPremium = accountPlan === "premium";

    const handleManageSubscription = async () => {
        try {
            setIsLoadingPortal(true);
            const { url } = await paymentService.createPortalSession();
            // Redirect to Stripe portal
            window.location.href = url;
        } catch (error: unknown) {
            console.error(
                "Erreur lors de l'ouverture du portail:",
                error
            );
            if (onError) {
                const err = error as { response?: { data?: { message?: string } } };
                onError(
                    err.response?.data?.message ||
                        "Une erreur est survenue lors de l'ouverture du portail de gestion"
                );
            }
        } finally {
            setIsLoadingPortal(false);
        }
    };

    const handleUpgrade = () => {
        router.push("/pricing");
    };

    return (
        <Card className="bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative border-b border-gray-100/50 bg-gradient-to-r from-blue-50/30 to-transparent pb-6">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-md">
                        <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    Abonnement
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2 ml-12">
                    Gérez votre plan et vos fonctionnalités
                </p>
            </CardHeader>
            <CardContent className="space-y-6 relative">
                {/* Current Plan Status */}
                <div
                    className={`rounded-xl p-6 border ${
                        isPremium
                            ? "bg-gradient-to-br from-blue-50 via-blue-100 to-white border-blue-200/50"
                            : "bg-gradient-to-br from-gray-50 to-white border-gray-200/50"
                    }`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2 rounded-lg ${
                                    isPremium
                                        ? "bg-gradient-to-br from-blue-600 to-blue-500"
                                        : "bg-gray-500"
                                }`}
                            >
                                <Crown className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-bold text-gray-900">
                                        {isPremium
                                            ? "Plan Premium"
                                            : "Plan Gratuit"}
                                    </p>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            isPremium
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {isPremium ? "ACTIF" : "BETA"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {isPremium
                                        ? "Vous profitez de tous les avantages Premium"
                                        : "Pendant la phase Beta, Edukai est entièrement gratuit"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isPremium && (
                        <Button
                            onClick={handleManageSubscription}
                            disabled={isLoadingPortal}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isLoadingPortal ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Chargement...
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Gérer mon abonnement
                                </>
                            )}
                        </Button>
                    )}

                    {!isPremium && (
                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Passer à Premium
                        </Button>
                    )}
                </div>

                {/* Beta Notice for Free Users */}
                {!isPremium && (
                    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white border border-blue-200/50 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-bold text-gray-900">
                                        Version Beta Gratuite
                                    </p>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                        BETA
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Pendant la phase Beta, Edukai est
                                    entièrement gratuit ! Profitez de toutes
                                    les fonctionnalités disponibles pour nous
                                    aider à améliorer la plateforme.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current Limitations */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-base font-bold text-gray-900">
                            {isPremium
                                ? "Avantages Premium"
                                : "Limitations actuelles (Beta)"}
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {isPremium ? (
                            <>
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1 text-sm">
                                                Quiz illimités
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Créez autant de quiz que vous le
                                                souhaitez avec plus de questions
                                                pour mieux réviser.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                            <Crown className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1 text-sm">
                                                Support prioritaire
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Bénéficiez d'une assistance
                                                rapide et personnalisée pour
                                                toutes vos questions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Rate Limit */}
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1 text-sm">
                                                Rate Limiting
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Pour éviter les abus et garantir
                                                une expérience optimale à tous
                                                nos utilisateurs Beta, un
                                                système de limitation est en
                                                place sur l'utilisation des
                                                fonctionnalités IA.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quiz Limitation */}
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                            <FileQuestion className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1 text-sm">
                                                Quiz de 4 questions
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Les quiz sont actuellement
                                                limités à 4 questions pour
                                                permettre de tester les
                                                fonctionnalités. Une fois la
                                                version complète lancée, le
                                                nombre de questions sera adapté
                                                selon votre abonnement.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Coming Soon for Free Users */}
                {!isPremium && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-xl p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-base font-bold text-gray-900">
                                    Bientôt disponible
                                </p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-700 font-medium">
                                    Plans d'abonnement à venir après la Beta :
                                </p>

                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Plan Gratuit
                                            </span>
                                            <span className="text-gray-600 text-sm">
                                                {" "}
                                                - Accès limité aux
                                                fonctionnalités de base
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Plan Premium
                                            </span>
                                            <span className="text-gray-600 text-sm">
                                                {" "}
                                                - Quiz illimités, toutes
                                                matières, support prioritaire
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Plan Pro
                                            </span>
                                            <span className="text-gray-600 text-sm">
                                                {" "}
                                                - Fonctionnalités avancées pour
                                                les étudiants exigeants
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                                <p className="text-xs text-gray-600 italic">
                                    💡 En tant qu'utilisateur Beta, vous
                                    bénéficierez d'avantages exclusifs lors du
                                    lancement des abonnements payants !
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Beta Feedback */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1 text-sm">
                                Aidez-nous à améliorer Edukai
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                                Vos retours sont précieux ! N'hésitez pas à
                                nous faire part de vos suggestions et des bugs
                                rencontrés pendant cette phase Beta.
                            </p>
                            <p className="text-sm text-blue-800 font-medium">
                                ✉️ Contactez-nous :{" "}
                                <a
                                    href="mailto:contact@edukai.fr"
                                    className="underline hover:text-blue-900 transition-colors"
                                >
                                    contact@edukai.fr
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
