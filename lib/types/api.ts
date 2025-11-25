/**
 * Standard API error interface for axios errors
 */
export interface ApiError {
    response?: {
        data?: {
            message?: string;
            status?: string;
        };
        status?: number;
        statusText?: string;
    };
    message?: string;
}

/**
 * Standard API response with status
 */
export interface ApiResponse<T = unknown> {
    status: "success" | "failure";
    message: string;
    data?: T;
}

/**
 * Standard error response from API
 */
export interface ApiErrorResponse {
    status: "failure";
    message: string;
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        ("response" in error || "message" in error)
    );
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.response?.data?.message || error.message || "Une erreur inconnue est survenue";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Une erreur inconnue est survenue";
}
