import { expect, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async assertLoginError() {
    await expect(this.page.getByText(/Epic sadface/i)).toBeVisible();
  }
}