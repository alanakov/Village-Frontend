import { test as base, expect } from '@playwright/test'
import { LoginPage }              from '../pages/LoginPage'
import { ProductManagementPage }  from '../pages/ProductManagementPage'
import { PublicProductsPage }     from '../pages/PublicProductsPage'
import { APIHelper }              from '../helpers/api.helper'

/**
 * Extended test fixture that provides pre-instantiated page objects
 * and a ready-to-use API helper for every test.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/test.fixture'
 */
type VillageFixtures = {
  loginPage:             LoginPage
  productManagementPage: ProductManagementPage
  publicProductsPage:    PublicProductsPage
  apiHelper:             APIHelper
}

export const test = base.extend<VillageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  productManagementPage: async ({ page }, use) => {
    await use(new ProductManagementPage(page))
  },

  publicProductsPage: async ({ page }, use) => {
    await use(new PublicProductsPage(page))
  },

  apiHelper: async ({}, use) => {
    const helper = new APIHelper()
    await helper.init()
    await use(helper)
    await helper.dispose()
  },
})

export { expect }
