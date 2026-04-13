import { expect, Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async assertPageVisible() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.page.getByText('Your Cart')).toBeVisible();
  }

  async assertItemCount(expected: number) {
    await expect(this.page.getByTestId('inventory-item')).toHaveCount(expected);
  }

  async getItemNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async assertItemNames(expectedNames: string[]) {
    const names = this.page.getByTestId('inventory-item-name');
    await expect(names).toHaveText(expectedNames);
  }

  async removeItem(name: string) {
    const item = this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async clickCheckout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
