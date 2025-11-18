"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    SigninForm,
    SignupForm,
    ResetPasswordForm,
    ChangePasswordForm,
} from "@/components/auth";

type DemoMode = "signin" | "signup" | "reset" | "change" | null;

export default function AuthDemoPage() {
    const [selectedForm, setSelectedForm] = useState<DemoMode>(null);

    const handleSuccess = () => {
        // Could show a success message
    };

    const handleError = (error: string) => {
        console.error("Auth error:", error);
        // Could show an error message
    };

    const renderForm = () => {
        switch (selectedForm) {
            case "signin":
                return (
                    <SigninForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                        onForgotPassword={() => setSelectedForm("reset")}
                    />
                );
            case "signup":
                return (
                    <SignupForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                );
            case "reset":
                return (
                    <ResetPasswordForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                        onBack={() => setSelectedForm("signin")}
                    />
                );
            case "change":
                return (
                    <ChangePasswordForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                        onCancel={() => setSelectedForm(null)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Auth Components Demo
                    </h1>
                    <p className="text-gray-600">
                        Test all authentication forms in one place
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select a Form to Test</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={() => setSelectedForm("signin")}
                                variant={
                                    selectedForm === "signin"
                                        ? "default"
                                        : "outline"
                                }
                                className="w-full"
                            >
                                Signin Form
                            </Button>
                            <Button
                                onClick={() => setSelectedForm("signup")}
                                variant={
                                    selectedForm === "signup"
                                        ? "default"
                                        : "outline"
                                }
                                className="w-full"
                            >
                                Signup Form
                            </Button>
                            <Button
                                onClick={() => setSelectedForm("reset")}
                                variant={
                                    selectedForm === "reset"
                                        ? "default"
                                        : "outline"
                                }
                                className="w-full"
                            >
                                Reset Password Form
                            </Button>
                            <Button
                                onClick={() => setSelectedForm("change")}
                                variant={
                                    selectedForm === "change"
                                        ? "default"
                                        : "outline"
                                }
                                className="w-full"
                            >
                                Change Password Form
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Selected Form Display */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedForm
                                    ? `${selectedForm.charAt(0).toUpperCase() + selectedForm.slice(1)} Form`
                                    : "Select a Form"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedForm ? (
                                renderForm()
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Choose a form from the left to see it in
                                    action
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Info Section */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Mock Credentials for Testing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Signin
                                </h4>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Email:</strong> test@example.com
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Password:</strong> password
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Change Password
                                </h4>
                                <p className="text-sm text-gray-600">
                                    <strong>Current Password:</strong>{" "}
                                    currentpassword
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
