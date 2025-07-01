import * as z from "zod";

// Base validation schemas
export const signinSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    rememberMe: z.boolean().optional(),
});

export const signupSchema = z
    .object({
        firstName: z.string().min(2, "Prénom requis (min. 2 caractères)"),
        lastName: z.string().min(2, "Nom requis (min. 2 caractères)"),
        email: z.string().email("Adresse email invalide"),
        password: z
            .string()
            .min(6, "Le mot de passe doit contenir au moins 6 caractères")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"
            ),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export const resetPasswordSchema = z.object({
    email: z.string().email("Adresse email invalide"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
        newPassword: z
            .string()
            .min(
                6,
                "Le nouveau mot de passe doit contenir au moins 6 caractères"
            )
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Le nouveau mot de passe doit contenir une majuscule, une minuscule et un chiffre"
            ),
        confirmNewPassword: z.string(),
    })
    .refine(data => data.newPassword === data.confirmNewPassword, {
        message: "Les nouveaux mots de passe ne correspondent pas",
        path: ["confirmNewPassword"],
    })
    .refine(data => data.currentPassword !== data.newPassword, {
        message: "Le nouveau mot de passe doit être différent de l'ancien",
        path: ["newPassword"],
    });

// TypeScript types inferred from schemas
export type SigninFormValues = z.infer<typeof signinSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// Password requirements for UI validation
export interface PasswordRequirement {
    label: string;
    met: boolean;
}

export const getPasswordRequirements = (
    password: string
): PasswordRequirement[] => [
    { label: "Au moins 6 caractères", met: password?.length >= 6 },
    { label: "Une majuscule", met: /[A-Z]/.test(password || "") },
    { label: "Une minuscule", met: /[a-z]/.test(password || "") },
    { label: "Un chiffre", met: /\d/.test(password || "") },
];

// Auth state types
export type AuthMode = "login" | "register" | "forgot";

export interface AuthState {
    mode: AuthMode;
    isLoading: boolean;
    error: string | null;
}
