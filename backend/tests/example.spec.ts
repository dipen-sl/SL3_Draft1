/**
 * @priority 1
 * @tags smoke,example
 */
import { test, expect } from '@playwright/test';

test('homepage should have title', async ({ page, baseURL }) => {
  const target = process.env.BASE_URL || baseURL || 'https://playwright.dev';
  await page.goto(target);
  await expect(page).toHaveTitle(/Playwright|UI|Example/i);
});