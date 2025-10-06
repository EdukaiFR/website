import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la page se charge
    await expect(page).toHaveTitle(/Edukai/i);

    // Vérifier la présence du logo ou du nom de l'application
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Vérifier la présence d'un lien de navigation (ajuster selon votre navbar)
    const authLink = page.getByRole('link', { name: /connexion|login|auth/i }).first();

    if (await authLink.isVisible()) {
      await authLink.click();
      await expect(page).toHaveURL(/auth/);
    }
  });

  test('should handle non-existent pages gracefully', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz123');

    // Vérifier que la page se charge sans erreur (peut être 404 ou redirection)
    // Next.js peut gérer cela de différentes façons selon la configuration
    await expect(page).toHaveTitle(/Edukai/i);
  });
});
