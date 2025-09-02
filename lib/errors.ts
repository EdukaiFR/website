// Types d'erreurs personnalisés
interface HttpError extends Error {
  status?: number;
  code?: string;
}

export class ForbiddenError extends Error {
  constructor(message: string = "Accès interdit") {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Authentification requise") {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// Utilitaires pour détecter les types d'erreurs
export function isForbiddenError(error: Error): boolean {
  // Vérification par instance
  if (error instanceof ForbiddenError) {
    return true;
  }
  
  // Vérification par propriétés (pour les erreurs HTTP)
  const httpError = error as HttpError;
  if (httpError.status === 403 || httpError.code === 'FORBIDDEN') {
    return true;
  }
  
  // Vérification par nom de l'erreur
  if (error.name === 'ForbiddenError') {
    return true;
  }
  
  // Fallback: vérification par message (moins fiable)
  const message = error.message.toLowerCase();
  return message.includes('403') || 
         message.includes('forbidden') || 
         message.includes('access denied') ||
         message.includes('accès refusé') ||
         message.includes('accès interdit');
}

export function isUnauthorizedError(error: Error): boolean {
  // Vérification par instance
  if (error instanceof UnauthorizedError) {
    return true;
  }
  
  // Vérification par propriétés (pour les erreurs HTTP)
  const httpError = error as HttpError;
  if (httpError.status === 401 || httpError.code === 'UNAUTHORIZED') {
    return true;
  }
  
  // Vérification par nom de l'erreur
  if (error.name === 'UnauthorizedError') {
    return true;
  }
  
  // Fallback: vérification par message (moins fiable)
  const message = error.message.toLowerCase();
  return message.includes('401') || 
         message.includes('unauthorized') || 
         message.includes('authentication') ||
         message.includes('session expired') ||
         message.includes('token expired') ||
         message.includes('non autorisé') ||
         message.includes('authentification') ||
         message.includes('session expirée');
}

// Utilitaire pour logger les erreurs de manière structurée
export function logError(error: Error & { digest?: string }): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    digest: error.digest,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };

  console.error('Application Error:', errorInfo);
  
  // Ici on pourrait ajouter l'envoi vers un service de monitoring
  // comme Sentry, LogRocket, etc.
  // sendToMonitoringService(errorInfo);
}