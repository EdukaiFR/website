"use client";

import axios, { AxiosError } from "axios";
import {
    ProfileSettingsFormValues,
    EducationSettingsFormValues,
    SubscriptionSettingsFormValues,
    PreferencesSettingsFormValues,
    DeleteAccountFormValues,
    API_ERROR_CODES,
} from "@/lib/schemas/user";
// translateApiError is imported but we use our local version

// Types for user responses
export interface UserResponse<T = unknown> {
    success: boolean;
    error?: string;
    data?: T;
}

// Updated UserProfile to match the new API structure
export interface UserProfile {
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
    grade: string;
    levelOfStudy: string;
    institution?: string;
    accountPlan: "free" | "premium";
    role: "user" | "admin" | "moderator";
}

// Helper function to translate API error messages
function translateApiErrorLocal(message: string): string {
    const errorMap: Record<string, string> = {
        [API_ERROR_CODES.INVALID_CREDENTIALS]: "Identifiants invalides",
        [API_ERROR_CODES.EMAIL_USERNAME_REQUIRED]:
            "Email ou nom d'utilisateur et mot de passe requis",
        [API_ERROR_CODES.LOGIN_FAILED]: "Échec de la connexion",
        [API_ERROR_CODES.REGISTRATION_REQUIRED_FIELDS]:
            "Email, mot de passe, prénom et nom sont requis",
        [API_ERROR_CODES.EMAIL_USERNAME_TAKEN]:
            "Email ou nom d'utilisateur déjà utilisé",
        [API_ERROR_CODES.REGISTRATION_FAILED]: "Échec de l'inscription",
        [API_ERROR_CODES.NO_PERMISSION_VIEW]:
            "Vous n'avez pas la permission de voir ces informations utilisateur",
        [API_ERROR_CODES.USER_NOT_FOUND]: "Utilisateur non trouvé",
        [API_ERROR_CODES.ERROR_GETTING_USER]:
            "Erreur lors de la récupération de l'utilisateur",
        [API_ERROR_CODES.NO_VALID_FIELDS]: "Aucun champ valide à mettre à jour",
        [API_ERROR_CODES.NO_PERMISSION_UPDATE]:
            "Vous n'avez pas la permission de mettre à jour ces informations utilisateur",
        [API_ERROR_CODES.ERROR_UPDATING_USER]:
            "Erreur lors de la mise à jour de l'utilisateur",
        [API_ERROR_CODES.NO_PERMISSION_DELETE]:
            "Vous n'avez pas la permission de supprimer cet utilisateur",
        [API_ERROR_CODES.ERROR_DELETING_USER]:
            "Erreur lors de la suppression de l'utilisateur",
    };

    return errorMap[message] || message;
}

// Helper function to get authorization headers
function getAuthHeaders() {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
}

// Get user profile - we'll need to extract user ID from the stored user data or token
export async function getUserProfileAction(): Promise<
    UserResponse<UserProfile>
> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Get user ID from stored session data
        let userId: string | null = null;
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user_data");
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    userId = user.id || user._id;
                } catch (e) {
                    console.error("Error parsing user data:", e);
                }
            }
        }

        if (!userId) {
            return {
                success: false,
                error: "Utilisateur non authentifié",
            };
        }

        const response = await axios.get(`${apiUrl}/users/${userId}`, {
            headers: {
                ...getAuthHeaders(),
            },
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data.user,
        };
    } catch (error: unknown) {
        console.error(
            "Erreur lors de la récupération du profil utilisateur:",
            error
        );
        return {
            success: false,
            error: translateApiErrorLocal(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la récupération du profil"
            ),
        };
    }
}

// Update profile settings
export async function updateProfileAction(
    data: ProfileSettingsFormValues,
    userId: string
): Promise<UserResponse<UserProfile>> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.patch(`${apiUrl}/users/${userId}`, data, {
            headers: {
                ...getAuthHeaders(),
            },
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data.user,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        return {
            success: false,
            error: translateApiErrorLocal(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour du profil"
            ),
        };
    }
}

// Update education settings
export async function updateEducationAction(
    data: EducationSettingsFormValues,
    userId: string
): Promise<UserResponse<UserProfile>> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.patch(`${apiUrl}/users/${userId}`, data, {
            headers: {
                ...getAuthHeaders(),
            },
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data.user,
        };
    } catch (error: unknown) {
        console.error(
            "Erreur lors de la mise à jour des informations d'études:",
            error
        );
        return {
            success: false,
            error: translateApiErrorLocal(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour des informations d'études"
            ),
        };
    }
}

// Update subscription settings
export async function updateSubscriptionAction(
    data: SubscriptionSettingsFormValues,
    userId: string
): Promise<UserResponse<UserProfile>> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.patch(`${apiUrl}/users/${userId}`, data, {
            headers: {
                ...getAuthHeaders(),
            },
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data.user,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour de l'abonnement:", error);
        return {
            success: false,
            error: translateApiErrorLocal(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour de l'abonnement"
            ),
        };
    }
}

// Update preferences settings
export async function updatePreferencesAction(
    data: PreferencesSettingsFormValues,
    userId: string
): Promise<UserResponse<UserProfile>> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.patch(`${apiUrl}/users/${userId}`, data, {
            headers: {
                ...getAuthHeaders(),
            },
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data.user,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour des préférences:", error);
        return {
            success: false,
            error: translateApiErrorLocal(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour des préférences"
            ),
        };
    }
}

// Delete user account
export async function deleteAccountAction(
    data: DeleteAccountFormValues,
    userId: string
): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        await axios.delete(`${apiUrl}/users/${userId}`, {
            headers: {
                ...getAuthHeaders(),
            },
            withCredentials: true,
        });

        return {
            success: true,
            data: { message: "Compte supprimé avec succès" },
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la suppression du compte:", error);
        return {
            success: false,
            error: translateApiErrorLocal(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la suppression du compte"
            ),
        };
    }
}
