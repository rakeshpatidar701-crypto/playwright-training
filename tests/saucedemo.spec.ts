import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('SauceDemo - authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await loginPage.assertLoginSuccess();
  });

  test('should show an error for invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'wrong_password');
    await loginPage.assertLoginError();
  });
});

test.describe('SauceDemo - authenticated flows', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.assertInventoryPageLoaded();
  });

  test('should add one item to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.assertCartBadgeCount(1);
  });

  test('should remove an item from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.assertCartBadgeCount(1);

    await inventoryPage.removeFirstItemFromCart();
    await inventoryPage.assertCartBadgeCount(0);
  });

  test('should complete checkout successfully', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();

    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('should sort products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortByPriceLowToHigh();
    await inventoryPage.assertPricesSortedLowToHigh();
  });
});