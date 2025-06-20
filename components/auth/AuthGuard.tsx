"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function AuthGuard({
  children,
  redirectTo = "/auth",
  fallback,
}: AuthGuardProps) {
  const { user, loading } = useAuthGuard({ redirectTo });

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      )
    );
  }

  if (!user) {
    return null; // Will redirect in useAuthGuard
  }

  return <>{children}</>;
}
