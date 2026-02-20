import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
    test("should display login page", async ({ page }) => {
        await page.goto("/auth");

        await expect(page).toHaveTitle(/Edukai/i);
        await expect(
            page.getByRole("heading", { name: /Edukai/i })
        ).toBeVisible();
        await expect(page.getByAltText(/Logo Edukai/i)).toBeVisible();
    });

    test("should show validation errors on empty form submission", async ({
        page,
    }) => {
        await page.goto("/auth");

        const submitButton = page
            .getByRole("button", { name: /se connecter/i })
            .first();
        await submitButton.click();

        await expect(page).toHaveURL(/auth/);
    });

    test("should redirect unauthenticated users from protected routes", async ({
        page,
    }) => {
        await page.goto("/library");

        await expect(page).toHaveURL(/auth/);
    });

    test("should handle invalid credentials", async ({ page }) => {
        await page.goto("/auth");

        await page
            .getByPlaceholder(/ton\.email/i)
            .fill("invalid@example.com");
        await page
            .getByPlaceholder("••••••••")
            .first()
            .fill("wrongpassword");

        const submitButton = page
            .getByRole("button", { name: /se connecter/i })
            .first();
        await submitButton.click();

        await expect(page).toHaveURL(/auth/);
    });
});

test.describe("Registration Flow", () => {
    test("should display registration form when clicking register button", async ({
        page,
    }) => {
        await page.goto("/auth");

        const registerButton = page
            .getByRole("button", {
                name: /créer un compte/i,
            })
            .first();

        await expect(registerButton).toBeVisible();
        await registerButton.click();

        await expect(
            page.getByRole("heading", {
                name: /commence ton aventure/i,
            })
        ).toBeVisible();
    });
});
