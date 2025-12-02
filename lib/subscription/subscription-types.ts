/**
 * Subscription-related types and interfaces
 */

/** Available subscription plans */
export type SubscriptionPlan = "free" | "premium";

/** Subscription status from Stripe */
export type SubscriptionStatusType =
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid";

/**
 * User subscription information from the session
 * Note: subscriptionStatus is string to be compatible with existing User type
 */
export interface UserSubscriptionInfo {
    accountPlan?: SubscriptionPlan | string;
    subscriptionStatus?: SubscriptionStatusType | string;
    cancelAtPeriodEnd?: boolean;
    currentPeriodEnd?: string;
}

/**
 * Computed subscription status for UI display
 */
export interface SubscriptionStatus {
    /** Whether the user has an active premium subscription */
    isPremium: boolean;
    /** Whether the subscription is scheduled to cancel at period end */
    hasScheduledCancellation: boolean;
    /** Date when the subscription will end (if cancelled) */
    cancellationDate: Date | null;
    /** Whether the subscription is currently active */
    isActive: boolean;
    /** The current plan name */
    plan: SubscriptionPlan;
}
