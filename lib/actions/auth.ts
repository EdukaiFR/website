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

// Reset password action
export async function resetPasswordAction(
    _data: ResetPasswordFormValues
): Promise<AuthResponse> {
    try {
        // TODO: Implement actual password reset logic

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock response - replace with actual password reset logic
        return {
            success: true,
            data: {
                message:
                    "Un email de réinitialisation a été envoyé à votre adresse",
            },
        };
    } catch (error) {
        console.error("Reset password error:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la réinitialisation",
        };
    }
}

// Change password action
export async function changePasswordAction(
    data: ChangePasswordFormValues
): Promise<AuthResponse> {
    try {
        // TODO: Implement actual password change logic

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

// Signout action
export async function signoutAction(): Promise<AuthResponse> {
    try {
        // TODO: Implement actual signout logic (clear tokens, etc.)

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
