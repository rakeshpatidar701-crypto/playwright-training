import { expect, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertInventoryPageLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async addFirstItemToCart() {
    await this.page.getByRole('button', { name: 'Add to cart' }).first().click();
  }

  async removeFirstItemFromCart() {
    await this.page.getByRole('button', { name: 'Remove' }).first().click();
  }

  async assertCartBadgeCount(count: number) {
    const badge = this.page.locator('.shopping_cart_badge');

    if (count === 0) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(count));
    }
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }

  async sortByPriceLowToHigh() {
    await this.page.getByRole('combobox').selectOption('lohi');
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(price => Number(price.replace('$', '').trim()));
  }

  async assertPricesSortedLowToHigh() {
    const actualPrices = await this.getProductPrices();
    const expectedPrices = [...actualPrices].sort((a, b) => a - b);
    expect(actualPrices).toEqual(expectedPrices);
  }
}