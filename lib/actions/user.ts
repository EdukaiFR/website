"use server";

import axios, { AxiosError } from "axios";
import {
    ProfileSettingsFormValues,
    EducationSettingsFormValues,
    SubscriptionSettingsFormValues,
    PreferencesSettingsFormValues,
    CustomEducationRequestFormValues,
} from "@/lib/schemas/user";
import { translateApiError } from "@/lib/toast";

// Types for user responses
export interface UserResponse {
    success: boolean;
    error?: string;
    data?: unknown;
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    educationLevel: "college" | "lycee" | "superieur";
    currentClass: string;
    specialization?: string;
    subscriptionPlan: "free" | "premium" | "student";
    notifications: {
        email: boolean;
        push: boolean;
        weeklyReport: boolean;
    };
    profileVisibility: "public" | "friends" | "private";
    dataSharing: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Get user profile
export async function getUserProfileAction(): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Make actual API call to get user profile
        const response = await axios.get(`${apiUrl}/user/profile`, {
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error(
            "Erreur lors de la récupération du profil utilisateur:",
            error
        );
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la récupération du profil"
            ),
        };
    }
}

// Update profile settings
export async function updateProfileAction(
    data: ProfileSettingsFormValues
): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.put(`${apiUrl}/user/profile`, data, {
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour du profil"
            ),
        };
    }
}

// Update education settings
export async function updateEducationAction(
    data: EducationSettingsFormValues
): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Handle custom requests if present - these will be sent to the backend
        // The backend will handle getting the user info from the session
        const response = await axios.put(`${apiUrl}/user/education`, data, {
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error(
            "Erreur lors de la mise à jour des informations d'études:",
            error
        );
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour des informations d'études"
            ),
        };
    }
}

// Update subscription settings
export async function updateSubscriptionAction(
    data: SubscriptionSettingsFormValues
): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.put(`${apiUrl}/user/subscription`, data, {
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour de l'abonnement:", error);
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour de l'abonnement"
            ),
        };
    }
}

// Update preferences settings
export async function updatePreferencesAction(
    data: PreferencesSettingsFormValues
): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.put(`${apiUrl}/user/preferences`, data, {
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour des préférences:", error);
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la mise à jour des préférences"
            ),
        };
    }
}

// Delete user account
export async function deleteAccountAction(): Promise<UserResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.delete(`${apiUrl}/user/account`, {
            withCredentials: true,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        console.error("Erreur lors de la suppression du compte:", error);
        return {
            success: false,
            error: translateApiError(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    "Une erreur est survenue lors de la suppression du compte"
            ),
        };
    }
}

// Notify admin of custom education request
export async function notifyAdminCustomRequest(
    data: CustomEducationRequestFormValues
): Promise<UserResponse> {
    try {
        // TODO: Implement actual admin notification (email, database, etc.)

        // For now, just console.log as requested
        console.log("🔔 ADMIN NOTIFICATION - Custom Education Request:", {
            timestamp: new Date().toISOString(),
            type:
                data.type === "class"
                    ? "Demande de classe/cursus personnalisé"
                    : "Demande de spécialisation personnalisée",
            educationLevel: data.educationLevel,
            requestedValue: data.requestedValue,
            user: {
                name: data.userName,
                email: data.userEmail,
            },
            urgency: "normal",
            needsReview: true,
        });

        // Simulate notification processing
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
            success: true,
            data: {
                message: "Demande envoyée aux administrateurs",
            },
        };
    } catch (error) {
        console.error("Erreur lors de la notification admin:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de l'envoi de la demande",
        };
    }
}
