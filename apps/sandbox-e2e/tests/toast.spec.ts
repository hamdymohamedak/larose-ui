import { test, expect, gotoScenario } from './helpers';

test.describe('Toast', () => {
  test('shows a status toast from the runtime provider', async ({ page }) => {
    await gotoScenario(page, 'toast');

    await page.locator('[data-sbx="show-toast"]').click();
    await expect(page.getByText('Toast parity check.')).toBeVisible();
  });
});
