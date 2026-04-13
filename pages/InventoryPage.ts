import { expect, Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page).toHaveTitle('Swag Labs');
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async addItemsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      await this.page.getByRole('button', { name: 'Add to cart' }).first().click();
    }
  }

  async removeFirstItemFromCart() {
    await this.page.getByRole('button', { name: 'Remove' }).first().click();
  }

  async assertCartBadgeCount(count: number) {
    const badge = this.page.getByTestId('shopping-cart-badge');

    if (count === 0) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(count));
    }
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }

  async sortByLowToHigh() {
    await this.page.getByRole('combobox').selectOption('lohi');
  }

  async assertPricesSortedLowToHigh() {
    const prices = await this.page.getByTestId('inventory-item-price').allTextContents();
    const actual = prices.map(price => Number(price.replace('$', '').trim()));
    const expected = [...actual].sort((a, b) => a - b);
    expect(actual).toEqual(expected);
  }
}
