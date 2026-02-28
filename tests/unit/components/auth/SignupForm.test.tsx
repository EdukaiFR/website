/**
 * SignupForm Component Tests
 *
 * Demonstrates: complex form validation with Zod refinements,
 * live password requirements UI, and async registration flow.
 * Pattern: test visual feedback (password strength), cross-field validation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "@/components/auth/signup-form";

const mockRegister = vi.fn();
vi.mock("@/hooks/useSession", () => ({
    useSession: () => ({
        register: mockRegister,
        user: null,
        loading: false,
    }),
}));

describe("SignupForm", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Rendering ──────────────────────────────────────

    it("renders all registration fields", () => {
        render(<SignupForm />);

        expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("john.doe@exemple.com")
        ).toBeInTheDocument();
        // Two password fields (password + confirm)
        const passwordInputs = screen.getAllByPlaceholderText("••••••••");
        expect(passwordInputs).toHaveLength(2);
    });

    it("renders the header", () => {
        render(<SignupForm />);
        expect(
            screen.getByText("Commence ton aventure")
        ).toBeInTheDocument();
    });

    // ── Validation errors ──────────────────────────────

    it("shows validation errors on empty submit", async () => {
        render(<SignupForm />);

        await user.click(
            screen.getByRole("button", { name: /créer mon compte/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/prénom requis/i)
            ).toBeInTheDocument();
        });
    });

    it("shows email validation error for empty email", async () => {
        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("John"), "Test");
        await user.type(screen.getByPlaceholderText("Doe"), "User");
        // Leave email empty
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[0],
            "Test123"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[1],
            "Test123"
        );

        await user.click(
            screen.getByRole("button", { name: /créer mon compte/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Adresse email invalide")
            ).toBeInTheDocument();
        });
    });

    it("shows password mismatch error", async () => {
        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("John"), "Test");
        await user.type(screen.getByPlaceholderText("Doe"), "User");
        await user.type(
            screen.getByPlaceholderText("john.doe@exemple.com"),
            "test@example.com"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[0],
            "Test123"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[1],
            "Different1"
        );

        await user.click(
            screen.getByRole("button", { name: /créer mon compte/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/mots de passe ne correspondent pas/i)
            ).toBeInTheDocument();
        });
    });

    // ── Password requirements ──────────────────────────

    it("shows password requirements when typing password", async () => {
        render(<SignupForm />);

        const passwordInput = screen.getAllByPlaceholderText("••••••••")[0];
        await user.type(passwordInput, "a");

        await waitFor(() => {
            expect(
                screen.getByText("Au moins 6 caractères")
            ).toBeInTheDocument();
            expect(screen.getByText("Une majuscule")).toBeInTheDocument();
            expect(screen.getByText("Une minuscule")).toBeInTheDocument();
            expect(screen.getByText("Un chiffre")).toBeInTheDocument();
        });
    });

    // ── Successful registration ────────────────────────

    it("calls register with correct data on valid submit", async () => {
        mockRegister.mockResolvedValue({ success: true });
        const onSuccess = vi.fn();

        render(<SignupForm onSuccess={onSuccess} />);

        await user.type(screen.getByPlaceholderText("John"), "Test");
        await user.type(screen.getByPlaceholderText("Doe"), "User");
        await user.type(
            screen.getByPlaceholderText("john.doe@exemple.com"),
            "test@example.com"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[0],
            "Test123"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[1],
            "Test123"
        );

        await user.click(
            screen.getByRole("button", { name: /créer mon compte/i })
        );

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                username: "test@example.com",
                password: "Test123",
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
            });
        });

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    // ── Failed registration ────────────────────────────

    it("shows error on registration failure", async () => {
        mockRegister.mockResolvedValue({
            success: false,
            error: "Email déjà utilisé",
        });
        const onError = vi.fn();

        render(<SignupForm onError={onError} />);

        await user.type(screen.getByPlaceholderText("John"), "Test");
        await user.type(screen.getByPlaceholderText("Doe"), "User");
        await user.type(
            screen.getByPlaceholderText("john.doe@exemple.com"),
            "test@example.com"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[0],
            "Test123"
        );
        await user.type(
            screen.getAllByPlaceholderText("••••••••")[1],
            "Test123"
        );

        await user.click(
            screen.getByRole("button", { name: /créer mon compte/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Email déjà utilisé")
            ).toBeInTheDocument();
        });

        expect(onError).toHaveBeenCalledWith("Email déjà utilisé");
    });

    // ── Does not submit when invalid ───────────────────

    it("does not call register when form has validation errors", async () => {
        render(<SignupForm />);

        await user.click(
            screen.getByRole("button", { name: /créer mon compte/i })
        );

        await waitFor(() => {
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });
});
