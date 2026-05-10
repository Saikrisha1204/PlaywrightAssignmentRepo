const { test, expect } = require('@playwright/test');
const DYNAMIC_LOADING_PATH  = '/dynamic_loading';

test.describe('Dynamic Loading', () => {

  /**
   * Example 1: Element exists in DOM but is hidden.
   * Playwright waits for it to become visible after the loader disappears.
   */
  test('Example 1 - Hidden element becomes visible after loading', async ({ page }) => {
    await page.goto(`${DYNAMIC_LOADING_PATH }/1`);

    const startButton = page.getByRole('button', { name: 'Start' });
    await expect(startButton).toBeVisible();

    await startButton.click();

    await expect(page.locator('#loading')).toBeHidden({ timeout: 10000 });

    const helloText = page.getByRole('heading', { name: 'Hello World!' });
    await expect(helloText).toBeVisible();
  });

  /**
   * Example 2: Element does NOT exist in DOM initially.
   * JavaScript renders and injects it after loading completes.
   */
  test('Example 2 - Element rendered into DOM after loading', async ({ page }) => {
    await page.goto(`${DYNAMIC_LOADING_PATH }/2`);

    const startButton = page.getByRole('button', { name: 'Start' });
    await expect(startButton).toBeVisible();

    await startButton.click();

    await expect(page.locator('#loading')).toBeHidden({ timeout: 10000 });

    const helloText = page.getByRole('heading', { name: 'Hello World!' });
    await expect(helloText).toBeVisible();
  });

});