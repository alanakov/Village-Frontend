import { Page, Locator, expect } from '@playwright/test'
import { ROUTES, TIMEOUTS } from '../data/test-data'
import { waitForSkeletonToDisappear } from '../helpers/wait.helper'

export class PublicProductsPage {
  readonly page:         Page
  readonly pageHeading:  Locator
  readonly searchInput:  Locator
  readonly productCards: Locator
  readonly emptyState:   Locator

  constructor(page: Page) {
    this.page         = page
    this.pageHeading  = page.getByRole('heading', { level: 1 })
    this.searchInput  = page.getByLabel('Buscar produtos')
    this.productCards = page.locator('article')
    this.emptyState   = page.getByText(/nenhum produto/i)
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.products)
    await waitForSkeletonToDisappear(this.page)
  }

  async expectProductsLoaded(): Promise<void> {
    await expect(
      this.productCards.first().or(this.emptyState)
    ).toBeVisible({ timeout: TIMEOUTS.api })
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count()
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term)
    await this.page.waitForTimeout(300) // debounce
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear()
    await this.page.waitForTimeout(300)
  }

  async clickCategoryFilter(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).click()
    await this.page.waitForTimeout(200)
  }

  async getProductCard(productName: string): Promise<Locator> {
    return this.page.locator('article').filter({ hasText: productName })
  }

  async expectProductCardVisible(productName: string): Promise<void> {
    await expect(
      this.page.locator('article').filter({ hasText: productName })
    ).toBeVisible({ timeout: TIMEOUTS.api })
  }

  async expectProductCardHasImage(productName: string): Promise<void> {
    const card = this.page.locator('article').filter({ hasText: productName })
    const img  = card.locator('img')
    await expect(img).toBeVisible()
    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
    expect(src).not.toContain('undefined')
  }

  async expectProductCardHasPrice(productName: string): Promise<void> {
    const card = this.page.locator('article').filter({ hasText: productName })
    await expect(card.getByText(/R\$/)).toBeVisible()
  }

  async expectProductCardHasWhatsAppButton(productName: string): Promise<void> {
    const card = this.page.locator('article').filter({ hasText: productName })
    await expect(
      card.getByRole('button', { name: /whatsapp/i })
    ).toBeVisible()
  }

  async expectResultCountText(count: number): Promise<void> {
    await expect(
      this.page.getByText(new RegExp(`${count} produto`))
    ).toBeVisible()
  }
}
