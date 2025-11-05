"use client";

import { useEffect, useState } from "react";
import { AnimatedBackground } from "@/components/auth/page-sections/AnimatedBackground";
import { HeroSection } from "@/components/auth/page-sections/HeroSection";
import { AuthCard } from "@/components/auth/page-sections/AuthCard";

export default function Authpage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAuthSuccess = () => {
        const urlParams = new URLSearchParams(
            globalThis.location?.search || ""
        );
        const redirectTo = urlParams.get("redirect") || "/";

        // Delay redirect to allow toast to be visible
        setTimeout(() => {
            globalThis.location.href = redirectTo;
        }, 1500);
    };

    const handleAuthError = (error: string) => {
        console.error("Authentication error:", error);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-white">
            {/* Animated Background Elements */}
            <AnimatedBackground />

            {/* Main Content */}
            <div className="relative z-10 w-full min-h-screen">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <HeroSection mounted={mounted} />

                    {/* Auth Card */}
                    <AuthCard
                        mounted={mounted}
                        onAuthSuccess={handleAuthSuccess}
                        onAuthError={handleAuthError}
                    />
                </div>
            </div>
        </div>
    );
}
