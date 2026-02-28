import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
    test("should redirect unauthenticated root to auth page", async ({
        page,
    }) => {
        await page.goto("/");

        await expect(page).toHaveURL(/auth/);
        await expect(page).toHaveTitle(/Edukai/i);
    });

    test("should handle non-existent pages gracefully", async ({ page }) => {
        await page.goto("/this-page-does-not-exist-xyz123");

        await expect(page).toHaveURL(/auth/);
    });
});
