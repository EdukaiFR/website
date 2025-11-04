"use client";

import Image from "next/image";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/reset-password-with-token-form";

function ResetPasswordContent() {
    return (
        <div className="flex items-center justify-center p-2 sm:p-4 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex items-center justify-center mb-6 sm:mb-8">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative">
                                    <Image
                                        src="/EdukaiLogo.svg"
                                        alt="Logo Edukai"
                                        width={32}
                                        height={32}
                                        className="sm:w-10 sm:h-10 rounded-full"
                                    />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Edukai
                                </h1>
                            </div>
                        </div>

                        {/* Reset Password Form */}
                        <ResetPasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                        <p className="mt-2 text-gray-600">Chargement...</p>
                    </div>
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}