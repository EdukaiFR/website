import type { ApiUser } from "@/lib/schemas/user";

let userIdCounter = 0;

export function buildUser(overrides?: Partial<ApiUser>): ApiUser {
    userIdCounter++;
    return {
        _id: `user-${userIdCounter}`,
        email: `user${userIdCounter}@test.com`,
        username: `testuser${userIdCounter}`,
        firstName: "Test",
        lastName: "User",
        profilePic: undefined,
        grade: "Licence 1 - Informatique",
        levelOfStudy: "superieur",
        institution: "Test University",
        accountPlan: "free",
        role: "user",
        ...overrides,
    };
}

export function buildPremiumUser(overrides?: Partial<ApiUser>): ApiUser {
    return buildUser({
        accountPlan: "premium",
        ...overrides,
    });
}

export function buildAdminUser(overrides?: Partial<ApiUser>): ApiUser {
    return buildUser({
        role: "admin",
        accountPlan: "premium",
        ...overrides,
    });
}
