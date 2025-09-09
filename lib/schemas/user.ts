import * as z from "zod";

// Education levels and specializations
export const educationLevels = {
    college: {
        label: "Collège",
        classes: ["6ème", "5ème", "4ème", "3ème"],
    },
    lycee: {
        label: "Lycée",
        classes: ["Seconde", "Première", "Terminale"],
        specializations: [
            "Générale - Mathématiques, Physique-Chimie, SVT",
            "Générale - Mathématiques, Physique-Chimie, Sciences de l'Ingénieur",
            "Générale - Mathématiques, SVT, Physique-Chimie",
            "Générale - Histoire-Géo, SES, Mathématiques",
            "Générale - Français, Histoire-Géo, Philosophie",
            "Générale - Langues, Histoire-Géo, SES",
            "STMG - Sciences et Technologies du Management et de la Gestion",
            "STI2D - Sciences et Technologies de l'Industrie et du Développement Durable",
            "STL - Sciences et Technologies de Laboratoire",
            "ST2S - Sciences et Technologies de la Santé et du Social",
        ],
    },
    superieur: {
        label: "Études Supérieures",
        cursus: [
            "Licence 1 - Mathématiques",
            "Licence 1 - Physique",
            "Licence 1 - Informatique",
            "Licence 1 - Biologie",
            "Licence 1 - Économie-Gestion",
            "Licence 1 - Droit",
            "Licence 1 - Histoire",
            "Licence 1 - Psychologie",
            "Licence 2 - Mathématiques",
            "Licence 2 - Physique",
            "Licence 2 - Informatique",
            "Licence 2 - Biologie",
            "Licence 2 - Économie-Gestion",
            "Licence 2 - Droit",
            "Licence 3 - Mathématiques",
            "Licence 3 - Physique",
            "Licence 3 - Informatique",
            "Licence 3 - Biologie",
            "Licence 3 - Économie-Gestion",
            "Licence 3 - Droit",
            "Master 1 - Mathématiques Appliquées",
            "Master 1 - Informatique",
            "Master 1 - Finance",
            "Master 1 - Management",
            "Master 2 - Mathématiques Appliquées",
            "Master 2 - Informatique",
            "Master 2 - Finance",
            "Master 2 - Management",
            "CPGE - Maths Sup (MPSI)",
            "CPGE - Maths Sup (PCSI)",
            "CPGE - Maths Sup (PTSI)",
            "CPGE - Maths Spé (MP)",
            "CPGE - Maths Spé (PC)",
            "CPGE - Maths Spé (PSI)",
            "CPGE - Économique et Commerciale",
            "BTS - Informatique",
            "BTS - Management",
            "BTS - Commerce",
            "DUT/BUT - Informatique",
            "DUT/BUT - Génie Électrique",
            "École d'Ingénieur - 1ère année",
            "École d'Ingénieur - 2ème année",
            "École d'Ingénieur - 3ème année",
            "École de Commerce - 1ère année",
            "École de Commerce - 2ème année",
            "École de Commerce - 3ème année",
        ],
    },
} as const;

export const subscriptionPlans = {
    free: {
        label: "Gratuit",
        price: "0€/mois",
        features: [
            "5 questions par jour",
            "Matières de base",
            "Support communautaire",
        ],
    },
    premium: {
        label: "Premium",
        price: "9,99€/mois",
        features: [
            "Questions illimitées",
            "Toutes matières",
            "Support prioritaire",
            "Statistiques avancées",
        ],
    },
} as const;

// User settings schema (updated for new API)
export const userSettingsSchema = z.object({
    // Personal Information
    firstName: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    username: z
        .string()
        .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères"),
    profilePic: z
        .string()
        .optional()
        .refine(
            val => {
                if (!val || val === "") return true;

                // Check if it's a base64 image
                const base64Regex =
                    /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
                if (base64Regex.test(val)) {
                    // Check base64 size limit (approximately 2MB when encoded)
                    const base64Size = (val.length * 3) / 4;
                    return base64Size <= 2 * 1024 * 1024;
                }

                // Check if it's a valid URL
                return z.string().url().safeParse(val).success;
            },
            {
                message:
                    "Photo de profil invalide (URL ou image max 2MB requise)",
            }
        ),

    // Education (updated field names to match new API)
    grade: z.string().min(1, "La classe/grade est requise"),
    levelOfStudy: z.string().min(1, "Le niveau d'études est requis"),
    institution: z.string().optional(),
});

export const profileSettingsSchema = z.object({
    firstName: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    username: z
        .string()
        .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères"),
    profilePic: z
        .string()
        .optional()
        .refine(
            val => {
                if (!val || val === "") return true;

                // Check if it's a base64 image
                const base64Regex =
                    /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
                if (base64Regex.test(val)) {
                    // Check base64 size limit (approximately 2MB when encoded)
                    const base64Size = (val.length * 3) / 4;
                    return base64Size <= 2 * 1024 * 1024;
                }

                // Check if it's a valid URL
                return z.string().url().safeParse(val).success;
            },
            {
                message:
                    "Photo de profil invalide (URL ou image max 2MB requise)",
            }
        ),
});

export const educationSettingsSchema = z.object({
    grade: z.string().min(1, "La classe/grade est requise"),
    levelOfStudy: z.string().min(1, "Le niveau d'études est requis"),
    institution: z.string().optional(),
});

export const subscriptionSettingsSchema = z.object({
    accountPlan: z.enum(["free", "premium"], {
        required_error: "Le plan d'abonnement est requis",
    }),
});

// Preferences schema - basic structure for UI compatibility
export const preferencesSettingsSchema = z.object({
    notifications: z
        .object({
            email: z.boolean(),
            push: z.boolean(),
            weeklyReport: z.boolean(),
        })
        .optional(),
    profileVisibility: z.string().optional(),
    dataSharing: z.boolean().optional(),
});

// Account deletion confirmation schema
export const deleteAccountSchema = z.object({
    confirmPassword: z.string().min(1, "Mot de passe requis pour confirmer"),
});

// TypeScript types (updated for new API)
export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;
export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
export type EducationSettingsFormValues = z.infer<
    typeof educationSettingsSchema
>;
export type SubscriptionSettingsFormValues = z.infer<
    typeof subscriptionSettingsSchema
>;
export type PreferencesSettingsFormValues = z.infer<
    typeof preferencesSettingsSchema
>;
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export type EducationLevel = keyof typeof educationLevels;
export type SubscriptionPlan = keyof typeof subscriptionPlans;

// API response types
export interface ApiUser {
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

export interface ApiResponse<T = unknown> {
    user?: T;
    message: string;
    status: "success" | "error";
}

// Error codes from API
export const API_ERROR_CODES = {
    // Auth errors
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_USERNAME_REQUIRED: "Email or username and password are required",
    LOGIN_FAILED: "Login failed.",
    REGISTRATION_REQUIRED_FIELDS:
        "Email, password, first name, and last name are required",
    EMAIL_USERNAME_TAKEN: "Email or username already taken",
    REGISTRATION_FAILED: "Registration failed.",

    // User management errors
    NO_PERMISSION_VIEW:
        "You do not have permission to see this user information.",
    USER_NOT_FOUND: "User not found",
    ERROR_GETTING_USER: "Error getting user",
    NO_VALID_FIELDS: "No valid fields to update.",
    NO_PERMISSION_UPDATE:
        "You do not have permission to update this user information.",
    ERROR_UPDATING_USER: "Error updating user",
    NO_PERMISSION_DELETE: "You do not have permission to delete this user.",
    ERROR_DELETING_USER: "Error deleting user",
} as const;
