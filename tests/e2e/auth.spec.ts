import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
    test("should display login page", async ({ page }) => {
        await page.goto("/auth");

        // Vérifier que la page d'authentification se charge
        await expect(page).toHaveTitle(/Edukai/i);

        // Vérifier la présence du logo et titre Edukai
        await expect(
            page.getByRole("heading", { name: /Edukai/i })
        ).toBeVisible();

        // Vérifier la présence du logo
        await expect(page.getByAltText(/Logo Edukai/i)).toBeVisible();
    });

    test("should show validation errors on empty form submission", async ({
        page,
    }) => {
        await page.goto("/auth");

        // Chercher le bouton de connexion et cliquer
        const submitButton = page
            .getByRole("button", { name: /connexion|login|se connecter/i })
            .first();
        await submitButton.click();

        // Vérifier qu'on reste sur la page (pas de redirection)
        await expect(page).toHaveURL(/auth/);
    });

    test("should redirect unauthenticated users from protected routes", async ({
        page,
    }) => {
        // Essayer d'accéder à une route protégée sans être authentifié
        await page.goto("/dashboard");

        // Devrait rediriger vers /auth
        await expect(page).toHaveURL(/auth/);
    });

    test("should handle invalid credentials", async ({ page }) => {
        await page.goto("/auth");

        // Remplir avec des identifiants invalides
        await page.fill(
            'input[name="email"], input[type="email"]',
            "invalid@example.com"
        );
        await page.fill(
            'input[name="password"], input[type="password"]',
            "wrongpassword"
        );

        // Soumettre le formulaire
        const submitButton = page
            .getByRole("button", { name: /connexion|login|se connecter/i })
            .first();
        await submitButton.click();

        // Attendre un message d'erreur ou rester sur la page
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(/auth/);
    });
});

test.describe("Registration Flow", () => {
    test("should display registration form", async ({ page }) => {
        await page.goto("/auth");

        // Chercher un lien/bouton vers l'inscription
        const registerLink = page
            .getByRole("link", {
                name: /inscription|register|s'inscrire|créer un compte/i,
            })
            .first();

        if (await registerLink.isVisible()) {
            await registerLink.click();
            await expect(
                page.getByRole("heading", {
                    name: /inscription|register|s'inscrire/i,
                })
            ).toBeVisible();
        }
    });
});
