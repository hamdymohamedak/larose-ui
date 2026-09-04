import { test as base, expect, type Page } from '@playwright/test';

export { expect };

const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';

export async function gotoScenario(page: Page, scenario: string) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-sbx-framework]');
  await page.evaluate((id) => {
    window.location.hash = `/${id}`;
  }, scenario);
  await expect(page.locator(`[data-sbx-scenario="${scenario}"]`)).toBeVisible();
}

export async function pressModShift(page: Page, key: string) {
  await page.keyboard.press(`${MOD}+Shift+${key}`);
}

export async function pressMod(page: Page, key: string) {
  await page.keyboard.press(`${MOD}+${key}`);
}

export const test = base;
