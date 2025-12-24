"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/hooks/useSession";
import { CheckCircle, Home, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { validateSession } = useSession();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Refresh user profile to get latest subscription status
        validateSession();

        // Trigger confetti animation
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50/30 flex items-center justify-center p-4">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: [
                                        "#3b82f6",
                                        "#10b981",
                                        "#f59e0b",
                                        "#ef4444",
                                        "#8b5cf6",
                                    ][Math.floor(Math.random() * 5)],
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <Card className="max-w-2xl w-full bg-white/80 backdrop-blur-xl shadow-2xl border border-white/40 overflow-hidden">
                <CardContent className="p-12 text-center">
                    {/* Success Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 shadow-xl">
                                <CheckCircle className="w-16 h-16 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Paiement réussi ! 🎉
                    </h1>
                    <p className="text-xl text-gray-700 mb-2">
                        Merci pour votre abonnement Premium
                    </p>
                    <p className="text-gray-600 mb-8">
                        Vous avez maintenant accès à toutes les fonctionnalités
                        Premium d'Edukai
                    </p>

                    {/* Premium Features */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Vos nouveaux avantages
                            </h2>
                        </div>
                        <ul className="text-left space-y-2 max-w-md mx-auto">
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Quiz illimités avec plus de questions</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Toutes les matières disponibles</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Support prioritaire</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>
                                    Accès anticipé aux nouvelles fonctionnalités
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Aller au Dashboard
                        </Button>
                        <Button
                            onClick={() => router.push("/settings")}
                            variant="outline"
                            size="lg"
                        >
                            Gérer mon abonnement
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <p className="text-sm text-gray-500 mt-8">
                        Un email de confirmation vous a été envoyé
                    </p>
                </CardContent>
            </Card>

            <style jsx>{`
                @keyframes confetti {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                .animate-confetti {
                    animation: confetti linear forwards;
                }
            `}</style>
        </div>
    );
}
