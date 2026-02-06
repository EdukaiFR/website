"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { AlertCircle, Check, Crown, Sparkles, Zap } from "lucide-react";

/**
 * Pricing page component
 * Displays subscription plans and handles payment actions
 */
export default function PricingPage() {
    const {
        status,
        isProcessing,
        isLoading,
        handleSubscribe,
        handleManageSubscription,
        formatCancellationDate,
    } = useSubscription();

    // Show loader while session is loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

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

                {/* Cancellation Warning Banner */}
                {status.hasScheduledCancellation && status.cancellationDate && (
                    <CancellationBanner
                        cancellationDate={formatCancellationDate(
                            status.cancellationDate
                        )}
                        onReactivate={handleManageSubscription}
                        isLoading={isProcessing}
                    />
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <FreePlanCard
                        isCurrentPlan={!status.isPremium}
                        onManageSubscription={handleManageSubscription}
                        isPremium={status.isPremium}
                    />
                    <PremiumPlanCard
                        isPremium={status.isPremium}
                        isLoading={isProcessing}
                        onSubscribe={handleSubscribe}
                        onManageSubscription={handleManageSubscription}
                    />
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600">
                        Paiement sécurisé par Stripe - Annulation à tout moment
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Cancellation warning banner component
 */
interface CancellationBannerProps {
    cancellationDate: string;
    onReactivate: () => void;
    isLoading: boolean;
}

function CancellationBanner({
    cancellationDate,
    onReactivate,
    isLoading,
}: CancellationBannerProps) {
    return (
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
                            Votre abonnement Premium a été annulé. Vous
                            conserverez vos avantages Premium jusqu&apos;au{" "}
                            <span className="font-semibold text-orange-700">
                                {cancellationDate}
                            </span>
                            .
                        </p>
                        <Button
                            onClick={onReactivate}
                            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Chargement..."
                                : "Réactiver mon abonnement"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Free plan card component
 */
interface FreePlanCardProps {
    isCurrentPlan: boolean;
    onManageSubscription: () => void;
    isPremium: boolean;
}

function FreePlanCard({
    isCurrentPlan,
    onManageSubscription,
    isPremium,
}: FreePlanCardProps) {
    const features = [
        "Accès aux fonctionnalités de base",
        "Quiz limités (4 questions)",
        "Génération de fiches de révision",
        "Support communautaire",
    ];

    return (
        <Card
            className={`flex flex-col bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                isCurrentPlan ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
        >
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
                    <span className="text-4xl font-bold text-gray-900">0€</span>
                    <span className="text-gray-600">/mois</span>
                </div>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col flex-1">
                <ul className="space-y-4 flex-1">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button
                    variant="outline"
                    className="w-full mt-8"
                    disabled={!isPremium}
                    onClick={isPremium ? onManageSubscription : undefined}
                >
                    {isCurrentPlan ? "Plan actuel" : "Downgrade"}
                </Button>
            </CardContent>
        </Card>
    );
}

/**
 * Premium plan card component
 */
interface PremiumPlanCardProps {
    isPremium: boolean;
    isLoading: boolean;
    onSubscribe: () => void;
    onManageSubscription: () => void;
}

function PremiumPlanCard({
    isPremium,
    isLoading,
    onSubscribe,
    onManageSubscription,
}: PremiumPlanCardProps) {
    const features = [
        { text: "Tout du plan Gratuit", highlight: true },
        { text: "Quiz illimités", subtext: " avec plus de questions" },
        { text: "Toutes les matières", subtext: " disponibles" },
        { text: "Génération de contenu ", subtext: "prioritaire" },
        { text: "Support prioritaire", subtext: " par email" },
        { text: "Accès anticipé aux ", subtext: "nouvelles fonctionnalités" },
    ];

    return (
        <Card className="flex flex-col bg-white/60 backdrop-blur-xl shadow-2xl border-2 border-blue-500/50 overflow-hidden hover:shadow-3xl transition-all duration-300 relative">
            {/* Badge */}
            <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                {isPremium ? "ACTIF" : "POPULAIRE"}
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5" />

            <CardHeader className="relative border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-transparent pb-6 pt-12">
                <div className="flex items-center gap-3 mb-4">
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
            <CardContent className="pt-6 relative flex flex-col flex-1">
                <ul className="space-y-4 flex-1">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="p-0.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mt-0.5">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span
                                className={`text-gray-700 ${feature.highlight ? "font-medium" : ""}`}
                            >
                                {feature.subtext ? (
                                    <>
                                        <strong>{feature.text}</strong>
                                        {feature.subtext}
                                    </>
                                ) : (
                                    feature.text
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
                <Button
                    className="w-full mt-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    onClick={isPremium ? onManageSubscription : onSubscribe}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Chargement...
                        </>
                    ) : isPremium ? (
                        "Gérer l'abonnement"
                    ) : (
                        <>
                            <Zap className="w-4 h-4 mr-2" />
                            S&apos;abonner maintenant
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
