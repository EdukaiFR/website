"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    Clock,
    CreditCard,
    FileQuestion,
    Shield,
    Sparkles,
} from "lucide-react";

export interface SubscriptionSettingsProps {
    initialData?: Record<string, unknown>;
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function SubscriptionSettings({
    initialData: _initialData,
    userId: _userId,
    onSuccess: _onSuccess,
    onError: _onError,
}: SubscriptionSettingsProps) {
    return (
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CreditCard className="w-5 h-5" />
                    Abonnement
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Beta Notice */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white border border-blue-200/50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Version Beta Gratuite
                                </h3>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                    BETA
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Pendant la phase Beta, Edukai est entièrement
                                gratuit ! Profitez de toutes les fonctionnalités
                                disponibles pour nous aider à améliorer la
                                plateforme.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Limitations */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Limitations actuelles (Beta)
                    </h3>

                    <div className="grid gap-4">
                        {/* Rate Limit */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        Rate Limiting
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Pour éviter les abus et garantir une
                                        expérience optimale à tous nos
                                        utilisateurs Beta, un système de
                                        limitation est en place sur
<<<<<<< HEAD
                                        l'utilisation des fonctionnalités IA.
=======
                                        l'utilisation des fonctionnalités
                                        IA.
>>>>>>> b79bb0a (refactor: replace escaped html entities with actual chars)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quiz Limitation */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <FileQuestion className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        Quiz de 4 questions
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Les quiz sont actuellement limités à 4
                                        questions pour permettre de tester les
                                        fonctionnalités. Une fois la version
                                        complète lancée, le nombre de questions
                                        sera adapté selon votre abonnement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 rounded-xl p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Bientôt disponible
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-700 font-medium">
                                Plans d'abonnement à venir après la Beta :
                            </p>

                            <div className="grid gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Plan Gratuit
                                        </span>
                                        <span className="text-gray-600 text-sm">
                                            {" "}
                                            - Accès limité aux fonctionnalités
                                            de base
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Plan Premium
                                        </span>
                                        <span className="text-gray-600 text-sm">
                                            {" "}
                                            - Quiz illimités, toutes matières,
                                            support prioritaire
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Plan Pro
                                        </span>
                                        <span className="text-gray-600 text-sm">
                                            {" "}
                                            - Fonctionnalités avancées pour les
                                            étudiants exigeants
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
                            <p className="text-xs text-gray-600 italic">
                                💡 En tant qu'utilisateur Beta, vous
                                bénéficierez d'avantages exclusifs lors du
                                lancement des abonnements payants !
                            </p>
                        </div>
                    </div>
                </div>

                {/* Beta Feedback */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                            <Sparkles className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-green-900 mb-1">
                                Aidez-nous à améliorer Edukai
                            </h4>
                            <p className="text-sm text-green-700 mb-2">
<<<<<<< HEAD
                                Vos retours sont précieux ! N'hésitez pas à nous
                                faire part de vos suggestions et des bugs
=======
                                Vos retours sont précieux ! N'hésitez pas à
                                nous faire part de vos suggestions et des bugs
>>>>>>> b79bb0a (refactor: replace escaped html entities with actual chars)
                                rencontrés pendant cette phase Beta.
                            </p>
                            <p className="text-sm text-green-800 font-medium">
                                ✉️ Contactez-nous :{" "}
                                <a
                                    href="mailto:contact@edukai.fr"
                                    className="underline hover:text-green-900"
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
