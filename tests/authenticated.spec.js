import { test, expect } from '../fixtures/auth.js';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('Authenticated User Workflows', () => {
  let loginPage;

  test.beforeEach(async ({ authenticatedPage: page }) => {
    loginPage = new LoginPage(page);
    // Note: fixture has already navigated to /secure
  });

  test('should access secure area without explicit login in the test', async ({
    authenticatedPage: page,
  }) => {
    // The test never called loginPage.login() — auth came from the fixture.
    // We verify we're on the secure page with all expected elements.
    await expect(page).toHaveURL(/.*\/secure$/);
    await expect(loginPage.secureAreaHeading).toBeVisible();
    await expect(loginPage.logoutLink).toBeVisible();
  });

  test('should logout from pre-authenticated state', async () => {
    // The test never explicitly logged in — yet we can immediately log out.
    // This proves the fixture set up the authenticated state correctly.
    await loginPage.logout();
    await loginPage.expectLogoutSuccess();
  });
});