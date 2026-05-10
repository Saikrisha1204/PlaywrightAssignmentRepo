import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import dotenv from 'dotenv';

dotenv.config();

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
    await loginPage.expectLoginSuccess();

    // Provide the authenticated page to the test
    await use(page);
  },
});

export { expect } from '@playwright/test';
