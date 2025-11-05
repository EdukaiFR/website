"use client";

import { AuthContainer, EdukaiHeader } from "@/components/auth";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle2,
    Instagram,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Authpage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Falling icons configuration - beaucoup plus d'icônes
    const fallingIcons = [
        // Première vague
        { Icon: Sparkles, delay: 0, duration: 15, left: "5%" },
        { Icon: Star, delay: 2, duration: 18, left: "10%" },
        { Icon: Zap, delay: 4, duration: 16, left: "15%" },
        { Icon: TrendingUp, delay: 1, duration: 17, left: "20%" },
        { Icon: Users, delay: 3, duration: 19, left: "25%" },
        { Icon: CheckCircle2, delay: 5, duration: 15, left: "30%" },
        { Icon: Star, delay: 2.5, duration: 16, left: "35%" },
        { Icon: Sparkles, delay: 4.5, duration: 18, left: "40%" },
        { Icon: Zap, delay: 1.5, duration: 17, left: "45%" },
        { Icon: TrendingUp, delay: 3.5, duration: 16, left: "50%" },

        // Deuxième vague
        { Icon: Users, delay: 0.5, duration: 18, left: "55%" },
        { Icon: CheckCircle2, delay: 2.8, duration: 15, left: "60%" },
        { Icon: Sparkles, delay: 4.2, duration: 17, left: "65%" },
        { Icon: Star, delay: 1.8, duration: 19, left: "70%" },
        { Icon: Zap, delay: 3.2, duration: 16, left: "75%" },
        { Icon: TrendingUp, delay: 5.5, duration: 18, left: "80%" },
        { Icon: Users, delay: 2.2, duration: 15, left: "85%" },
        { Icon: Sparkles, delay: 4.8, duration: 17, left: "90%" },
        { Icon: Star, delay: 1.2, duration: 16, left: "95%" },

        // Troisième vague - positions intermédiaires
        { Icon: CheckCircle2, delay: 6, duration: 19, left: "8%" },
        { Icon: Zap, delay: 7, duration: 15, left: "18%" },
        { Icon: Star, delay: 6.5, duration: 18, left: "28%" },
        { Icon: Sparkles, delay: 7.5, duration: 16, left: "38%" },
        { Icon: TrendingUp, delay: 8, duration: 17, left: "48%" },
        { Icon: Users, delay: 6.8, duration: 19, left: "58%" },
        { Icon: CheckCircle2, delay: 7.2, duration: 15, left: "68%" },
        { Icon: Zap, delay: 8.5, duration: 18, left: "78%" },
        { Icon: Star, delay: 7.8, duration: 16, left: "88%" },

        // Quatrième vague - encore plus de variations
        { Icon: Sparkles, delay: 9, duration: 17, left: "12%" },
        { Icon: TrendingUp, delay: 9.5, duration: 19, left: "22%" },
        { Icon: Users, delay: 10, duration: 15, left: "32%" },
        { Icon: Star, delay: 9.2, duration: 18, left: "42%" },
        { Icon: CheckCircle2, delay: 10.5, duration: 16, left: "52%" },
        { Icon: Zap, delay: 9.8, duration: 17, left: "62%" },
        { Icon: Sparkles, delay: 11, duration: 19, left: "72%" },
        { Icon: TrendingUp, delay: 10.2, duration: 15, left: "82%" },
        { Icon: Users, delay: 11.5, duration: 18, left: "92%" },
    ];

    const handleAuthSuccess = () => {
        console.log("Authentication successful");
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect") || "/";

        // Delay redirect to allow toast to be visible
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1500); // 1.5 seconds delay
    };

    const handleAuthError = (error: string) => {
        console.error("Authentication error:", error);
    };

    const features = [
        { text: "Génération en 20 secondes", icon: CheckCircle2 },
        { text: "Questions personnalisées", icon: CheckCircle2 },
        { text: "Suivi de progression", icon: CheckCircle2 },
        { text: "100% gratuit", icon: CheckCircle2 },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-2000" />

                {/* Falling Icons - Hidden on mobile */}
                <div className="hidden lg:block">
                    {fallingIcons.map((item, index) => {
                        const { Icon, delay, duration, left } = item;
                        return (
                            <Icon
                                key={index}
                                className="absolute w-6 h-6 text-blue-400/30"
                                style={{
                                    left,
                                    top: "-50px",
                                    animation: `fall ${duration}s linear ${delay}s infinite`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* CSS Animation for falling icons */}
            <style jsx>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-50px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.7;
                    }
                    90% {
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>

            <div className="relative z-10 w-full min-h-screen">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Left side - Hero Section */}
                    <div
                        className={`flex items-center lg:order-1 order-2 min-h-screen py-12 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        <div className="space-y-6 lg:space-y-8 w-full">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/60 shadow-md hover:shadow-lg transition-shadow">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    Plateforme d&apos;apprentissage
                                </span>
                            </div>

                            {/* Main Title */}
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                                        Révise mieux,{" "}
                                    </span>
                                    <span className="text-gray-900">
                                        pas plus.
                                    </span>
                                </h1>
                                <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                                    Edukai génère des questions personnalisées à
                                    partir de tes cours en{" "}
                                    <span className="font-bold text-blue-600">
                                        20 secondes
                                    </span>
                                    .
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100/50 hover:bg-white/90 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-md">
                                            <feature.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Instagram Link - Discret */}
                            <div className="flex items-center justify-center pt-4">
                                <a
                                    href="https://www.instagram.com/edukaifr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                                >
                                    <Instagram className="w-4 h-4" />
                                    <span>Suivez-nous sur Instagram</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Auth Form */}
                    <div
                        className={`flex items-center lg:order-2 order-1 min-h-screen py-12 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        <div className="w-full flex flex-col items-center justify-center">
                            <Card className="w-full max-w-md shadow-2xl border border-blue-100/50 bg-white/80 backdrop-blur-xl hover:shadow-blue-200/50 hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
                                <CardContent className="p-8 sm:p-10 min-h-[600px] flex flex-col justify-center">
                                    <EdukaiHeader />
                                    <AuthContainer
                                        initialMode="login"
                                        onAuthSuccess={handleAuthSuccess}
                                        onAuthError={handleAuthError}
                                    />

                                    {/* Trust Indicators */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span>
                                                Données sécurisées et chiffrées
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
