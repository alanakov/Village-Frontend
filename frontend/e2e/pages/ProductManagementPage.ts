import { Page, Locator, expect } from '@playwright/test'
import { ROUTES, TIMEOUTS } from '../data/test-data'
import { waitForSkeletonToDisappear } from '../helpers/wait.helper'

/** Page Object Model for /admin/products (AdminProductManagement component). */
export class ProductManagementPage {
  readonly page: Page

  // ── Header ──────────────────────────────────────────────────────────────────
  readonly newProductButton: Locator
  readonly pageHeading:      Locator

  // ── Search ──────────────────────────────────────────────────────────────────
  readonly searchInput: Locator

  // ── Modal — form fields ─────────────────────────────────────────────────────
  readonly nameInput:        Locator
  readonly descriptionInput: Locator
  readonly priceInput:       Locator
  readonly sizeInput:        Locator
  readonly categorySelect:   Locator
  readonly imageFileInput:   Locator
  readonly saveButton:       Locator
  readonly cancelButton:     Locator

  // ── Delete confirmation modal ────────────────────────────────────────────────
  readonly deleteConfirmButton: Locator

  constructor(page: Page) {
    this.page              = page
    this.newProductButton  = page.getByRole('button', { name: /novo produto/i })
    this.pageHeading       = page.getByRole('heading', { name: /gestão de produtos/i })
    this.searchInput       = page.locator('input[type="search"]')

    // Modal fields — scoped inside the open dialog
    this.nameInput        = page.getByLabel(/nome do produto/i)
    this.descriptionInput = page.getByLabel(/descrição/i)
    this.priceInput       = page.locator('#price')
    this.sizeInput        = page.getByLabel(/tamanho/i)
    this.categorySelect   = page.locator('#categoryId')
    this.imageFileInput   = page.locator('input[type="file"]')
    this.saveButton       = page.getByRole('button', { name: /criar produto|salvar alterações/i })
    this.cancelButton     = page.getByRole('button', { name: /cancelar/i })

    this.deleteConfirmButton = page.getByRole('button', { name: /excluir produto/i })
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.adminProducts)
    await waitForSkeletonToDisappear(this.page)
  }

  // ─── Modal control ──────────────────────────────────────────────────────────

  async openCreateModal(): Promise<void> {
    await this.newProductButton.click()
    await expect(this.page.getByRole('dialog')).toBeVisible()
  }

  async openEditModalForProduct(productName: string): Promise<void> {
    const row = this.page.locator('tr').filter({ hasText: productName })
    await row.getByRole('button', { name: /editar/i }).click()
    await expect(this.page.getByRole('dialog')).toBeVisible()
  }

  async closeModal(): Promise<void> {
    await this.cancelButton.click()
    await expect(this.page.getByRole('dialog')).toBeHidden({ timeout: 3_000 })
  }

  // ─── Form filling ────────────────────────────────────────────────────────────

  async fillProductForm(data: {
    name?:        string
    description?: string
    price?:       string | number
    size?:        string
    categoryId?:  string
  }): Promise<void> {
    if (data.name !== undefined) {
      await this.nameInput.clear()
      await this.nameInput.fill(data.name)
    }
    if (data.description !== undefined) {
      await this.descriptionInput.clear()
      await this.descriptionInput.fill(data.description)
    }
    if (data.price !== undefined) {
      await this.priceInput.fill(String(data.price))
      await this.priceInput.dispatchEvent('change')
    }
    if (data.size !== undefined) {
      await this.sizeInput.clear()
      await this.sizeInput.fill(data.size)
    }
    if (data.categoryId !== undefined) {
      await this.categorySelect.selectOption(data.categoryId)
    }
  }

  async uploadImage(filePath: string): Promise<void> {
    await this.imageFileInput.setInputFiles(filePath)
    // Wait for the preview to appear indicating the file was accepted
    await this.page.locator('img[alt]').last().waitFor({ timeout: 5_000 })
  }

  async submitForm(): Promise<void> {
    await this.saveButton.click()
  }

  // ─── Table ──────────────────────────────────────────────────────────────────

  async waitForProductInTable(productName: string): Promise<void> {
    await expect(
      this.page.locator('table').getByText(productName, { exact: false })
    ).toBeVisible({ timeout: TIMEOUTS.api })
  }

  async expectProductNotInTable(productName: string): Promise<void> {
    await expect(
      this.page.locator('table').getByText(productName, { exact: false })
    ).toBeHidden({ timeout: TIMEOUTS.api })
  }

  async getProductRow(productName: string): Promise<Locator> {
    return this.page.locator('tr').filter({ hasText: productName })
  }

  async filterBySearch(term: string): Promise<void> {
    await this.searchInput.fill(term)
    // debounce settle
    await this.page.waitForTimeout(300)
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  async deleteProduct(productName: string): Promise<void> {
    const row = this.page.locator('tr').filter({ hasText: productName })
    await row.getByRole('button', { name: /excluir/i }).click()

    // Confirm in dialog
    await expect(this.page.getByRole('dialog')).toBeVisible()
    await this.deleteConfirmButton.click()
  }
}
