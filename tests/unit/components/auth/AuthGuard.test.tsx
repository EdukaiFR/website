/**
 * AuthGuard Component Tests
 *
 * Demonstrates: conditional rendering based on hook state.
 * Pattern: mock a custom hook to control component branches.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Mock the hook that controls AuthGuard behavior
const mockUseAuthGuard = vi.fn();
vi.mock("@/hooks/useAuthGuard", () => ({
    useAuthGuard: (...args: unknown[]) => mockUseAuthGuard(...args),
}));

describe("AuthGuard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders children when user is authenticated", () => {
        mockUseAuthGuard.mockReturnValue({
            user: { id: "user-1", name: "Test" },
            loading: false,
        });

        render(
            <AuthGuard>
                <p>Protected content</p>
            </AuthGuard>
        );

        expect(screen.getByText("Protected content")).toBeInTheDocument();
    });

    it("renders loading state while session is loading", () => {
        mockUseAuthGuard.mockReturnValue({
            user: null,
            loading: true,
        });

        render(
            <AuthGuard>
                <p>Protected content</p>
            </AuthGuard>
        );

        expect(screen.getByText("Chargement...")).toBeInTheDocument();
        expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    });

    it("renders custom fallback when provided and loading", () => {
        mockUseAuthGuard.mockReturnValue({
            user: null,
            loading: true,
        });

        render(
            <AuthGuard fallback={<p>Custom loader</p>}>
                <p>Protected content</p>
            </AuthGuard>
        );

        expect(screen.getByText("Custom loader")).toBeInTheDocument();
        expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    it("renders nothing when user is null and not loading (redirect pending)", () => {
        mockUseAuthGuard.mockReturnValue({
            user: null,
            loading: false,
        });

        const { container } = render(
            <AuthGuard>
                <p>Protected content</p>
            </AuthGuard>
        );

        expect(container.innerHTML).toBe("");
    });

    it("passes redirectTo to useAuthGuard", () => {
        mockUseAuthGuard.mockReturnValue({
            user: { id: "user-1" },
            loading: false,
        });

        render(
            <AuthGuard redirectTo="/login">
                <p>Content</p>
            </AuthGuard>
        );

        expect(mockUseAuthGuard).toHaveBeenCalledWith({
            redirectTo: "/login",
        });
    });

    it("defaults redirectTo to /auth", () => {
        mockUseAuthGuard.mockReturnValue({
            user: { id: "user-1" },
            loading: false,
        });

        render(
            <AuthGuard>
                <p>Content</p>
            </AuthGuard>
        );

        expect(mockUseAuthGuard).toHaveBeenCalledWith({
            redirectTo: "/auth",
        });
    });
});
