import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage.js';

dotenv.config();

const AUTH_FILE = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await loginPage.expectLoginSuccess();

  // Save the authenticated state to disk for all browser projects to reuse
  await page.context().storageState({ path: AUTH_FILE });
});