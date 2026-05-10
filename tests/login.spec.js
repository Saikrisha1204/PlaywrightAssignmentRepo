import { test } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage.js';

dotenv.config();

const VALID_CREDENTIALS = {
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
};

const INVALID_CREDENTIALS = {
  username: 'WrongUser',
  password: 'WrongPassword',
};

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);

    await loginPage.expectLoginSuccess();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password);

    await loginPage.expectLoginError();
  });

  test('should logout successfully after a valid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await loginPage.expectLoginSuccess();

    await loginPage.logout();

    await loginPage.expectLogoutSuccess();
  });
});
