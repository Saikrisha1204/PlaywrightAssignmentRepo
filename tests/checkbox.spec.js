import { test, expect } from '@playwright/test';

const CHECKBOX_URL = '/checkboxes';

test.describe('Checkbox Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CHECKBOX_URL);
    await expect(page.getByRole('heading', { name: 'Checkboxes' })).toBeVisible();
  });

  test('should toggle both checkboxes and verify states before and after changes', async ({
    page,
  }) => {
    const firstCheckbox = page.getByRole('checkbox').first();
    const secondCheckbox = page.getByRole('checkbox').last();

    await expect(page.getByRole('checkbox')).toHaveCount(2);

    await expect(firstCheckbox).not.toBeChecked();
    await expect(secondCheckbox).toBeChecked();

    await firstCheckbox.check();
    await secondCheckbox.uncheck();

    await expect(firstCheckbox).toBeChecked();
    await expect(secondCheckbox).not.toBeChecked();
  });
});
