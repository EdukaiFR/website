"use client";

import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

interface WithAuthOptions {
  redirectTo?: string;
  loadingComponent?: ComponentType;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = "/auth", loadingComponent: LoadingComponent } = options;

  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        // Get current path to redirect back after login
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
          currentPath
        )}`;
        router.push(redirectUrl);
      }
    }, [user, loading, router]);

    if (loading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect in useEffect
    }

    return <WrappedComponent {...props} />;
  };
}
