import { expect, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async clickCheckout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }

  async fillCheckoutInformation(firstName: string, lastName: string, zip: string) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(zip);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async assertOverviewPageVisible() {
    await expect(this.page.getByText('Checkout: Overview')).toBeVisible();
  }

  async finishCheckout() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async assertItemCount(expected: number) {
    await expect(this.page.locator('.cart_item')).toHaveCount(expected);
  }

  async assertOrderSuccess() {
    await expect(this.page.getByText('Thank you for your order!')).toBeVisible();
  }
}