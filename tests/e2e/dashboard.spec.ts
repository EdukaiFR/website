import { test, expect } from "@playwright/test";

test.describe("Protected Routes", () => {
    test("should redirect to auth when accessing library", async ({
        page,
    }) => {
        await page.goto("/library");
        await expect(page).toHaveURL(/auth/);
    });

    test("should redirect to auth when accessing settings", async ({
        page,
    }) => {
        await page.goto("/settings");
        await expect(page).toHaveURL(/auth/);
    });

    test("should redirect to auth when accessing profile", async ({
        page,
    }) => {
        await page.goto("/profile");
        await expect(page).toHaveURL(/auth/);
    });
});
