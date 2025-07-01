"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CreditCard, Check, Crown, Star, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    subscriptionSettingsSchema,
    type SubscriptionSettingsFormValues,
    subscriptionPlans,
    type SubscriptionPlan,
} from "@/lib/schemas/user";
import { updateSubscriptionAction } from "@/lib/actions/user";

export interface SubscriptionSettingsProps {
    initialData?: SubscriptionSettingsFormValues;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function SubscriptionSettings({
    initialData,
    onSuccess,
    onError,
}: SubscriptionSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
        setError,
        reset,
    } = useForm<SubscriptionSettingsFormValues>({
        resolver: zodResolver(subscriptionSettingsSchema),
        defaultValues: initialData || {
            subscriptionPlan: "free",
        },
    });

    const selectedPlan = watch("subscriptionPlan");

    const onSubmit = async (data: SubscriptionSettingsFormValues) => {
        setIsLoading(true);

        try {
            const result = await updateSubscriptionAction(data);

            if (result.success) {
                reset(data);
                onSuccess?.();
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                setError("root", { message: errorMessage });
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error("Error updating subscription:", error);
            const errorMessage = "Une erreur inattendue est survenue";
            setError("root", { message: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getPlanIcon = (plan: SubscriptionPlan) => {
        switch (plan) {
            case "free":
                return <Heart className="w-5 h-5" />;
            case "student":
                return <Star className="w-5 h-5" />;
            case "premium":
                return <Crown className="w-5 h-5" />;
            default:
                return <CreditCard className="w-5 h-5" />;
        }
    };

    const getPlanColor = (plan: SubscriptionPlan) => {
        switch (plan) {
            case "free":
                return "from-gray-500 to-gray-600";
            case "student":
                return "from-blue-500 to-blue-600";
            case "premium":
                return "from-purple-500 to-purple-600";
            default:
                return "from-gray-500 to-gray-600";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Abonnement
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Plan Selection */}
                    <Controller
                        name="subscriptionPlan"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Choisissez votre plan
                                </label>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {Object.entries(subscriptionPlans).map(
                                        ([planKey, planData]) => {
                                            const isSelected =
                                                field.value === planKey;
                                            const plan =
                                                planKey as SubscriptionPlan;

                                            return (
                                                <div
                                                    key={planKey}
                                                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        field.onChange(planKey)
                                                    }
                                                >
                                                    <div className="p-6">
                                                        {/* Plan Header */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div
                                                                className={`p-2 rounded-lg bg-gradient-to-r ${getPlanColor(
                                                                    plan
                                                                )} text-white`}
                                                            >
                                                                {getPlanIcon(
                                                                    plan
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                                                                    <Check className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Plan Details */}
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {planData.label}
                                                        </h3>
                                                        <p className="text-2xl font-bold text-gray-900 mb-4">
                                                            {planData.price}
                                                        </p>

                                                        {/* Features */}
                                                        <ul className="space-y-2">
                                                            {planData.features.map(
                                                                (
                                                                    feature,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center gap-2 text-sm text-gray-600"
                                                                    >
                                                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                        {
                                                                            feature
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {/* Popular Badge for Student Plan */}
                                                    {planKey === "student" && (
                                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                                                                Populaire
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}
                    />

                    {/* Current Plan Info */}
                    {selectedPlan && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                <strong>✅ Plan actuel :</strong>{" "}
                                {subscriptionPlans[selectedPlan].label}
                                <br />
                                {selectedPlan !== "free" && (
                                    <span className="text-xs text-green-600 mt-1 block">
                                        Votre abonnement se renouvelle
                                        automatiquement. Vous pouvez
                                        &apos;annuler à tout moment.
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Payment Info */}
                    {selectedPlan !== "free" && isDirty && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>💳 Information de paiement</strong>
                                <br />
                                En changeant votre plan, vous serez redirigé
                                vers notre système de paiement sécurisé. Le
                                changement prendra effet immédiatement après
                                confirmation.
                            </p>
                        </div>
                    )}

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
                    {isDirty && (
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Mise à jour...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        {selectedPlan === "free"
                                            ? "Passer au plan gratuit"
                                            : "Mettre à jour l'abonnement"}
                                    </span>
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
