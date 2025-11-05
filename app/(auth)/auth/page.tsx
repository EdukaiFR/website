"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    AuthContainer,
    EdukaiHeader,
    FeatureCard,
} from "@/components/auth";

export default function Authpage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Automatic slider effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev === 0 ? 1 : 0));
        }, 6000); // Change slide every 6 seconds

        return () => clearInterval(interval);
    }, []);

    const handleAuthSuccess = () => {
        console.log("Authentication successful");
        // Redirect to dashboard or the page user was trying to access
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect") || "/";
        window.location.href = redirectTo;
    };

    const handleAuthError = (error: string) => {
        console.error("Authentication error:", error);
        // TODO: Handle auth errors (toast, etc.)
    };

    return (
        <div className="flex items-center justify-center p-2 sm:p-4 min-h-screen">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center justify-center w-full max-w-6xl">
                {/* Left side - Auth Form */}
                <div className="flex flex-col items-center justify-center w-full lg:order-1 order-2">
                    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                            <EdukaiHeader />
                            <AuthContainer
                                initialMode="login"
                                onAuthSuccess={handleAuthSuccess}
                                onAuthError={handleAuthError}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right side - Hero Section with Slider */}
                <div className="relative flex flex-col items-center justify-center w-full lg:order-2 order-1 h-48 sm:h-64 lg:h-[600px]">
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-pattern opacity-20"></div>

                        {/* Header Section - Always visible */}
                        <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6 z-30">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="text-white/80 inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/30">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
                                    Plateforme d&apos;apprentissage IA
                                </div>

                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-white drop-shadow-lg">
                                    Révise mieux,
                                    <br />
                                    <span className="text-yellow-300">
                                        pas plus.
                                    </span>
                                </h2>

                                <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed drop-shadow-md max-w-xs sm:max-w-sm hidden sm:block">
                                    Upload ton cours, attends 20 secondes et
                                    entraînes-toi sur des questions générées
                                    automatiquement par l&apos;IA !
                                </p>

                                {/* Mobile shorter description */}
                                <p className="text-xs text-white/90 leading-relaxed drop-shadow-md sm:hidden">
                                    IA pour générer tes questions
                                    d&apos;entraînement !
                                </p>
                            </div>
                        </div>

                        {/* Slider Container - Hidden on mobile and tablet, visible on desktop */}
                        <div className="absolute inset-0 pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-6 sm:pb-8 lg:pb-12 px-3 sm:px-4 lg:px-6 hidden lg:block">
                            <div className="relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl flex items-end">
                                {/* Slide 1 - Screenshot */}
                                <div
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                        currentSlide === 0
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 translate-x-full"
                                    }`}
                                >
                                    <div className="flex justify-center items-end h-full pb-2 sm:pb-4 pt-4 sm:pt-4">
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-2 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                                            <Image
                                                src="/preview/openCourse.svg"
                                                width={160}
                                                height={120}
                                                alt="Preview de l'application Edukai"
                                                className="sm:w-64 sm:h-48 lg:w-90 lg:h-55 rounded-lg sm:rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Slide 2 - Features */}
                                <div
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                        currentSlide === 1
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 -translate-x-full"
                                    }`}
                                >
                                    <div className="flex justify-center items-end h-full px-2 sm:px-4 pb-4 sm:pb-6 lg:pb-8">
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 max-w-xs sm:max-w-sm lg:max-w-md w-full">
                                            <FeatureCard
                                                color="yellow"
                                                title="IA Avancée"
                                                description="Questions personnalisées par l'IA"
                                            />
                                            <FeatureCard
                                                color="green"
                                                title="Rapide"
                                                description="Résultats en moins de 20s"
                                            />
                                            <FeatureCard
                                                color="pink"
                                                title="Adaptatif"
                                                description="S'adapte à ton niveau d'étude"
                                            />
                                            <FeatureCard
                                                color="purple"
                                                title="Intelligent"
                                                description="Analyse tes points faibles"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slide indicators */}
                        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 z-30 hidden lg:flex space-x-2">
                            <button
                                onClick={() => setCurrentSlide(0)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentSlide === 0
                                        ? "bg-white"
                                        : "bg-white/40"
                                }`}
                            />
                            <button
                                onClick={() => setCurrentSlide(1)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentSlide === 1
                                        ? "bg-white"
                                        : "bg-white/40"
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
