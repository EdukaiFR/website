"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50/30 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full bg-white/80 backdrop-blur-xl shadow-2xl border border-white/40 overflow-hidden">
                <CardContent className="p-12 text-center">
                    {/* Warning Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl" />
                            <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-6 shadow-xl">
                                <AlertCircle className="w-16 h-16 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Cancel Message */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Paiement annulé
                    </h1>
                    <p className="text-xl text-gray-700 mb-2">
                        Votre abonnement n'a pas été finalisé
                    </p>
                    <p className="text-gray-600 mb-8">
                        Aucun montant n'a été débité de votre compte
                    </p>

                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            Vous avez changé d'avis ?
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Pas de problème ! Vous pouvez réessayer à tout
                            moment ou continuer à utiliser Edukai avec le plan
                            gratuit.
                        </p>
                        <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
                            <p className="text-sm text-gray-600">
                                💡 <strong>Bon à savoir :</strong> Le plan
                                Premium vous donne accès à des quiz illimités,
                                toutes les matières, et un support prioritaire
                                pour seulement 5€/mois.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button
                            onClick={() => router.push("/pricing")}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Réessayer
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            size="lg"
                        >
                            Retour au Dashboard
                        </Button>
                    </div>

                    {/* Support Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-600 mb-3">
                            Vous rencontrez un problème ?
                        </p>
                        <a
                            href="mailto:contact@edukai.fr"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Contactez notre support
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
