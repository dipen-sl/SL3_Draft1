import { test, expect } from '@playwright/test';

test("Amazon Shopping Experience", async ({ page }) => {
  await page.goto("https://www.amazon.com");

  const continueShoppingButton = page.getByRole('button', { name: "Continue shopping" });
  if (await continueShoppingButton.isVisible().catch(() => false)) {
    await continueShoppingButton.click();
  }

  // Click on Sign In from the homepage
  await page.getByRole('link', { name: "Sign in", exact: true }).click();

// Enter email / mobile number
await expect(page.getByLabel("Enter mobile number or email")).toBeVisible();
await page.getByLabel("Enter mobile number or email").fill("rishabhjangid1010@gmail.com");
await page.getByRole('button', { name: "Continue" }).click();


await expect(page.getByLabel("Password")).toBeVisible();
await page.getByLabel("Password").fill("123456");
await page.getByRole('button', { name: "Sign in" }).click();


  await expect(page.getByRole('searchbox', { name: "Search Amazon" })).toBeVisible();
  await page.locator("#twotabsearchtextbox").fill("wireless headphones");
  await page.locator("#nav-search-submit-button").click();
  await expect(page.locator("role=heading[name*='Results']")).toBeVisible();
  await page.locator("role=link[name*='Sony'] >> nth=0").click();
  await expect(page.getByRole('button', { name: "Add to Cart" })).toBeVisible();
  await page.locator("#add-to-cart-button").click();
  await expect(page.getByRole('heading', { name: "Added to Cart" })).toBeVisible();
  await page.locator("#nav-logo-sprites").click();
  await page.locator("#twotabsearchtextbox").fill("laptop stand");
  await page.locator("#nav-search-submit-button").click();
  await expect(page.locator("role=heading[name*='results for']")).toBeVisible();
  await page.locator("role=link[name*='Stand'] >> nth=1").click();
  await expect(page.getByRole('button', { name: "Add to Cart" })).toBeVisible();
  await page.locator("#add-to-cart-button").click();
  await expect(page.getByRole('heading', { name: "Added to Cart" })).toBeVisible();
  await page.getByRole('link', { name: "Go to Cart" }).click();
  await expect(page.getByRole('heading', { name: "Shopping Cart" })).toBeVisible();
  await expect(page.getByText("Subtotal (2 items)")).toBeVisible();
  await page.getByRole('button', { name: "Proceed to checkout" }).click();
  await expect(page.getByRole('heading', { name: "Sign in" })).toBeVisible();
  await page.locator("#ap_email").fill("customer@example.com");
  await page.locator("#continue").click();
  await page.locator("#ap_password").fill("password123");
  await page.locator("#signInSubmit").click();
  await expect(page.getByRole('heading', { name: "Checkout" })).toBeVisible();
  await page.getByText("Add a new address").click();
  await page.locator("[name='address-ui-widgets-enterAddressFullName']").fill("John Doe");
  await page.locator("[name='address-ui-widgets-enterAddressPhoneNumber']").fill("5551234567");
  await page.locator("[name='address-ui-widgets-enterAddressLine1']").fill("123 Main Street");
  await page.locator("[name='address-ui-widgets-enterAddressCity']").fill("New York");
  await page.locator("role=button[name*='State']").click();
  await page.getByRole('option', { name: "NEW YORK" }).click();
  await page.locator("[name='address-ui-widgets-enterAddressPostalCode']").fill("10001");
  await page.getByRole('button', { name: "Use this address" }).click();
  await expect(page.getByRole('heading', { name: "Payment method" })).toBeVisible();
  await page.getByRole('button', { name: "Add a credit or debit card" }).click();
  await page.getByRole('textbox', { name: "Card number" }).fill("4111111111111111");
  await page.getByRole('textbox', { name: "Name on card" }).fill("John Doe");
  await page.getByRole('button', { name: "Month" }).click();
  await page.getByRole('option', { name: "12" }).click();
  await page.getByRole('button', { name: "Year" }).click();
  await page.getByRole('option', { name: "2025" }).click();
  await page.getByRole('button', { name: "Add your card" }).click();
  await expect(page.locator("role=heading[name*='Review your order']")).toBeVisible();
  await expect(page.getByText("wireless headphones")).toBeVisible();
  await expect(page.getByText("laptop stand")).toBeVisible();
  await page.getByRole('button', { name: "Place your order" }).click();
  await expect(page.locator("role=heading[name*='Order placed, thanks!']")).toBeVisible();
  await expect(page.locator("text*='Confirmation will be sent to your email.'")).toBeVisible();
});