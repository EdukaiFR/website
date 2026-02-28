import { vi } from "vitest";

interface RouterMock {
    push: ReturnType<typeof vi.fn>;
    replace: ReturnType<typeof vi.fn>;
    prefetch: ReturnType<typeof vi.fn>;
    back: ReturnType<typeof vi.fn>;
    forward: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
}

let routerMock: RouterMock;

export function createRouterMock(overrides?: Partial<RouterMock>): RouterMock {
    routerMock = {
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        ...overrides,
    };
    return routerMock;
}

/**
 * Get the current router mock to assert on its calls.
 *
 * @example
 * ```ts
 * expect(getRouterMock().push).toHaveBeenCalledWith("/auth");
 * ```
 */
export function getRouterMock(): RouterMock {
    return routerMock;
}

/**
 * Setup the Next.js navigation mock for a test file.
 * Call this in beforeEach to get a fresh router.
 *
 * @example
 * ```ts
 * vi.mock("next/navigation");
 * import { setupRouterMock, getRouterMock } from "@/tests/mocks/router";
 *
 * beforeEach(() => {
 *     setupRouterMock();
 * });
 *
 * it("redirects", () => {
 *     expect(getRouterMock().push).toHaveBeenCalledWith("/login");
 * });
 * ```
 */
export function setupRouterMock(
    overrides?: Partial<RouterMock>,
    pathname: string = "/",
    searchParams: URLSearchParams = new URLSearchParams()
): void {
    const router = createRouterMock(overrides);
    const navigation = require("next/navigation");
    vi.mocked(navigation.useRouter).mockReturnValue(router);
    vi.mocked(navigation.usePathname).mockReturnValue(pathname);
    vi.mocked(navigation.useSearchParams).mockReturnValue(searchParams);
}
