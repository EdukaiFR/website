import { describe, it, expect } from "vitest";
import {
    canUserModifyTicket,
    canUserReopenTicket,
    USER_ROLES,
    type UserRole,
} from "@/hooks/useRole";

describe("canUserModifyTicket", () => {
    const userId = "user-1";
    const otherUserId = "user-2";

    it("allows admin to modify any ticket", () => {
        expect(
            canUserModifyTicket(USER_ROLES.ADMIN, userId, otherUserId)
        ).toBe(true);
    });

    it("allows triage to modify any ticket", () => {
        expect(
            canUserModifyTicket(USER_ROLES.TRIAGE, userId, otherUserId)
        ).toBe(true);
    });

    it("allows user to modify their own ticket", () => {
        expect(canUserModifyTicket(USER_ROLES.USER, userId, userId)).toBe(true);
    });

    it("denies user from modifying another user's ticket", () => {
        expect(
            canUserModifyTicket(USER_ROLES.USER, userId, otherUserId)
        ).toBe(false);
    });

    it("denies dev from modifying another user's ticket", () => {
        expect(
            canUserModifyTicket(USER_ROLES.DEV, userId, otherUserId)
        ).toBe(false);
    });

    it("allows dev to modify their own ticket", () => {
        expect(canUserModifyTicket(USER_ROLES.DEV, userId, userId)).toBe(true);
    });
});

describe("canUserReopenTicket", () => {
    const userId = "user-1";
    const otherUserId = "user-2";

    it("allows admin to reopen any ticket", () => {
        expect(
            canUserReopenTicket(USER_ROLES.ADMIN, userId, otherUserId)
        ).toBe(true);
    });

    it("allows triage to reopen any ticket", () => {
        expect(
            canUserReopenTicket(USER_ROLES.TRIAGE, userId, otherUserId)
        ).toBe(true);
    });

    it("allows user to reopen their own ticket", () => {
        expect(canUserReopenTicket(USER_ROLES.USER, userId, userId)).toBe(
            true
        );
    });

    it("denies user from reopening another user's ticket", () => {
        expect(
            canUserReopenTicket(USER_ROLES.USER, userId, otherUserId)
        ).toBe(false);
    });

    it("denies dev from reopening another user's ticket", () => {
        expect(
            canUserReopenTicket(USER_ROLES.DEV, userId, otherUserId)
        ).toBe(false);
    });
});
