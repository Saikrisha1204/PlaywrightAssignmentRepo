const { test, expect } = require('@playwright/test');

const DROPDOWN_URL = 'https://the-internet.herokuapp.com/dropdown';

const OPTIONS = {
  option1: { value: '1', label: 'Option 1' },
  option2: { value: '2', label: 'Option 2' },
};

test.describe('Dropdown Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(DROPDOWN_URL);
    await expect(page.getByRole('heading', { name: 'Dropdown List' })).toBeVisible();
    await expect(page.locator('#dropdown')).toBeVisible();
  });

  test('should select Option 1 and verify it is selected', async ({ page }) => {
    const dropdown = page.locator('#dropdown');

    await expect(dropdown).toHaveValue('');

    await dropdown.selectOption(OPTIONS.option1.value);

    await expect(dropdown).toHaveValue(OPTIONS.option1.value);
    await expect(dropdown.locator('option:checked')).toHaveText(OPTIONS.option1.label);
  });

  test('should select Option 2 and verify it is selected', async ({ page }) => {
    const dropdown = page.locator('#dropdown');

    await expect(dropdown).toHaveValue('');

    await dropdown.selectOption(OPTIONS.option2.value);

    await expect(dropdown).toHaveValue(OPTIONS.option2.value);
    await expect(dropdown.locator('option:checked')).toHaveText(OPTIONS.option2.label);
  });

});