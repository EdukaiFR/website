/**
 * SigninForm Component Tests
 *
 * Demonstrates: form interactions with userEvent, Zod validation,
 * async submit handling, and callback verification.
 * Pattern: mock useSession, use userEvent.setup() for realistic interactions.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SigninForm } from "@/components/auth/signin-form";

// Mock useSession -- the only external dependency
const mockLogin = vi.fn();
vi.mock("@/hooks/useSession", () => ({
    useSession: () => ({
        login: mockLogin,
        user: null,
        loading: false,
    }),
}));

describe("SigninForm", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Rendering ──────────────────────────────────────

    it("renders the form with email and password fields", () => {
        render(<SigninForm />);

        expect(
            screen.getByPlaceholderText("ton.email@exemple.com")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /se connecter/i })
        ).toBeInTheDocument();
    });

    it("renders the header text", () => {
        render(<SigninForm />);

        expect(
            screen.getByText("Content de te revoir !")
        ).toBeInTheDocument();
    });

    it("renders forgot password button", () => {
        render(<SigninForm />);

        expect(
            screen.getByRole("button", { name: /mot de passe oublié/i })
        ).toBeInTheDocument();
    });

    // ── Validation ─────────────────────────────────────

    it("shows validation error for empty email", async () => {
        render(<SigninForm />);

        // Only fill password, leave email empty
        await user.type(
            screen.getByPlaceholderText("••••••••"),
            "password123"
        );
        await user.click(
            screen.getByRole("button", { name: /se connecter/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Adresse email invalide")
            ).toBeInTheDocument();
        });
    });

    it("shows validation error for short password", async () => {
        render(<SigninForm />);

        await user.type(
            screen.getByPlaceholderText("ton.email@exemple.com"),
            "test@example.com"
        );
        await user.type(screen.getByPlaceholderText("••••••••"), "abc");
        await user.click(
            screen.getByRole("button", { name: /se connecter/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/au moins 6 caractères/i)
            ).toBeInTheDocument();
        });
    });

    it("does not call login when form is invalid", async () => {
        render(<SigninForm />);

        await user.click(
            screen.getByRole("button", { name: /se connecter/i })
        );

        await waitFor(() => {
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    // ── Successful submit ──────────────────────────────

    it("calls login with credentials on valid submit", async () => {
        mockLogin.mockResolvedValue({ success: true });
        const onSuccess = vi.fn();

        render(<SigninForm onSuccess={onSuccess} />);

        await user.type(
            screen.getByPlaceholderText("ton.email@exemple.com"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("••••••••"),
            "password123"
        );
        await user.click(
            screen.getByRole("button", { name: /se connecter/i })
        );

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "test@example.com",
                password: "password123",
            });
        });

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    // ── Failed submit ──────────────────────────────────

    it("shows error message on login failure", async () => {
        mockLogin.mockResolvedValue({
            success: false,
            error: "Identifiants incorrects",
        });
        const onError = vi.fn();

        render(<SigninForm onError={onError} />);

        await user.type(
            screen.getByPlaceholderText("ton.email@exemple.com"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("••••••••"),
            "wrongpassword"
        );
        await user.click(
            screen.getByRole("button", { name: /se connecter/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Identifiants incorrects")
            ).toBeInTheDocument();
        });

        expect(onError).toHaveBeenCalledWith("Identifiants incorrects");
    });

    it("shows generic error message on unexpected exception", async () => {
        mockLogin.mockRejectedValue(new Error("Network error"));
        const onError = vi.fn();

        render(<SigninForm onError={onError} />);

        await user.type(
            screen.getByPlaceholderText("ton.email@exemple.com"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("••••••••"),
            "password123"
        );
        await user.click(
            screen.getByRole("button", { name: /se connecter/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Une erreur inattendue est survenue")
            ).toBeInTheDocument();
        });

        expect(onError).toHaveBeenCalledWith(
            "Une erreur inattendue est survenue"
        );
    });

    // ── Password visibility toggle ─────────────────────

    it("toggles password visibility", async () => {
        render(<SigninForm />);

        const passwordInput = screen.getByPlaceholderText("••••••••");
        expect(passwordInput).toHaveAttribute("type", "password");

        // The toggle button is inside the password field container
        // It's the button that is NOT the submit button and NOT "forgot password"
        const buttons = screen.getAllByRole("button");
        const toggleButton = buttons.find(
            btn =>
                !btn.textContent?.includes("connecter") &&
                !btn.textContent?.includes("oublié")
        );
        expect(toggleButton).toBeDefined();

        await user.click(toggleButton!);
        expect(passwordInput).toHaveAttribute("type", "text");

        await user.click(toggleButton!);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    // ── Forgot password callback ───────────────────────

    it("calls onForgotPassword when forgot password is clicked", async () => {
        const onForgotPassword = vi.fn();

        render(<SigninForm onForgotPassword={onForgotPassword} />);

        await user.click(
            screen.getByRole("button", { name: /mot de passe oublié/i })
        );

        expect(onForgotPassword).toHaveBeenCalled();
    });
});
