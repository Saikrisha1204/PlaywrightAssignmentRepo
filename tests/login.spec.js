import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const LOGIN_URL = '/login';
const SECURE_URL_PATTERN = /.*\/secure$/;

const VALID_CREDENTIALS = {
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
};

const INVALID_CREDENTIALS = {
  username: 'WrongUser',
  password: 'WrongPassword',
};

const MESSAGES = {
  loginSuccess: 'You logged into a secure area!',
  logoutSuccess: 'You logged out of the secure area!',
  invalidUsername: 'Your username is invalid!',
};

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(VALID_CREDENTIALS.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(VALID_CREDENTIALS.password);
    await page.getByRole('button', { name: /Login/ }).click();

    await expect(page).toHaveURL(SECURE_URL_PATTERN);
    await expect(page.locator('#flash')).toContainText(MESSAGES.loginSuccess);
    await expect(page.getByRole('link', { name: /Logout/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(INVALID_CREDENTIALS.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(INVALID_CREDENTIALS.password);
    await page.getByRole('button', { name: /Login/ }).click();

    await expect(page.locator('#flash')).toContainText(MESSAGES.invalidUsername);
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.getByRole('link', { name: /Logout/ })).toBeHidden();
  });

  test('should logout successfully after a valid login', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(VALID_CREDENTIALS.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(VALID_CREDENTIALS.password);
    await page.getByRole('button', { name: /Login/ }).click();

    await expect(page).toHaveURL(SECURE_URL_PATTERN);

    await page.getByRole('link', { name: /Logout/ }).click();

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.locator('#flash')).toContainText(MESSAGES.logoutSuccess);
    await expect(page.getByRole('link', { name: /Logout/ })).toBeHidden();
  });
});
