import { useState, useEffect } from "react";
import { sessionStorage } from "@/lib/session";
import { authToast, handleError, translateApiError } from "@/lib/toast";
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
        const token = sessionStorage.getToken();

        setUser(storedUser);

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
            authToast.loginSuccess();
            return { success: true, data: response };
        } catch (error: any) {
            const errorMessage = translateApiError(
                error.response?.data?.message || error.message
            );
            authToast.loginError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            const response = await authService.register(userData);
            sessionStorage.setToken(response.token);
            sessionStorage.setUser(response.user);
            setUser(response.user);
            authToast.registerSuccess();
            return { success: true, data: response };
        } catch (error: any) {
            const errorMessage = translateApiError(
                error.response?.data?.message || error.message
            );
            authToast.registerError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            sessionStorage.clearSession();
            setUser(null);
            authToast.logoutSuccess();
        } catch (error) {
            // Even if logout fails on server, clear local session
            console.error("Erreur lors de la déconnexion:", error);
            authToast.logoutError();
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
