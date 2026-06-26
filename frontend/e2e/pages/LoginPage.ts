import { Page, Locator, expect } from '@playwright/test'
import { ROUTES, TIMEOUTS } from '../data/test-data'

export class LoginPage {
  readonly page:          Page
  readonly emailInput:    Locator
  readonly passwordInput: Locator
  readonly submitButton:  Locator
  readonly serverError:   Locator
  readonly emailError:    Locator
  readonly passwordError: Locator
  readonly showPasswordBtn: Locator
  readonly forgotPasswordLink: Locator
  readonly registerLink:  Locator

  constructor(page: Page) {
    this.page            = page
    this.emailInput      = page.locator('#email')
    this.passwordInput   = page.locator('#password')
    this.submitButton    = page.getByRole('button', { name: /entrar/i })
    this.serverError     = page.locator('[role="alert"]').filter({ hasText: /email ou senha|credencial/i })
    this.emailError      = page.locator('[role="alert"]').filter({ hasText: /email/i })
    this.passwordError   = page.locator('[role="alert"]').filter({ hasText: /senha/i })
    this.showPasswordBtn = page.getByRole('button', { name: /mostrar|ocultar senha/i })
    this.forgotPasswordLink = page.getByRole('link', { name: /esqueceu/i })
    this.registerLink    = page.getByRole('link', { name: /criar conta/i })
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.adminLogin)
    await this.page.waitForLoadState('networkidle')
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async loginAndWaitForDashboard(email: string, password: string): Promise<void> {
    await this.login(email, password)
    await this.page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: TIMEOUTS.navigation })
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailError).toBeVisible()
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordError).toBeVisible()
  }

  async expectServerError(message?: string): Promise<void> {
    const alert = this.page.locator('[role="alert"]')
    await expect(alert).toBeVisible({ timeout: TIMEOUTS.api })
    if (message) {
      await expect(alert).toContainText(message)
    }
  }

  async expectToBeOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin$/, { timeout: 3_000 })
    await expect(this.emailInput).toBeVisible()
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordBtn.click()
  }
}
