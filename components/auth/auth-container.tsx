"use client";

import { useState } from "react";
import { SigninForm } from "./signin-form";
import { SignupForm } from "./signup-form";
import { ResetPasswordForm } from "./reset-password-form";
import type { AuthMode } from "@/lib/schemas/auth";

export interface AuthContainerProps {
    initialMode?: AuthMode;
    onAuthSuccess?: () => void;
    onAuthError?: (error: string) => void;
}

export function AuthContainer({
    initialMode = "login",
    onAuthSuccess,
    onAuthError,
}: AuthContainerProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode);

    const handleAuthSuccess = () => {
        onAuthSuccess?.();
    };

    const handleAuthError = (error: string) => {
        console.error("Auth error for mode:", mode, error);
        onAuthError?.(error);
    };

    const renderAuthForm = () => {
        const formContent = (() => {
            switch (mode) {
                case "login":
                    return (
                        <SigninForm
                            onSuccess={handleAuthSuccess}
                            onError={handleAuthError}
                            onForgotPassword={() => setMode("forgot")}
                        />
                    );
                case "register":
                    return (
                        <SignupForm
                            onSuccess={handleAuthSuccess}
                            onError={handleAuthError}
                        />
                    );
                case "forgot":
                    return (
                        <ResetPasswordForm
                            onSuccess={handleAuthSuccess}
                            onError={handleAuthError}
                            onBack={() => setMode("login")}
                        />
                    );
                default:
                    return null;
            }
        })();

        return (
            <div className="transition-all duration-300 ease-in-out">
                {formContent}
            </div>
        );
    };

    const renderFooterNavigation = () => {
        if (mode === "forgot") {
            return null; // Reset password form handles its own navigation
        }

        return (
            <div className="mt-6 sm:mt-8 text-center">
                {mode === "login" && (
                    <p className="text-sm text-gray-600">
                        Pas encore de compte ?{" "}
                        <button
                            onClick={() => setMode("register")}
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                            Créer un compte gratuitement
                        </button>
                    </p>
                )}
                {mode === "register" && (
                    <p className="text-sm text-gray-600">
                        Déjà un compte ?{" "}
                        <button
                            onClick={() => setMode("login")}
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                            Se connecter
                        </button>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Auth Form */}
            {renderAuthForm()}

            {/* Footer Navigation */}
            {renderFooterNavigation()}
        </div>
    );
}
