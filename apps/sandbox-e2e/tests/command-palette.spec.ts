import { test, expect, gotoScenario, pressMod } from './helpers';

test.describe('Command palette', () => {
  test('opens via button, filters, closes on Escape', async ({ page }) => {
    await gotoScenario(page, 'command');

    await page.locator('[data-sbx="open-command"]').click();
    const dialog = page.getByRole('dialog').filter({ hasText: /Show toast|Parity note|Search/i });
    await expect(dialog).toBeVisible();

    const search = page.getByRole('combobox');
    await expect(search).toBeFocused();
    await search.fill('toast');
    await expect(page.getByRole('option', { name: 'Show toast' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('opens via keyboard accelerator', async ({ page }) => {
    await gotoScenario(page, 'command');
    await pressMod(page, 'k');
    await expect(
      page.getByRole('dialog').filter({ hasText: /Show toast|Parity note|Search/i }),
    ).toBeVisible();
  });
});
