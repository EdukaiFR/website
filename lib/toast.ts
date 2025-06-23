import { AxiosError } from "axios";
import { toast } from "sonner";

// API Error Translation Map - Convert English API errors to French
const apiErrorTranslations: Record<string, string> = {
    // Authentication errors
    "Invalid credentials": "Identifiants invalides",
    "Invalid username or password":
        "Nom d'utilisateur ou mot de passe incorrect",
    "User not found": "Utilisateur introuvable",
    "Email not found": "Adresse email introuvable",
    "Password incorrect": "Mot de passe incorrect",
    "Account not found": "Compte introuvable",
    "Authentication failed": "Échec de l'authentification",
    "Access denied": "Accès refusé",
    "Token expired": "Session expirée",
    "Invalid token": "Token invalide",
    "Session expired": "Session expirée",
    Unauthorized: "Non autorisé",
    Forbidden: "Accès interdit",

    // Registration errors
    "Email already exists": "Cette adresse email est déjà utilisée",
    "User already exists": "Cet utilisateur existe déjà",
    "Username already taken": "Ce nom d'utilisateur est déjà pris",
    "Email already registered": "Email déjà enregistré",
    "Account already exists": "Ce compte existe déjà",

    // Validation errors
    "Email is required": "L'adresse email est requise",
    "Password is required": "Le mot de passe est requis",
    "Invalid email format": "Format d'email invalide",
    "Password too short": "Mot de passe trop court",
    "Password too weak": "Mot de passe trop faible",
    "Passwords do not match": "Les mots de passe ne correspondent pas",
    "Required field": "Champ requis",
    "Invalid input": "Saisie invalide",
    "Missing required fields": "Champs obligatoires manquants",

    // Network/Server errors
    "Network error": "Erreur de connexion",
    "Server error": "Erreur serveur",
    "Internal server error": "Erreur interne du serveur",
    "Service unavailable": "Service indisponible",
    "Connection timeout": "Délai de connexion dépassé",
    "Request timeout": "Délai de requête dépassé",
    "Bad request": "Requête invalide",
    "Not found": "Élément introuvable",
    "Method not allowed": "Méthode non autorisée",
    "Too many requests": "Trop de requêtes",
    "Rate limit exceeded": "Limite de taux dépassée",

    // File/Upload errors
    "File too large": "Fichier trop volumineux",
    "Invalid file type": "Type de fichier invalide",
    "Upload failed": "Échec du téléchargement",
    "File not found": "Fichier introuvable",
    "Permission denied": "Permission refusée",

    // Course/Content errors
    "Course not found": "Cours introuvable",
    "Quiz not found": "Quiz introuvable",
    "Exam not found": "Examen introuvable",
    "Content not found": "Contenu introuvable",
    "Invalid course data": "Données de cours invalides",
    "Course creation failed": "Échec de la création du cours",

    // Generic errors
    "Something went wrong": "Une erreur s'est produite",
    "An error occurred": "Une erreur s'est produite",
    "Unknown error": "Erreur inconnue",
    "Unexpected error": "Erreur inattendue",
    "Operation failed": "Opération échouée",
    "Request failed": "Requête échouée",
    "Processing failed": "Traitement échoué",
};

// Function to translate API error messages
export const translateApiError = (errorMessage: string): string => {
    if (!errorMessage || typeof errorMessage !== "string") {
        return "Une erreur inattendue s'est produite";
    }

    // Check for exact matches first
    const exactMatch = apiErrorTranslations[errorMessage];
    if (exactMatch) {
        return exactMatch;
    }

    // Check for partial matches (case insensitive)
    const lowerMessage = errorMessage.toLowerCase();
    for (const [englishError, frenchError] of Object.entries(
        apiErrorTranslations
    )) {
        if (lowerMessage.includes(englishError.toLowerCase())) {
            return frenchError;
        }
    }

    // If no translation found, return the original message
    // (it might already be in French or be a custom message)
    return errorMessage;
};

// Enhanced error handler utility that translates API errors
export const handleError = (error: unknown, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ""}:`, error);

    let errorMessage = "Une erreur inattendue s'est produite";

    // Extract error message from different possible sources
    if ((error as AxiosError<{ message: string }>)?.response?.data?.message) {
        errorMessage = translateApiError(
            (error as AxiosError<{ message: string }>)?.response?.data
                ?.message || ""
        );
    } else if ((error as AxiosError<{ message: string }>)?.message) {
        errorMessage = translateApiError(
            (error as AxiosError<{ message: string }>)?.message || ""
        );
    } else if (typeof error === "string") {
        errorMessage = translateApiError(error);
    }

    // Determine error type and show appropriate toast
    const statusCode = (error as AxiosError<{ status: number }>)?.response
        ?.status;
    if (statusCode === 401) {
        authToast.sessionExpired();
    } else if (statusCode === 403) {
        showToast.error(translateApiError("Access denied"));
    } else if (statusCode === 404) {
        showToast.error(translateApiError("Not found"));
    } else if (statusCode && statusCode >= 500) {
        showToast.error(translateApiError("Server error"));
    } else if (
        (error as AxiosError<{ code: string }>)?.code === "NETWORK_ERROR" ||
        !(error as AxiosError<{ response: unknown }>)?.response
    ) {
        showToast.error(translateApiError("Network error"));
    } else {
        showToast.error(errorMessage);
    }
};

// French toast messages for common scenarios
export const toastMessages = {
    // Authentication
    auth: {
        loginSuccess: "Connexion réussie ! Bienvenue sur Edukai.",
        loginError: "Erreur de connexion. Vérifiez vos identifiants.",
        registerSuccess: "Compte créé avec succès ! Bienvenue sur Edukai.",
        registerError: "Erreur lors de la création du compte.",
        logoutSuccess: "Déconnexion réussie. À bientôt !",
        logoutError: "Erreur lors de la déconnexion.",
        resetPasswordSuccess: "Email de réinitialisation envoyé avec succès.",
        resetPasswordError:
            "Erreur lors de l'envoi de l'email de réinitialisation.",
        changePasswordSuccess: "Mot de passe modifié avec succès.",
        changePasswordError: "Erreur lors de la modification du mot de passe.",
        sessionExpired: "Votre session a expiré. Veuillez vous reconnecter.",
        tokenRefreshError: "Erreur lors du renouvellement de la session.",
    },

    // User Profile & Settings
    profile: {
        updateSuccess: "Profil mis à jour avec succès.",
        updateError: "Erreur lors de la mise à jour du profil.",
        educationUpdateSuccess:
            "Informations d'études mises à jour avec succès.",
        educationUpdateError:
            "Erreur lors de la mise à jour des informations d'études.",
        preferencesUpdateSuccess: "Préférences mises à jour avec succès.",
        preferencesUpdateError:
            "Erreur lors de la mise à jour des préférences.",
        subscriptionUpdateSuccess: "Abonnement mis à jour avec succès.",
        subscriptionUpdateError:
            "Erreur lors de la mise à jour de l'abonnement.",
        deleteAccountSuccess: "Compte supprimé avec succès.",
        deleteAccountError: "Erreur lors de la suppression du compte.",
        loadProfileError: "Erreur lors du chargement du profil.",
    },

    // Courses
    course: {
        createSuccess: "Cours créé avec succès.",
        createError: "Erreur lors de la création du cours.",
        loadError: "Erreur lors du chargement du cours.",
        loadAllError: "Erreur lors du chargement des cours.",
        updateSuccess: "Cours mis à jour avec succès.",
        updateError: "Erreur lors de la mise à jour du cours.",
        deleteSuccess: "Cours supprimé avec succès.",
        deleteError: "Erreur lors de la suppression du cours.",
    },

    // Exams
    exam: {
        createSuccess: "Examen créé avec succès.",
        createError: "Erreur lors de la création de l'examen.",
        updateSuccess: "Examen modifié avec succès.",
        updateError: "Erreur lors de la modification de l'examen.",
        deleteSuccess: "Examen supprimé avec succès.",
        deleteError: "Erreur lors de la suppression de l'examen.",
        loadError: "Erreur lors du chargement des examens.",
    },

    // Quiz
    quiz: {
        generateSuccess: "Quiz généré avec succès.",
        generateError: "Erreur lors de la génération du quiz.",
        loadError: "Erreur lors du chargement du quiz.",
        submitSuccess: "Quiz soumis avec succès.",
        submitError: "Erreur lors de la soumission du quiz.",
        restartError: "Erreur lors du redémarrage du quiz.",
    },

    // Insights
    insights: {
        createSuccess: "Résultat sauvegardé avec succès.",
        createError: "Erreur lors de la sauvegarde du résultat.",
        loadSuccess: "Statistiques chargées avec succès.",
        loadError: "Erreur lors du chargement des statistiques.",
    },

    // Files
    file: {
        uploadSuccess: "Fichier(s) téléchargé(s) avec succès.",
        uploadError: "Erreur lors du téléchargement des fichiers.",
        downloadSuccess: "Téléchargement terminé avec succès.",
        downloadError: "Erreur lors du téléchargement.",
        deleteSuccess: "Fichier supprimé avec succès.",
        deleteError: "Erreur lors de la suppression du fichier.",
        recognitionError: "Erreur lors de la reconnaissance de texte.",
        noFilesError: "Aucun fichier disponible pour le téléchargement.",
        loadError: "Erreur lors du chargement du fichier.",
    },

    // Notifications
    notification: {
        markAllReadSuccess:
            "Toutes les notifications ont été marquées comme lues.",
        markAllReadError: "Erreur lors du marquage des notifications.",
        deleteSuccess: "Notification supprimée avec succès.",
        deleteError: "Erreur lors de la suppression de la notification.",
        deleteAllSuccess: "Toutes les notifications ont été supprimées.",
        deleteAllError: "Erreur lors de la suppression des notifications.",
        loadError: "Erreur lors du chargement des notifications.",
    },

    // Support
    support: {
        sendSuccess:
            "Votre message a été envoyé ! Nous vous répondrons sous 24h.",
        sendError: "Erreur lors de l'envoi du message.",
        feedbackSuccess: "Merci pour votre retour !",
        feedbackError: "Erreur lors de l'envoi du retour.",
        missingFieldsError: "Veuillez remplir tous les champs obligatoires.",
    },

    // General
    general: {
        success: "Opération réussie.",
        error: "Une erreur inattendue est survenue.",
        networkError: "Erreur de connexion. Vérifiez votre connexion internet.",
        serverError: "Erreur serveur. Veuillez réessayer plus tard.",
        validationError: "Veuillez vérifier les informations saisies.",
        permissionError: "Vous n'avez pas les permissions nécessaires.",
        notFoundError: "Élément non trouvé.",
        timeoutError: "Délai d'attente dépassé. Veuillez réessayer.",
    },
};

// Toast utility functions with French messages
export const showToast = {
    // Success toasts
    success: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        toast.success(message, {
            duration: options?.duration || 4000,
            description: options?.description,
        });
    },

    // Error toasts
    error: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        toast.error(message, {
            duration: options?.duration || 5000,
            description: options?.description,
        });
    },

    // Warning toasts
    warning: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        toast.warning(message, {
            duration: options?.duration || 4000,
            description: options?.description,
        });
    },

    // Info toasts
    info: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        toast.info(message, {
            duration: options?.duration || 3000,
            description: options?.description,
        });
    },

    // Loading toasts
    loading: (message: string) => {
        return toast.loading(message);
    },

    // Promise toasts with French messages
    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: unknown) => string);
        }
    ) => {
        return toast.promise(promise, messages);
    },
};

// Specific toast functions for common scenarios
export const authToast = {
    loginSuccess: () => showToast.success(toastMessages.auth.loginSuccess),
    loginError: (error?: string) =>
        showToast.error(error || toastMessages.auth.loginError),
    registerSuccess: () =>
        showToast.success(toastMessages.auth.registerSuccess),
    registerError: (error?: string) =>
        showToast.error(error || toastMessages.auth.registerError),
    logoutSuccess: () => showToast.success(toastMessages.auth.logoutSuccess),
    logoutError: () => showToast.error(toastMessages.auth.logoutError),
    sessionExpired: () => showToast.warning(toastMessages.auth.sessionExpired),
};

export const courseToast = {
    createSuccess: () => showToast.success(toastMessages.course.createSuccess),
    createError: () => showToast.error(toastMessages.course.createError),
    loadError: () => showToast.error(toastMessages.course.loadError),
    updateSuccess: () => showToast.success(toastMessages.course.updateSuccess),
    updateError: () => showToast.error(toastMessages.course.updateError),
};

export const examToast = {
    createSuccess: () => showToast.success(toastMessages.exam.createSuccess),
    createError: () => showToast.error(toastMessages.exam.createError),
    updateSuccess: () => showToast.success(toastMessages.exam.updateSuccess),
    updateError: () => showToast.error(toastMessages.exam.updateError),
    deleteSuccess: () => showToast.success(toastMessages.exam.deleteSuccess),
    deleteError: () => showToast.error(toastMessages.exam.deleteError),
};

export const quizToast = {
    generateSuccess: () =>
        showToast.success(toastMessages.quiz.generateSuccess),
    generateError: () => showToast.error(toastMessages.quiz.generateError),
    loadError: () => showToast.error(toastMessages.quiz.loadError),
    restartError: () => showToast.error(toastMessages.quiz.restartError),
};

export const insightsToast = {
    createSuccess: () =>
        showToast.success(toastMessages.insights.createSuccess),
    createError: () => showToast.error(toastMessages.insights.createError),
    loadSuccess: () => showToast.success(toastMessages.insights.loadSuccess),
    loadError: () => showToast.error(toastMessages.insights.loadError),
};

export const fileToast = {
    uploadSuccess: () => showToast.success(toastMessages.file.uploadSuccess),
    uploadError: () => showToast.error(toastMessages.file.uploadError),
    downloadSuccess: () =>
        showToast.success(toastMessages.file.downloadSuccess),
    downloadError: () => showToast.error(toastMessages.file.downloadError),
    recognitionError: () =>
        showToast.error(toastMessages.file.recognitionError),
    noFilesError: () => showToast.warning(toastMessages.file.noFilesError),
};
