import { vi } from "vitest";
import { buildUser } from "../factories/user";
import type { ApiUser } from "@/lib/schemas/user";

interface SessionMock {
    user: ApiUser | null;
    loading: boolean;
    login: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    validateSession: ReturnType<typeof vi.fn>;
    refreshUserProfile: ReturnType<typeof vi.fn>;
}

function createSessionMock(overrides?: Partial<SessionMock>): SessionMock {
    return {
        user: null,
        loading: false,
        login: vi.fn().mockResolvedValue({ success: true }),
        register: vi.fn().mockResolvedValue({ success: true }),
        logout: vi.fn().mockResolvedValue(undefined),
        validateSession: vi.fn().mockResolvedValue(undefined),
        refreshUserProfile: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    };
}

export function mockAuthenticatedSession(
    user?: Partial<ApiUser>
): SessionMock {
    return createSessionMock({
        user: buildUser(user),
        loading: false,
    });
}

export function mockUnauthenticatedSession(): SessionMock {
    return createSessionMock({
        user: null,
        loading: false,
    });
}

export function mockLoadingSession(): SessionMock {
    return createSessionMock({
        user: null,
        loading: true,
    });
}

/**
 * Setup the useSession mock for a test file.
 * Call this in beforeEach or at the top of a describe block.
 *
 * @example
 * ```ts
 * vi.mock("@/hooks/useSession");
 * import { setupSessionMock } from "@/tests/mocks/session";
 *
 * beforeEach(() => {
 *     setupSessionMock(mockAuthenticatedSession({ role: "admin" }));
 * });
 * ```
 */
export function setupSessionMock(session: SessionMock): void {
    const { useSession } = require("@/hooks/useSession");
    vi.mocked(useSession).mockReturnValue(session);
}
