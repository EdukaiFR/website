import { syncAuthCookie } from "@/lib/auth-utils";
import { ApiError } from "@/lib/types/api";
import axios from "axios";

export interface CheckoutSessionResponse {
    url: string;
    sessionId: string;
}

export interface PortalSessionResponse {
    url: string;
}

export interface PaymentService {
    createCheckoutSession: () => Promise<CheckoutSessionResponse>;
    createPortalSession: () => Promise<PortalSessionResponse>;
}

export function usePaymentService(): PaymentService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createCheckoutSession = async (): Promise<CheckoutSessionResponse> => {
        try {
            // Ensure cookie is set for backend
            syncAuthCookie();
            
            // Backend ignores Authorization header and only uses cookies
            // We only send withCredentials: true
            const response = await axios.post(
                `${apiUrl}/payment/checkout`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Erreur lors de la création de la session de paiement:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const createPortalSession = async (): Promise<PortalSessionResponse> => {
        try {
            // Ensure cookie is set for backend
            syncAuthCookie();

            const response = await axios.post(
                `${apiUrl}/payment/portal`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Erreur lors de la création de la session du portail:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    return { createCheckoutSession, createPortalSession };
}
