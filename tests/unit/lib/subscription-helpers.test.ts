import { describe, it, expect } from "vitest";
import {
    getSubscriptionStatus,
    formatSubscriptionDate,
} from "@/lib/subscription/subscription-helpers";
import type { UserSubscriptionInfo } from "@/lib/subscription/subscription-types";

describe("getSubscriptionStatus", () => {
    it("returns free plan for null user", () => {
        const status = getSubscriptionStatus(null);
        expect(status.isPremium).toBe(false);
        expect(status.plan).toBe("free");
        expect(status.isActive).toBe(false);
        expect(status.hasScheduledCancellation).toBe(false);
        expect(status.cancellationDate).toBeNull();
    });

    it("returns free plan for undefined user", () => {
        const status = getSubscriptionStatus(undefined);
        expect(status.isPremium).toBe(false);
        expect(status.plan).toBe("free");
    });

    it("returns free plan for user without accountPlan", () => {
        const status = getSubscriptionStatus({});
        expect(status.isPremium).toBe(false);
        expect(status.plan).toBe("free");
    });

    it("returns premium plan for premium user", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "premium",
            subscriptionStatus: "active",
        };
        const status = getSubscriptionStatus(user);
        expect(status.isPremium).toBe(true);
        expect(status.plan).toBe("premium");
        expect(status.isActive).toBe(true);
    });

    it("returns free plan for non-premium accountPlan", () => {
        const user: UserSubscriptionInfo = { accountPlan: "basic" };
        const status = getSubscriptionStatus(user);
        expect(status.isPremium).toBe(false);
        expect(status.plan).toBe("free");
    });

    it("detects scheduled cancellation when all conditions are met", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "premium",
            subscriptionStatus: "active",
            cancelAtPeriodEnd: true,
            currentPeriodEnd: "2026-03-01T00:00:00Z",
        };
        const status = getSubscriptionStatus(user);
        expect(status.hasScheduledCancellation).toBe(true);
        expect(status.cancellationDate).toEqual(
            new Date("2026-03-01T00:00:00Z")
        );
    });

    it("does not flag cancellation when cancelAtPeriodEnd is false", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "premium",
            subscriptionStatus: "active",
            cancelAtPeriodEnd: false,
            currentPeriodEnd: "2026-03-01T00:00:00Z",
        };
        expect(getSubscriptionStatus(user).hasScheduledCancellation).toBe(
            false
        );
    });

    it("does not flag cancellation when subscription is not active", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "premium",
            subscriptionStatus: "canceled",
            cancelAtPeriodEnd: true,
            currentPeriodEnd: "2026-03-01T00:00:00Z",
        };
        expect(getSubscriptionStatus(user).hasScheduledCancellation).toBe(
            false
        );
    });

    it("does not flag cancellation for free users", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "free",
            subscriptionStatus: "active",
            cancelAtPeriodEnd: true,
            currentPeriodEnd: "2026-03-01T00:00:00Z",
        };
        expect(getSubscriptionStatus(user).hasScheduledCancellation).toBe(
            false
        );
    });

    it("does not flag cancellation when currentPeriodEnd is missing", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "premium",
            subscriptionStatus: "active",
            cancelAtPeriodEnd: true,
        };
        expect(getSubscriptionStatus(user).hasScheduledCancellation).toBe(
            false
        );
    });

    it("does not flag cancellation when cancelAtPeriodEnd is undefined", () => {
        const user: UserSubscriptionInfo = {
            accountPlan: "premium",
            subscriptionStatus: "active",
            currentPeriodEnd: "2026-03-01T00:00:00Z",
        };
        expect(getSubscriptionStatus(user).hasScheduledCancellation).toBe(
            false
        );
    });
});

describe("formatSubscriptionDate", () => {
    it("formats a date in French locale", () => {
        const date = new Date("2026-01-20T00:00:00Z");
        const formatted = formatSubscriptionDate(date);
        expect(formatted).toMatch(/20/);
        expect(formatted).toMatch(/janvier/i);
        expect(formatted).toMatch(/2026/);
    });
});
