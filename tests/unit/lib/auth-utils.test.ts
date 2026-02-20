import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    isTokenExpired,
    getCurrentUserId,
    isAuthenticated,
    getAuthHeaders,
} from "@/lib/auth-utils";

vi.mock("@/lib/session", () => ({
    sessionStorage: {
        getToken: vi.fn(),
        getUser: vi.fn(),
    },
}));

import { sessionStorage } from "@/lib/session";

const mockedStorage = vi.mocked(sessionStorage);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("isTokenExpired", () => {
    it("returns true for an expired token", () => {
        // JWT with exp = 1000 (far in the past)
        // Header: {"alg":"HS256","typ":"JWT"}, Payload: {"exp":1000}
        const expiredToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDB9.signature";
        expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it("returns false for a non-expired token", () => {
        // JWT with exp = 9999999999 (far in the future)
        const futureToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature";
        expect(isTokenExpired(futureToken)).toBe(false);
    });

    it("returns true for an invalid token", () => {
        expect(isTokenExpired("not-a-jwt")).toBe(true);
    });

    it("returns true for an empty string", () => {
        expect(isTokenExpired("")).toBe(true);
    });
});

describe("getCurrentUserId", () => {
    it("returns id when user has id field", () => {
        mockedStorage.getUser.mockReturnValue({ id: "user-123" });
        expect(getCurrentUserId()).toBe("user-123");
    });

    it("returns _id when user has _id field", () => {
        mockedStorage.getUser.mockReturnValue({ _id: "user-456" });
        expect(getCurrentUserId()).toBe("user-456");
    });

    it("prefers id over _id", () => {
        mockedStorage.getUser.mockReturnValue({
            id: "user-123",
            _id: "user-456",
        });
        expect(getCurrentUserId()).toBe("user-123");
    });

    it("returns null when no user", () => {
        mockedStorage.getUser.mockReturnValue(null);
        expect(getCurrentUserId()).toBeNull();
    });

    it("returns null when user has no id fields", () => {
        mockedStorage.getUser.mockReturnValue({ name: "Test" });
        expect(getCurrentUserId()).toBeNull();
    });
});

describe("isAuthenticated", () => {
    it("returns true when token and user exist", () => {
        mockedStorage.getToken.mockReturnValue("valid-token");
        mockedStorage.getUser.mockReturnValue({ id: "user-1" });
        expect(isAuthenticated()).toBe(true);
    });

    it("returns false when token is missing", () => {
        mockedStorage.getToken.mockReturnValue(null);
        mockedStorage.getUser.mockReturnValue({ id: "user-1" });
        expect(isAuthenticated()).toBe(false);
    });

    it("returns false when user is missing", () => {
        mockedStorage.getToken.mockReturnValue("valid-token");
        mockedStorage.getUser.mockReturnValue(null);
        expect(isAuthenticated()).toBe(false);
    });

    it("returns false when both are missing", () => {
        mockedStorage.getToken.mockReturnValue(null);
        mockedStorage.getUser.mockReturnValue(null);
        expect(isAuthenticated()).toBe(false);
    });
});

describe("getAuthHeaders", () => {
    it("returns Authorization header when token exists", () => {
        mockedStorage.getToken.mockReturnValue("my-token");
        expect(getAuthHeaders()).toEqual({
            Authorization: "Bearer my-token",
        });
    });

    it("returns empty object when no token", () => {
        mockedStorage.getToken.mockReturnValue(null);
        expect(getAuthHeaders()).toEqual({});
    });
});
