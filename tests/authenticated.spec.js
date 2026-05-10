import { test, expect } from '../fixtures/auth.js';

test.describe('Authenticated User Workflows', () => {
  test('should access secure area without logging in again', async ({
    authenticatedPage: page,
  }) => {
    // No login code here — we are ALREADY authenticated!
    await expect(page).toHaveURL(/.*\/secure$/);
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Logout/ })).toBeVisible();
  });

  test('should logout from authenticated state', async ({ authenticatedPage: page }) => {
    // We start logged in — go straight to logout
    await page.getByRole('link', { name: /Logout/ }).click();

    await expect(page).toHaveURL('/login');
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  });
});
