import { expect } from '@playwright/test';

const SECURE_URL_PATTERN = /.*\/secure$/;

const MESSAGES = {
  loginSuccess: 'You logged into a secure area!',
  logoutSuccess: 'You logged out of the secure area!',
  invalidUsername: 'Your username is invalid!',
};

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  // ============================================================
  // LOCATORS — Defined once, used everywhere
  // ============================================================

  get pageHeading() {
    return this.page.getByRole('heading', { name: 'Login Page' });
  }

  get usernameField() {
    return this.page.getByRole('textbox', { name: 'Username' });
  }

  get passwordField() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get loginButton() {
    return this.page.getByRole('button', { name: /Login/ });
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: /Logout/ });
  }

  get flashMessage() {
    return this.page.locator('#flash');
  }

  get secureAreaHeading() {
    return this.page.getByRole('heading', { name: 'Secure Area', exact: true });
  }

  // ============================================================
  // ACTIONS — User behaviors
  // ============================================================

  async goto() {
    await this.page.goto('/login');
    await expect(this.pageHeading).toBeVisible();
  }

  async login(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  // ============================================================
  // ASSERTIONS — Page-specific verifications
  // ============================================================

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(SECURE_URL_PATTERN);
    await expect(this.flashMessage).toContainText(MESSAGES.loginSuccess);
    await expect(this.logoutLink).toBeVisible();
    await expect(this.secureAreaHeading).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.flashMessage).toContainText(MESSAGES.invalidUsername);
    await expect(this.page).toHaveURL('/login');
    await expect(this.logoutLink).toBeHidden();
  }

  async expectLogoutSuccess() {
    await expect(this.page).toHaveURL('/login');
    await expect(this.flashMessage).toContainText(MESSAGES.logoutSuccess);
    await expect(this.logoutLink).toBeHidden();
  }
}
