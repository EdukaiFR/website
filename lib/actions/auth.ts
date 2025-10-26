import {
    SigninFormValues,
    SignupFormValues,
    ResetPasswordFormValues,
    ChangePasswordFormValues,
} from "@/lib/schemas/auth";
import { LoginCredentials, RegisterData } from "@/services/auth";
import { sessionStorage } from "@/lib/session";
import { translateApiError } from "@/lib/toast";
import axios, { AxiosError } from "axios";

// Types for auth responses
export interface AuthResponse {
    success: boolean;
    error?: string;
    data?: unknown;
}

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
}

// Signin action
export async function signinAction(
    data: SigninFormValues
): Promise<AuthResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        // Map form data to API format
        const credentials: LoginCredentials = {
            username: data.email, // API expects username, form uses email
            password: data.password,
        };

        const response = await axios.post(`${apiUrl}/auth/login`, credentials, {
            withCredentials: true,
        });

        sessionStorage.setToken(response.data.token);
        sessionStorage.setUser(response.data.user);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error("Signin error:", error);
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message || "Une erreur est survenue lors de la connexion"
            ),
        };
    }
}

// Signup action
export async function signupAction(
    data: SignupFormValues
): Promise<AuthResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        // Map form data to API format
        const userData: RegisterData = {
            username: data.email, // API expects username, form uses email
            password: data.password,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        };

        const response = await axios.post(`${apiUrl}/auth/register`, userData, {
            withCredentials: true,
        });

        sessionStorage.setToken(response.data.token);
        sessionStorage.setUser(response.data.user);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error("Signup error:", error);
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la création du compte"
            ),
        };
    }
}

// Reset password action (request password reset email)
export async function resetPasswordAction(
    data: ResetPasswordFormValues
): Promise<AuthResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await axios.post(`${apiUrl}/auth/forgot-password`, {
            email: data.email,
        });

        return {
            success: true,
            data: {
                message: response.data.message ||
                    "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
            },
        };
    } catch (error: unknown) {
        console.error("Reset password error:", error);

        // Check if it's a rate limit error
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 429) {
            return {
                success: false,
                error: "Trop de tentatives. Veuillez réessayer dans une heure.",
            };
        }

        return {
            success: false,
            error: translateApiError(
                axiosError.response?.data?.message ||
                "Une erreur est survenue lors de la réinitialisation"
            ),
        };
    }
}

// Change password action
export async function changePasswordAction(
    data: ChangePasswordFormValues
): Promise<AuthResponse> {
    try {
        // TODO: Implement actual password change logic
        console.log("Change password attempt");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock response - replace with actual password change logic
        // Verify current password (mock)
        if (data.currentPassword !== "currentpassword") {
            return {
                success: false,
                error: "Le mot de passe actuel est incorrect",
            };
        }

        return {
            success: true,
            data: {
                message: "Votre mot de passe a été mis à jour avec succès",
            },
        };
    } catch (error) {
        console.error("Change password error:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la modification du mot de passe",
        };
    }
}

// Verify reset token action
export async function verifyResetTokenAction(
    token: string
): Promise<AuthResponse & { maskedEmail?: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await axios.get(`${apiUrl}/auth/verify-reset-token/${token}`);

        return {
            success: response.data.isValid,
            data: response.data,
            maskedEmail: response.data.maskedEmail,
        };
    } catch (error: unknown) {
        console.error("Verify reset token error:", error);
        const axiosError = error as AxiosError<{ message: string }>;

        return {
            success: false,
            error: translateApiError(
                axiosError.response?.data?.message ||
                "Le lien de réinitialisation est invalide ou expiré"
            ),
        };
    }
}

// Reset password with token action
export async function resetPasswordWithTokenAction(
    token: string,
    newPassword: string
): Promise<AuthResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await axios.post(`${apiUrl}/auth/reset-password`, {
            token,
            newPassword,
        });

        return {
            success: true,
            data: {
                message: response.data.message ||
                    "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
            },
        };
    } catch (error: unknown) {
        console.error("Reset password with token error:", error);
        const axiosError = error as AxiosError<{ message: string }>;

        return {
            success: false,
            error: translateApiError(
                axiosError.response?.data?.message ||
                "Une erreur est survenue lors de la réinitialisation du mot de passe"
            ),
        };
    }
}

// Signout action
export async function signoutAction(): Promise<AuthResponse> {
    try {
        // TODO: Implement actual signout logic (clear tokens, etc.)
        console.log("Signout attempt");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            data: {
                message: "Déconnexion réussie",
            },
        };
    } catch (error) {
        console.error("Signout error:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la déconnexion",
        };
    }
}
