import { test, expect } from '@playwright/test';

test.setTimeout(60000); // allow up to 60s per test


test('Amazon Shopping Experience', async ({ page }) => {
  // Go to Amazon
  await page.goto('https://www.amazon.com');

  // Handle region popup if it shows
  try {
    await page.locator('#nav-main').waitFor({ timeout: 5000 });
  } catch {
    console.log('Nav bar not found immediately, continuing anyway.');
  }

  // Search for wireless headphones
  await page.locator('#twotabsearchtextbox').fill('wireless headphones');
  await page.locator('#nav-search-submit-button').click();

  // Wait for results container
  await page.locator('div.s-main-slot').waitFor({ timeout: 10000 });

  // Assert at least 1 product appears
  const productCount = await page.locator('div.s-main-slot div[data-component-type="s-search-result"]').count();
  expect(productCount).toBeGreaterThan(0);
});
