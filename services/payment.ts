import { syncAuthCookie } from "@/lib/auth-utils";
import { ApiError } from "@/lib/types/api";
import axios from "axios";

/**
 * Response from Stripe checkout session creation
 */
export interface CheckoutSessionResponse {
    /** Stripe checkout URL to redirect user to */
    url: string;
    /** Unique session identifier for tracking */
    sessionId: string;
}

/**
 * Response from Stripe customer portal session creation
 */
export interface PortalSessionResponse {
    /** Stripe customer portal URL to redirect user to */
    url: string;
}

/**
 * Custom error class for payment-related errors
 * Provides user-friendly messages without exposing sensitive details
 */
export class PaymentError extends Error {
    public readonly code: PaymentErrorCode;
    public readonly statusCode?: number;

    constructor(code: PaymentErrorCode, statusCode?: number) {
        super(PAYMENT_ERROR_MESSAGES[code]);
        this.name = "PaymentError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/** Payment error codes for consistent error handling */
export type PaymentErrorCode =
    | "CHECKOUT_FAILED"
    | "PORTAL_FAILED"
    | "UNAUTHORIZED"
    | "NETWORK_ERROR";

/** User-friendly error messages (no sensitive data) */
const PAYMENT_ERROR_MESSAGES: Record<PaymentErrorCode, string> = {
    CHECKOUT_FAILED: "Impossible de créer la session de paiement. Veuillez réessayer.",
    PORTAL_FAILED: "Impossible d'accéder au portail de gestion. Veuillez réessayer.",
    UNAUTHORIZED: "Vous devez être connecté pour effectuer cette action.",
    NETWORK_ERROR: "Erreur de connexion. Vérifiez votre connexion internet.",
};

/**
 * Payment service interface
 */
export interface PaymentService {
    createCheckoutSession: () => Promise<CheckoutSessionResponse>;
    createPortalSession: () => Promise<PortalSessionResponse>;
}

/**
 * Sanitized error logging for payment operations
 * Only logs non-sensitive information in development
 */
function logPaymentError(operation: string, error: ApiError): void {
    if (process.env.NODE_ENV === "development") {
        console.error(`[Payment] ${operation} failed:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            // Never log full error message or response data in any environment
        });
    }
    // In production, errors should be sent to a monitoring service (Sentry, etc.)
    // without exposing sensitive payment details
}

/**
 * Determine the appropriate error code based on the API error
 */
function getPaymentErrorCode(
    error: ApiError,
    defaultCode: PaymentErrorCode
): PaymentErrorCode {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
        return "UNAUTHORIZED";
    }
    if (!error.response) {
        return "NETWORK_ERROR";
    }
    return defaultCode;
}

/**
 * Payment service hook for managing Stripe integration
 *
 * Provides methods for creating checkout sessions and accessing the customer portal.
 * All methods handle authentication via cookies and sync with backend.
 *
 * @returns Payment service methods
 *
 * @example
 * ```tsx
 * const paymentService = usePaymentService();
 * try {
 *     const { url } = await paymentService.createCheckoutSession();
 *     router.push(url);
 * } catch (error) {
 *     if (error instanceof PaymentError) {
 *         toast.error(error.message);
 *     }
 * }
 * ```
 */
export function usePaymentService(): PaymentService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createCheckoutSession = async (): Promise<CheckoutSessionResponse> => {
        try {
            syncAuthCookie();

            const response = await axios.post(
                `${apiUrl}/payment/checkout`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            logPaymentError("Checkout session creation", err);

            const errorCode = getPaymentErrorCode(err, "CHECKOUT_FAILED");
            throw new PaymentError(errorCode, err.response?.status);
        }
    };

    const createPortalSession = async (): Promise<PortalSessionResponse> => {
        try {
            syncAuthCookie();

            const response = await axios.post(
                `${apiUrl}/payment/portal`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            logPaymentError("Portal session creation", err);

            const errorCode = getPaymentErrorCode(err, "PORTAL_FAILED");
            throw new PaymentError(errorCode, err.response?.status);
        }
    };

    return { createCheckoutSession, createPortalSession };
}
