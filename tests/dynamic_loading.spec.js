import { test, expect } from '@playwright/test';

const DYNAMIC_LOADING_PATH = '/dynamic_loading';
const LOADER_TIMEOUT_MS = 10_000;

const EXAMPLES = [
  { number: 1, description: 'Hidden element becomes visible after loading' },
  { number: 2, description: 'Element rendered into DOM after loading' },
];

test.describe('Dynamic Loading', () => {
  for (const example of EXAMPLES) {
    test(`Example ${example.number} - ${example.description}`, async ({ page }) => {
      await page.goto(`${DYNAMIC_LOADING_PATH}/${example.number}`);

      const startButton = page.getByRole('button', { name: 'Start' });
      await expect(startButton).toBeVisible();
      await startButton.click();

      await expect(page.locator('#loading')).toBeHidden({ timeout: LOADER_TIMEOUT_MS });
      await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();
    });
  }
});