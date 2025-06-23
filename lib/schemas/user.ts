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
    student: {
        label: "Étudiant",
        price: "4,99€/mois",
        features: [
            "Questions illimitées",
            "Toutes matières",
            "Support étudiant",
            "Tarif préférentiel",
        ],
    },
} as const;

// User settings schema
export const userSettingsSchema = z.object({
    // Personal Information
    firstName: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    dateOfBirth: z.string().optional(),

    // Education
    educationLevel: z.enum(["college", "lycee", "superieur"], {
        required_error: "Le niveau d'étude est requis",
    }),
    currentClass: z.string().min(1, "La classe actuelle est requise"),
    specialization: z.string().optional(),

    // Subscription
    subscriptionPlan: z.enum(["free", "premium", "student"], {
        required_error: "Le plan d'abonnement est requis",
    }),

    // Preferences
    notifications: z.object({
        email: z.boolean().default(true),
        push: z.boolean().default(true),
        weeklyReport: z.boolean().default(true),
    }),

    // Privacy
    profileVisibility: z
        .enum(["public", "friends", "private"])
        .default("friends"),
    dataSharing: z.boolean().default(false),
});

export const profileSettingsSchema = z.object({
    firstName: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    dateOfBirth: z.string().optional(),
});

export const educationSettingsSchema = z.object({
    educationLevel: z.enum(["college", "lycee", "superieur"], {
        required_error: "Le niveau d'étude est requis",
    }),
    currentClass: z.string().min(1, "La classe actuelle est requise"),
    specialization: z.string().optional(),
    // Custom requests
    customClassRequest: z.string().optional(),
    customSpecializationRequest: z.string().optional(),
});

export const subscriptionSettingsSchema = z.object({
    subscriptionPlan: z.enum(["free", "premium", "student"], {
        required_error: "Le plan d'abonnement est requis",
    }),
});

export const preferencesSettingsSchema = z.object({
    notifications: z.object({
        email: z.boolean(),
        push: z.boolean(),
        weeklyReport: z.boolean(),
    }),
    profileVisibility: z.enum(["public", "friends", "private"]),
    dataSharing: z.boolean(),
});

// Custom request schema
export const customEducationRequestSchema = z.object({
    type: z.enum(["class", "specialization"]),
    educationLevel: z.enum(["college", "lycee", "superieur"]),
    requestedValue: z
        .string()
        .min(2, "La demande doit contenir au moins 2 caractères"),
    userEmail: z.string().email(),
    userName: z.string(),
});

// TypeScript types
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
export type CustomEducationRequestFormValues = z.infer<
    typeof customEducationRequestSchema
>;

export type EducationLevel = keyof typeof educationLevels;
export type SubscriptionPlan = keyof typeof subscriptionPlans;
