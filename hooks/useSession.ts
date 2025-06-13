import { useState, useEffect } from "react";
import { sessionStorage } from "@/lib/session";
import {
  useAuthService,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/services/auth";

type User = AuthResponse["user"] | null;

export function useSession() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const authService = useAuthService();

  useEffect(() => {
    // Clean up any invalid data first
    sessionStorage.cleanupInvalidData();

    // Initialize user state from localStorage after hydration
    const storedUser = sessionStorage.getUser();
    setUser(storedUser);

    const token = sessionStorage.getToken();
    if (token && !storedUser) {
      // Validate token and get user data
      validateSession();
    } else if (!token && storedUser) {
      // Clear invalid user data if no token
      sessionStorage.clearSession();
      setUser(null);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const validateSession = async () => {
    try {
      const response = await authService.refreshToken();
      sessionStorage.setToken(response.token);
      // Get user data and update state
      setLoading(false);
    } catch (error: any) {
      // If refresh fails, clear session and continue
      console.warn("Token validation failed, clearing session:", error.message);
      sessionStorage.clearSession();
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      sessionStorage.setToken(response.token);
      sessionStorage.setUser(response.user);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData);
      sessionStorage.setToken(response.token);
      sessionStorage.setUser(response.user);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      sessionStorage.clearSession();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local session
      sessionStorage.clearSession();
      setUser(null);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
}
