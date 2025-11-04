"use client";

import { Suspense } from "react";
import { AuthPageLayout, ResetPasswordForm } from "@/components/auth";

function ResetPasswordContent() {
    return (
        <AuthPageLayout>
            <ResetPasswordForm />
        </AuthPageLayout>
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