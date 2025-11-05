// Custom error types
interface HttpError extends Error {
    status?: number;
    code?: string;
}

export class ForbiddenError extends Error {
    constructor(message: string = "Accès interdit") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string = "Authentification requise") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

// Utilities to detect error types
export function isForbiddenError(error: Error): boolean {
    // Check by instance
    if (error instanceof ForbiddenError) {
        return true;
    }

    // Check by properties (for HTTP errors)
    const httpError = error as HttpError;
    if (httpError.status === 403 || httpError.code === "FORBIDDEN") {
        return true;
    }

    // Check by error name
    if (error.name === "ForbiddenError") {
        return true;
    }

    // Fallback: check by message (less reliable)
    const message = error.message.toLowerCase();
    return (
        message.includes("403") ||
        message.includes("forbidden") ||
        message.includes("access denied") ||
        message.includes("accès refusé") ||
        message.includes("accès interdit")
    );
}

export function isUnauthorizedError(error: Error): boolean {
    // Check by instance
    if (error instanceof UnauthorizedError) {
        return true;
    }

    // Check by properties (for HTTP errors)
    const httpError = error as HttpError;
    if (httpError.status === 401 || httpError.code === "UNAUTHORIZED") {
        return true;
    }

    // Check by error name
    if (error.name === "UnauthorizedError") {
        return true;
    }

    // Fallback: check by message (less reliable)
    const message = error.message.toLowerCase();
    return (
        message.includes("401") ||
        message.includes("unauthorized") ||
        message.includes("authentication") ||
        message.includes("session expired") ||
        message.includes("token expired") ||
        message.includes("non autorisé") ||
        message.includes("authentification") ||
        message.includes("session expirée")
    );
}

// Utility to log errors in a structured manner
export function logError(error: Error & { digest?: string }): void {
    const errorInfo = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    console.error("Application Error:", errorInfo);

    // Here we could add sending to a monitoring service
    // like Sentry, LogRocket, etc.
    // sendToMonitoringService(errorInfo);
}
