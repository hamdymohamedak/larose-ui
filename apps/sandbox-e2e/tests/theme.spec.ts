import { test, expect, gotoScenario } from './helpers';

test.describe('Theme', () => {
  test('toggles data-lr-theme on the provider root', async ({ page }) => {
    await gotoScenario(page, 'theme');

    const provider = page.locator('[data-lr-provider]').first();
    await expect(provider).toHaveAttribute('data-lr-theme', 'light');
    await expect(page.locator('[data-sbx="theme-label"]')).toContainText('light');

    await page.locator('[data-sbx="toggle-theme"]').click();
    await expect(provider).toHaveAttribute('data-lr-theme', 'dark');
    await expect(page.locator('[data-sbx="theme-label"]')).toContainText('dark');
  });
});
