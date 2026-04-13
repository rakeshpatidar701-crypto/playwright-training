import { test, expect } from './fixtures';

test.describe('SauceDemo - authentication', () => {
  test('should login with valid credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.assertPageLoaded();
  });

  test('should show an error for invalid login', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'wrong_password');
    await loginPage.assertLoginError();
  });
});

test.describe('SauceDemo - authenticated flows', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.assertPageLoaded();
  });

  test('should add one item to the cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemsToCart(1);
    await inventoryPage.assertCartBadgeCount(1);
  });

  test('should remove an item from the cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemsToCart(1);
    await inventoryPage.assertCartBadgeCount(1);
    await inventoryPage.removeFirstItemFromCart();
    await inventoryPage.assertCartBadgeCount(0);
  });

  test('should verify cart items and remove one', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemsToCart(2);
    await inventoryPage.openCart();

    await cartPage.assertPageVisible();
    await cartPage.assertItemCount(2);

    const [firstItem] = await cartPage.getItemNames();
    await cartPage.removeItem(firstItem);
    await cartPage.assertItemCount(1);
  });

  test('should continue shopping from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemsToCart(1);
    await inventoryPage.openCart();
    await cartPage.assertPageVisible();

    await cartPage.continueShopping();
    await inventoryPage.assertPageLoaded();
    await inventoryPage.assertCartBadgeCount(1);
  });

  test('should add 2 items and complete checkout end-to-end', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemsToCart(2);
    await inventoryPage.assertCartBadgeCount(2);

    await inventoryPage.openCart();
    await cartPage.assertPageVisible();
    await cartPage.assertItemCount(2);

    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Jane', 'Doe', '90210');

    await checkoutPage.assertOverviewPageVisible();
    await checkoutPage.assertItemCount(2);

    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderSuccess();
  });

  test('should logout successfully', async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await loginPage.assertPageVisible();
  });

  test('should sort products by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortByLowToHigh();
    await inventoryPage.assertPricesSortedLowToHigh();
  });
});
