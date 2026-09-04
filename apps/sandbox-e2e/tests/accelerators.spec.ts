import { test, expect, gotoScenario, pressModShift } from './helpers';

test.describe('Keyboard accelerators', () => {
  test('fires mod+shift+j via AcceleratorProvider', async ({ page }) => {
    await gotoScenario(page, 'accelerators');

    await expect(page.locator('[data-sbx="accelerator-status"]')).toContainText('none');
    await pressModShift(page, 'J');
    await expect(page.locator('[data-sbx="accelerator-status"]')).toContainText('mod+shift+j');
  });
});
