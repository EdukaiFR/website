import { test, expect } from '@playwright/test';

test.describe('Dashboard (Protected Routes)', () => {
  test.beforeEach(async ({ page }) => {
    // Ces tests vérifient le comportement sans authentification
    // Pour tester avec authentification, il faudra ajouter un helper de login
    await page.goto('/dashboard');
  });

  test('should redirect to auth when not logged in', async ({ page }) => {
    // Le middleware devrait rediriger vers /auth
    await expect(page).toHaveURL(/auth/);
  });

  test('should not access library without auth', async ({ page }) => {
    await page.goto('/dashboard/library');

    // Devrait rediriger vers /auth
    await expect(page).toHaveURL(/auth/);
  });

  test('should not access settings without auth', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Devrait rediriger vers /auth
    await expect(page).toHaveURL(/auth/);
  });
});

// TODO: Ajouter des tests avec authentification
// test.describe('Dashboard (Authenticated)', () => {
//   test.beforeEach(async ({ page }) => {
//     // Helper de login à créer
//     await loginAsUser(page, 'user@example.com', 'password');
//   });
//
//   test('should access dashboard when authenticated', async ({ page }) => {
//     await page.goto('/dashboard');
//     await expect(page).toHaveURL(/dashboard/);
//   });
// });
