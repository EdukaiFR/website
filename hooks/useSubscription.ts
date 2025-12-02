"use client";

import {
    formatSubscriptionDate,
    getSubscriptionStatus,
    type SubscriptionStatus,
} from "@/lib/subscription";
import {
    PaymentError,
    usePaymentService,
} from "@/services/payment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "./useSession";

/**
 * Return type for the useSubscription hook
 */
export interface UseSubscriptionReturn {
    /** Computed subscription status */
    status: SubscriptionStatus;
    /** Whether any payment operation is in progress */
    isProcessing: boolean;
    /** Whether the session is still loading */
    isLoading: boolean;
    /** Handle subscribe to premium action */
    handleSubscribe: () => Promise<void>;
    /** Handle manage subscription action (opens Stripe portal) */
    handleManageSubscription: () => Promise<void>;
    /** Format a cancellation date for display */
    formatCancellationDate: (date: Date) => string;
}

/**
 * Custom hook for managing subscription state and actions
 *
 * Encapsulates all subscription-related business logic including:
 * - Subscription status computation
 * - Payment session creation
 * - Error handling with user-friendly messages
 * - Session refresh after Stripe redirect
 *
 * @returns Subscription state and action handlers
 *
 * @example
 * ```tsx
 * function PricingPage() {
 *     const {
 *         status,
 *         isProcessing,
 *         isLoading,
 *         handleSubscribe,
 *         handleManageSubscription,
 *         formatCancellationDate,
 *     } = useSubscription();
 *
 *     if (status.hasScheduledCancellation) {
 *         return (
 *             <CancellationBanner
 *                 date={formatCancellationDate(status.cancellationDate!)}
 *                 onReactivate={handleManageSubscription}
 *             />
 *         );
 *     }
 *
 *     return (
 *         <Button onClick={status.isPremium ? handleManageSubscription : handleSubscribe}>
 *             {status.isPremium ? "Manage" : "Subscribe"}
 *         </Button>
 *     );
 * }
 * ```
 */
export function useSubscription(): UseSubscriptionReturn {
    const router = useRouter();
    const paymentService = usePaymentService();
    const { user, loading: sessionLoading, refreshUserProfile } = useSession();

    const [isProcessing, setIsProcessing] = useState(false);

    // Refresh user profile on mount (handles return from Stripe)
    useEffect(() => {
        if (!sessionLoading) {
            refreshUserProfile();
        }
        // Only run on initial load, not on every sessionLoading change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Compute subscription status from user data
    const status = getSubscriptionStatus(user);

    /**
     * Handle subscribing to premium plan
     * Creates a Stripe checkout session and redirects
     */
    const handleSubscribe = useCallback(async () => {
        setIsProcessing(true);
        try {
            const { url } = await paymentService.createCheckoutSession();
            // Use router.push for better Next.js integration
            // Note: Stripe checkout is an external URL, so window.location is actually needed here
            window.location.href = url;
        } catch (error) {
            if (error instanceof PaymentError) {
                toast.error(error.message);
            } else {
                toast.error("Une erreur inattendue est survenue");
            }
        } finally {
            setIsProcessing(false);
        }
    }, [paymentService]);

    /**
     * Handle managing existing subscription
     * Creates a Stripe portal session and redirects
     */
    const handleManageSubscription = useCallback(async () => {
        setIsProcessing(true);
        try {
            const { url } = await paymentService.createPortalSession();
            // Stripe portal is an external URL
            window.location.href = url;
        } catch (error) {
            if (error instanceof PaymentError) {
                toast.error(error.message);
            } else {
                toast.error("Une erreur inattendue est survenue");
            }
        } finally {
            setIsProcessing(false);
        }
    }, [paymentService]);

    return {
        status,
        isProcessing,
        isLoading: sessionLoading,
        handleSubscribe,
        handleManageSubscription,
        formatCancellationDate: formatSubscriptionDate,
    };
}
