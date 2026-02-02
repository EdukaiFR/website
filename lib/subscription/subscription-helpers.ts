/**
 * Helper functions for subscription status computation
 */

import type {
    SubscriptionPlan,
    SubscriptionStatus,
    UserSubscriptionInfo,
} from "./subscription-types";

/**
 * Compute the subscription status from user data
 *
 * @param user - User subscription information (can be null/undefined)
 * @returns Computed subscription status for UI display
 *
 * @example
 * ```tsx
 * const { user } = useSession();
 * const status = getSubscriptionStatus(user);
 *
 * if (status.hasScheduledCancellation) {
 *     // Show cancellation banner
 * }
 * ```
 */
export function getSubscriptionStatus(
    user: UserSubscriptionInfo | null | undefined
): SubscriptionStatus {
    const plan: SubscriptionPlan =
        user?.accountPlan === "premium" ? "premium" : "free";
    const isPremium = plan === "premium";
    const isActive = user?.subscriptionStatus === "active";

    // Only show cancellation if:
    // 1. User is premium
    // 2. cancelAtPeriodEnd is explicitly true (not undefined/null)
    // 3. subscriptionStatus is "active" (not already cancelled)
    // 4. currentPeriodEnd exists
    const hasScheduledCancellation =
        isPremium &&
        user?.cancelAtPeriodEnd === true &&
        isActive &&
        Boolean(user?.currentPeriodEnd);

    const cancellationDate = user?.currentPeriodEnd
        ? new Date(user.currentPeriodEnd)
        : null;

    return {
        isPremium,
        hasScheduledCancellation,
        cancellationDate,
        isActive,
        plan,
    };
}

/**
 * Format a date for display in the subscription UI
 *
 * @param date - Date to format
 * @returns Formatted date string in French locale
 *
 * @example
 * ```tsx
 * formatSubscriptionDate(new Date()) // "20 janvier 2025"
 * ```
 */
export function formatSubscriptionDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
