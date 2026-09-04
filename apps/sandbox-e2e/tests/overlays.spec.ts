import { test, expect, gotoScenario } from './helpers';

test.describe('Dialog + focus trap', () => {
  test('opens modal, traps focus context, closes on Escape', async ({ page }) => {
    await gotoScenario(page, 'overlays');

    await page.locator('[data-sbx="open-modal"]').click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Confirm action' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});
