import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo - authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.assertPageLoaded();
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
    await inventoryPage.assertPageLoaded();
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
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await checkoutPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Test', 'User', '12345');
    await checkoutPage.assertOverviewPageVisible();
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderSuccess();
  });

  test('should add 2 items and complete checkout end-to-end', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addItemsToCart(2);
    await inventoryPage.assertCartBadgeCount(2);

    await inventoryPage.openCart();
    await checkoutPage.assertItemCount(2);

    await checkoutPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Jane', 'Doe', '90210');

    await checkoutPage.assertOverviewPageVisible();
    await checkoutPage.assertItemCount(2);

    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderSuccess();
  });

  test('should logout successfully', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('should sort products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortByLowToHigh();
    await inventoryPage.assertPricesSortedLowToHigh();
  });
});