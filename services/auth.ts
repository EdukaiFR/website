import axios from "axios";
import { translateApiError } from "@/lib/toast";

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
        id: string;
        username: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    };
}

export interface AuthService {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<{ token: string }>;
}

export function useAuthService(): AuthService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        console.error(
            "❌ NEXT_PUBLIC_API_URL n'est pas défini ! Veuillez l'ajouter à votre fichier .env.local"
        );
    }

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
        } catch (error: any) {
            console.error(
                "Erreur de connexion:",
                error.response?.data?.message || error.message
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
            console.log("Déconnexion...");
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

    return { login, register, logout, refreshToken };
}
