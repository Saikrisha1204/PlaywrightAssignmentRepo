import { test as base, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import { LoginPage } from '../pages/LoginPage.js';

dotenv.config();

const AUTH_FILE = 'playwright/.auth/user.json';

/**
 * Provides an `authenticatedPage` fixture for tests that should start
 * in a logged-in state.
 *
 * The fixture leverages the storageState saved by tests/auth.setup.js
 * (configured via project-level `storageState` in playwright.config.js).
 *
 * ─── NOTE ON THE FALLBACK RE-AUTHENTICATION ──────────────────────────
 * the-internet.herokuapp.com uses Rack-based server-side sessions that
 * sometimes reject reuse across browser contexts (a known limitation of
 * the demo site, not the pattern itself). When the saved session is
 * rejected, the fixture transparently re-authenticates so tests remain
 * reliable. In production apps with standard cookie/JWT auth, the
 * fallback would never trigger and `setup` would be the only login.
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    if (!fs.existsSync(AUTH_FILE)) {
      throw new Error(
        `Auth state file not found at ${AUTH_FILE}. ` +
          `Ensure the 'setup' project runs first (see playwright.config.js).`,
      );
    }

    // Attempt to use the saved session
    await page.goto('/secure');

    // Fallback: if the demo site rejected the cross-context session,
    // re-authenticate and refresh the saved state
    if (page.url().includes('/login')) {
      const loginPage = new LoginPage(page);
      await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
      await loginPage.expectLoginSuccess();
      await page.context().storageState({ path: AUTH_FILE });
    }

    await use(page);
  },
});

export { expect };
