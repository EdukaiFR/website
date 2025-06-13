import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseAuthGuardOptions {
  redirectTo?: string;
  enabled?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = "/auth", enabled = true } = options;
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (enabled && !loading && !user) {
      // Get current path to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentPath
      )}`;
      router.push(redirectUrl);
    }
  }, [user, loading, router, enabled, redirectTo]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
  };
}
