import { toast } from "sonner";

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
    educationUpdateSuccess: "Informations d'études mises à jour avec succès.",
    educationUpdateError:
      "Erreur lors de la mise à jour des informations d'études.",
    preferencesUpdateSuccess: "Préférences mises à jour avec succès.",
    preferencesUpdateError: "Erreur lors de la mise à jour des préférences.",
    subscriptionUpdateSuccess: "Abonnement mis à jour avec succès.",
    subscriptionUpdateError: "Erreur lors de la mise à jour de l'abonnement.",
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
    markAllReadSuccess: "Toutes les notifications ont été marquées comme lues.",
    markAllReadError: "Erreur lors du marquage des notifications.",
    deleteSuccess: "Notification supprimée avec succès.",
    deleteError: "Erreur lors de la suppression de la notification.",
    deleteAllSuccess: "Toutes les notifications ont été supprimées.",
    deleteAllError: "Erreur lors de la suppression des notifications.",
    loadError: "Erreur lors du chargement des notifications.",
  },

  // Support
  support: {
    sendSuccess: "Votre message a été envoyé ! Nous vous répondrons sous 24h.",
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
      error: string | ((error: any) => string);
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
  registerSuccess: () => showToast.success(toastMessages.auth.registerSuccess),
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
  generateSuccess: () => showToast.success(toastMessages.quiz.generateSuccess),
  generateError: () => showToast.error(toastMessages.quiz.generateError),
  loadError: () => showToast.error(toastMessages.quiz.loadError),
  restartError: () => showToast.error(toastMessages.quiz.restartError),
};

export const fileToast = {
  uploadSuccess: () => showToast.success(toastMessages.file.uploadSuccess),
  uploadError: () => showToast.error(toastMessages.file.uploadError),
  downloadSuccess: () => showToast.success(toastMessages.file.downloadSuccess),
  downloadError: () => showToast.error(toastMessages.file.downloadError),
  recognitionError: () => showToast.error(toastMessages.file.recognitionError),
  noFilesError: () => showToast.warning(toastMessages.file.noFilesError),
};

// Error handler utility that automatically shows appropriate toasts
export const handleError = (error: any, context?: string) => {
  console.error(`Error${context ? ` in ${context}` : ""}:`, error);

  // Determine error type and show appropriate toast
  if (error?.response?.status === 401) {
    authToast.sessionExpired();
  } else if (error?.response?.status === 403) {
    showToast.error(toastMessages.general.permissionError);
  } else if (error?.response?.status === 404) {
    showToast.error(toastMessages.general.notFoundError);
  } else if (error?.response?.status >= 500) {
    showToast.error(toastMessages.general.serverError);
  } else if (error?.code === "NETWORK_ERROR" || !error?.response) {
    showToast.error(toastMessages.general.networkError);
  } else {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      toastMessages.general.error;
    showToast.error(errorMessage);
  }
};
