"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/hooks/useSession";
import { ApiError, getErrorMessage } from "@/lib/types/api";
import { usePaymentService } from "@/services/payment";
import { AlertCircle, Check, Crown, Sparkles, Zap } from "lucide-react";
import { useCallback, useState } from "react";

export default function PricingPage() {
    const paymentService = usePaymentService();
    const { user } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const isPremium = user?.accountPlan === "premium";
    const hasScheduledCancellation = isPremium && user?.cancelAtPeriodEnd && user?.currentPeriodEnd;

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }, []);

    const handleSubscribe = useCallback(async () => {
        try {
            setIsLoading(true);
            const { url } = await paymentService.createCheckoutSession();
            // Redirect to Stripe checkout
            window.location.href = url;
        } catch (error: unknown) {
            console.error("Erreur lors de la création de la session:", error);
            const err = error as ApiError;
            alert(
                err.response?.data?.message ||
                    err.message ||
                    "Une erreur est survenue lors de la création de la session de paiement"
            );
        } finally {
            setIsLoading(false);
        }
    }, [paymentService]);

    const handleManageSubscription = useCallback(async () => {
        try {
            setIsLoading(true);
            const { url } = await paymentService.createPortalSession();
            window.location.href = url;
        } catch (error: unknown) {
            console.error("Erreur lors de l'accès au portail:", error);
            const errorMessage = getErrorMessage(error);
            alert(errorMessage || "Impossible d'accéder au portail de gestion");
        } finally {
            setIsLoading(false);
        }
    }, [paymentService]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Choisissez votre plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Passez à Premium pour débloquer toutes les
                        fonctionnalités et booster vos révisions
                    </p>
                </div>

                {/* Cancellation Warning Badge */}
                {hasScheduledCancellation && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Abonnement annulé
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Votre abonnement Premium a été annulé. Vous conserverez vos avantages Premium jusqu'au{" "}
                                        <span className="font-semibold text-orange-700">
                                            {formatDate(user.currentPeriodEnd!)}
                                        </span>.
                                    </p>
                                    <Button
                                        onClick={handleManageSubscription}
                                        className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Chargement..." : "Réactiver mon abonnement"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <Card className={`bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300 ${!isPremium ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                        <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-gray-50/30 to-transparent pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Gratuit
                                </CardTitle>
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Sparkles className="w-6 h-6 text-gray-600" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-gray-900">
                                    0€
                                </span>
                                <span className="text-gray-600">/mois</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Accès aux fonctionnalités de base
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Quiz limités (4 questions)
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Génération de fiches de révision
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Support communautaire
                                    </span>
                                </li>
                            </ul>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={!isPremium}
                                onClick={isPremium ? handleManageSubscription : undefined}
                            >
                                {!isPremium ? "Plan actuel" : "Downgrade"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Premium Plan */}
                    <Card className={`bg-white/60 backdrop-blur-xl shadow-2xl border-2 ${isPremium ? 'border-green-500/50' : 'border-blue-500/50'} overflow-hidden hover:shadow-3xl transition-all duration-300 relative`}>
                        {/* Popular Badge */}
                        {!isPremium && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                POPULAIRE
                            </div>
                        )}
                        {isPremium && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                ACTIF
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5" />

                        <CardHeader className="relative border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-transparent pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Premium
                                </CardTitle>
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    5€
                                </span>
                                <span className="text-gray-600">/mois</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        Tout du plan Gratuit
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        <strong>Quiz illimités</strong> avec plus
                                        de questions
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        <strong>Toutes les matières</strong>{" "}
                                        disponibles
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        Génération de contenu{" "}
                                        <strong>prioritaire</strong>
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        <strong>Support prioritaire</strong> par
                                        email
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        Accès anticipé aux{" "}
                                        <strong>nouvelles fonctionnalités</strong>
                                    </span>
                                </li>
                            </ul>
                            <Button
                                className={`w-full text-white shadow-lg hover:shadow-xl transition-all duration-300 ${isPremium ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'}`}
                                onClick={isPremium ? handleManageSubscription : handleSubscribe}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Chargement...
                                    </>
                                ) : isPremium ? (
                                    <>
                                        Gérer l'abonnement
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        S'abonner maintenant
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ or Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600">
                        💳 Paiement sécurisé par Stripe • Annulation à tout
                        moment
                    </p>
                </div>
            </div>
        </div>
    );
}
