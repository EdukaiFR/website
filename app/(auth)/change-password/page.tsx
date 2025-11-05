"use client";

import { useRouter } from "next/navigation";
import { AuthPageLayout, ChangePasswordForm } from "@/components/auth";

export default function ChangePasswordPage() {
    const router = useRouter();

    const handleSuccess = () => {
        // Could redirect to profile page or stay on the same page
        // router.push('/profile');
    };

    const handleError = (error: string) => {
        console.error("Password change error:", error);
        // Handle error (could show toast notification)
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <AuthPageLayout>
            <ChangePasswordForm
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleCancel}
            />
        </AuthPageLayout>
    );
}
