import { ApiError } from "@/lib/types/api";
import axios from "axios";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        _id: string;
        username: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        accountPlan?: "free" | "premium";
        subscriptionStatus?: string;
        currentPeriodEnd?: string;
        cancelAtPeriodEnd?: boolean;
    };
}

export interface ApiMessageResponse {
    message: string;
    status: string;
}

export interface AuthService {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<{ token: string }>;
    getUserProfile: (userId: string) => Promise<AuthResponse["user"]>;
    verifyPassword: (password: string) => Promise<ApiMessageResponse>;
    deleteUserAccount: (userId: string) => Promise<ApiMessageResponse>;
}

export function useAuthService(): AuthService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const login = async (
        credentials: LoginCredentials
    ): Promise<AuthResponse> => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/login`,
                credentials,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Erreur de connexion:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const register = async (userData: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/register`,
                userData,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await axios.post(
                `${apiUrl}/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
            throw error;
        }
    };

    const refreshToken = async (): Promise<{ token: string }> => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur de renouvellement du token:", error);
            throw error;
        }
    };

    const getUserProfile = async (
        userId: string
    ): Promise<AuthResponse["user"]> => {
        try {
            const response = await axios.get(`${apiUrl}/users/${userId}`, {
                withCredentials: true,
            });
            return response.data.user;
        } catch (error) {
            console.error("Erreur de récupération du profil:", error);
            throw error;
        }
    };

    const verifyPassword = async (
        password: string
    ): Promise<ApiMessageResponse> => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/verify-password`,
                { password },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la vérification de mot de passe:",
                error
            );
            throw error;
        }
    };

    const deleteUserAccount = async (
        userId: string
    ): Promise<ApiMessageResponse> => {
        try {
            const response = await axios.delete(`${apiUrl}/users/${userId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression du compte:", error);
            throw error;
        }
    };

    return {
        login,
        register,
        logout,
        refreshToken,
        getUserProfile,
        verifyPassword,
        deleteUserAccount,
    };
}
