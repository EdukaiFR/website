import { isTokenExpired } from "@/lib/auth-utils";
import { sessionStorage } from "@/lib/session";
import { authToast, translateApiError } from "@/lib/toast";
import { ApiError } from "@/lib/types/api";
import {
    AuthResponse,
    LoginCredentials,
    RegisterData,
    useAuthService,
} from "@/services/auth";
import { useEffect, useState } from "react";

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
        } else if (token && storedUser) {
            // Check if token is expired
            if (isTokenExpired(token)) {
                console.log("Token expired, clearing session");
                sessionStorage.clearSession();
                setUser(null);
                setLoading(false);
            } else {
                setLoading(false);
            }
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
            
            // Get current user ID to fetch fresh profile
            const currentUser = sessionStorage.getUser();
            // Handle both id formats
            const userId = currentUser?.id || currentUser?._id;
            
            if (userId) {
                const userProfile = await authService.getUserProfile(userId);
                sessionStorage.setUser(userProfile);
                setUser(userProfile);
            }
            
            setLoading(false);
        } catch {
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
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage = translateApiError(
                err.response?.data?.message || err.message || "Une erreur est survenue"
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
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage = translateApiError(
                err.response?.data?.message || err.message || "Une erreur est survenue"
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
        validateSession,
    };
}
