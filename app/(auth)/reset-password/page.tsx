"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/reset-password-with-token-form";

function ResetPasswordContent() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}