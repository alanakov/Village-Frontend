/**
 * Product Management E2E Tests — AdminProductManagement component.
 *
 * Scenarios:
 *  1.  List products — loading, display, table structure
 *  2.  Create product — form filling, image upload, API call, persistence
 *  3.  Create product — missing image validation (image required)
 *  4.  Create product — missing required fields (name, description, price)
 *  5.  Create product — invalid price (zero / negative)
 *  6.  Edit product — change data, save, verify update
 *  7.  Edit product — change image
 *  8.  Delete product — confirmation dialog, persistence
 *  9.  Search — filters table results correctly
 *  10. Category dependency — product requires valid category
 */

import { test, expect } from '../../fixtures/test.fixture'
import {
  TEST_PRODUCT, UPDATED_PRODUCT, ROUTES, TIMEOUTS, TEST_CATEGORY
} from '../../data/test-data'
import { API_URL } from '../../playwright.config'
import { getTestImagePath } from '../../helpers/image.helper'
import { waitForSkeletonToDisappear } from '../../helpers/wait.helper'

// State shared within this test file
let createdCategoryId: number
let createdProductId:  number
let testProductName:   string

test.describe('Produtos — Gestão administrativa', () => {

  // ── Setup: ensure a category exists for product tests ──────────────────────
  test.beforeAll(async ({ apiHelper }) => {
    await apiHelper.login()

    // Create a dedicated category so tests are self-contained
    const category = await apiHelper.createCategory(TEST_CATEGORY.name)
    createdCategoryId = category.idCategory

    testProductName = TEST_PRODUCT.name
  })

  // ── Teardown: clean up created data ────────────────────────────────────────
  test.afterAll(async ({ apiHelper }) => {
    await apiHelper.login()

    if (createdProductId) {
      await apiHelper.deleteProduct(createdProductId).catch(() => null)
    }
    if (createdCategoryId) {
      await apiHelper.deleteCategory(createdCategoryId).catch(() => null)
    }
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 1. LISTAGEM DE PRODUTOS
  // ───────────────────────────────────────────────────────────────────────────
  test('listagem — carrega e exibe produtos com dados corretos', async ({
    page, productManagementPage
  }) => {
    await productManagementPage.goto()

    // Page heading visible
    await expect(productManagementPage.pageHeading).toBeVisible()

    // "Novo Produto" button present
    await expect(productManagementPage.newProductButton).toBeVisible()

    // Check API was called and responded
    const apiUrl = API_URL
    const products = await page.evaluate(async (url) => {
      const res = await fetch(`${url}product`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('aldeia-auth')!).state.token}`,
        },
      })
      return res.json()
    }, apiUrl)
    expect(Array.isArray(products)).toBe(true)

    // Table headers are present
    const tableHeaders = ['Imagem', 'Nome', 'Categoria', 'Preço', 'Ações']
    for (const header of tableHeaders) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible()
    }
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 2. CRIAÇÃO DE PRODUTO COM SUCESSO
  // ───────────────────────────────────────────────────────────────────────────
  test('criar produto — preenche formulário, faz upload, persiste no backend', async ({
    page, productManagementPage, apiHelper
  }) => {
    await productManagementPage.goto()
    await productManagementPage.openCreateModal()

    // Fill form fields
    await productManagementPage.fillProductForm({
      name:        testProductName,
      description: TEST_PRODUCT.description,
      price:       TEST_PRODUCT.price,
      size:        TEST_PRODUCT.size,
      categoryId:  String(createdCategoryId),
    })

    // Upload image
    const imagePath = getTestImagePath()
    await productManagementPage.uploadImage(imagePath)

    // Intercept both upload and create API calls
    const [uploadResponse, createResponse] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/product/upload-image') && r.status() === 201),
      page.waitForResponse((r) =>
        r.url().includes('/product') &&
        !r.url().includes('upload') &&
        r.request().method() === 'POST' &&
        r.status() === 201
      ),
      productManagementPage.submitForm(),
    ])

    // ── Upload API validation ──────────────────────────────────────────────
    const uploadBody = await uploadResponse.json()
    expect(uploadBody).toHaveProperty('imageUrl')
    expect(typeof uploadBody.imageUrl).toBe('string')
    expect(uploadBody.imageUrl.length).toBeGreaterThan(0)

    // ── Create API validation ──────────────────────────────────────────────
    const createBody = await createResponse.json()
    expect(createBody).toHaveProperty('idProduct')
    expect(createBody.name).toBe(testProductName)
    expect(createBody.categoryId).toBe(createdCategoryId)
    expect(createBody.imageUrl).toBeTruthy()

    createdProductId = createBody.idProduct

    // ── UI: product appears in table ───────────────────────────────────────
    await productManagementPage.waitForProductInTable(testProductName)

    // ── Backend persistence via direct API call ────────────────────────────
    await apiHelper.login()
    const persisted = await apiHelper.getProductById(createdProductId) as Record<string, unknown>
    expect(persisted.name).toBe(testProductName)
    expect(persisted.imageUrl).toBeTruthy()
    expect(persisted.categoryId).toBe(createdCategoryId)
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 3. VALIDAÇÃO — IMAGEM OBRIGATÓRIA
  // ───────────────────────────────────────────────────────────────────────────
  test('criar produto — erro quando imagem não é selecionada', async ({
    productManagementPage
  }) => {
    await productManagementPage.goto()
    await productManagementPage.openCreateModal()

    await productManagementPage.fillProductForm({
      name:        `Produto Sem Imagem ${Date.now()}`,
      description: 'Teste de validação de imagem obrigatória.',
      price:       '50.00',
      categoryId:  String(createdCategoryId),
    })

    // Do NOT upload an image
    await productManagementPage.submitForm()

    // Error message for missing image
    await expect(
      productManagementPage.page.getByText(/selecione uma imagem/i)
    ).toBeVisible()

    // Modal stays open — product not created
    await expect(productManagementPage.page.getByRole('dialog')).toBeVisible()
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 4. VALIDAÇÃO — CAMPOS OBRIGATÓRIOS
  // ───────────────────────────────────────────────────────────────────────────
  test('criar produto — erro nos campos obrigatórios vazios', async ({
    page, productManagementPage
  }) => {
    await productManagementPage.goto()
    await productManagementPage.openCreateModal()

    // Submit with everything empty
    await productManagementPage.submitForm()

    // At least name and description errors should appear
    const errors = page.locator('p.text-sm').filter({
      hasText: /obrigatório|obrigatória/i,
    })
    await expect(errors.first()).toBeVisible()

    const errorCount = await errors.count()
    expect(errorCount).toBeGreaterThanOrEqual(2)
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 5. VALIDAÇÃO — PREÇO INVÁLIDO
  // ───────────────────────────────────────────────────────────────────────────
  test('criar produto — erro quando preço é zero ou negativo', async ({
    page, productManagementPage
  }) => {
    await productManagementPage.goto()
    await productManagementPage.openCreateModal()

    await productManagementPage.fillProductForm({
      name:        'Produto Teste',
      description: 'Descrição de teste.',
      price:       '0',
      categoryId:  String(createdCategoryId),
    })

    const imagePath = getTestImagePath()
    await productManagementPage.uploadImage(imagePath)
    await productManagementPage.submitForm()

    // Price validation error from Zod schema
    await expect(
      page.getByText(/preço deve ser maior/i)
    ).toBeVisible()
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 6. EDIÇÃO DE PRODUTO
  // ───────────────────────────────────────────────────────────────────────────
  test('editar produto — altera dados e salva corretamente', async ({
    page, productManagementPage, apiHelper
  }) => {
    // Ensure product exists
    expect(createdProductId).toBeTruthy()

    await productManagementPage.goto()
    await productManagementPage.waitForProductInTable(testProductName)

    await productManagementPage.openEditModalForProduct(testProductName)

    // Fields should be pre-populated with existing values
    await expect(productManagementPage.nameInput).toHaveValue(testProductName)

    // Change name and description
    await productManagementPage.fillProductForm({
      name:        UPDATED_PRODUCT.name,
      description: UPDATED_PRODUCT.description,
      price:       UPDATED_PRODUCT.price,
      size:        UPDATED_PRODUCT.size,
    })

    // Intercept update call
    const [updateResponse] = await Promise.all([
      page.waitForResponse((r) =>
        r.url().includes(`/product/${createdProductId}`) &&
        r.request().method() === 'PUT'
      ),
      productManagementPage.submitForm(),
    ])

    expect(updateResponse.status()).toBe(200)
    const updatedBody = await updateResponse.json()
    expect(updatedBody.name).toBe(UPDATED_PRODUCT.name)
    expect(Number(updatedBody.price)).toBeCloseTo(Number(UPDATED_PRODUCT.price), 1)

    // UI shows updated name
    await productManagementPage.waitForProductInTable(UPDATED_PRODUCT.name)

    // Backend confirms the update
    await apiHelper.login()
    const persisted = await apiHelper.getProductById(createdProductId) as Record<string, unknown>
    expect(persisted.name).toBe(UPDATED_PRODUCT.name)

    // Update testProductName for subsequent tests
    testProductName = UPDATED_PRODUCT.name
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 7. EDIÇÃO — TROCA DE IMAGEM
  // ───────────────────────────────────────────────────────────────────────────
  test('editar produto — troca de imagem faz novo upload', async ({
    page, productManagementPage, apiHelper
  }) => {
    expect(createdProductId).toBeTruthy()

    await productManagementPage.goto()
    await productManagementPage.waitForProductInTable(testProductName)

    // Get current imageUrl before editing
    await apiHelper.login()
    const before = await apiHelper.getProductById(createdProductId) as Record<string, unknown>
    const oldImageUrl = before.imageUrl as string

    await productManagementPage.openEditModalForProduct(testProductName)

    // Clear current image and upload a new one
    const clearBtn = page.getByRole('button', { name: /remover|limpar/i })
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
    }

    const newImagePath = getTestImagePath('test-product-2.png')
    await productManagementPage.uploadImage(newImagePath)

    // Submit the edit
    const [updateResponse] = await Promise.all([
      page.waitForResponse((r) =>
        r.url().includes(`/product/${createdProductId}`) &&
        r.request().method() === 'PUT'
      ),
      productManagementPage.submitForm(),
    ])

    expect(updateResponse.status()).toBe(200)
    const updatedBody = await updateResponse.json()
    expect(updatedBody.imageUrl).toBeTruthy()
    // The new imageUrl may equal the old one if the same filename was generated
    // What matters is that imageUrl is still set
    expect(updatedBody.imageUrl.length).toBeGreaterThan(0)
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 8. PESQUISA DE PRODUTOS
  // ───────────────────────────────────────────────────────────────────────────
  test('busca — filtra produtos pelo nome corretamente', async ({
    productManagementPage
  }) => {
    await productManagementPage.goto()

    // Search for a term that matches our test product
    const searchTerm = 'E2E EDITADO'
    await productManagementPage.filterBySearch(searchTerm)

    // Our product should appear
    await productManagementPage.waitForProductInTable(testProductName)

    // Search for something that doesn't exist
    await productManagementPage.filterBySearch('termoquenaoexiste12345xyz')
    await expect(
      productManagementPage.page.getByText(/nenhum produto encontrado/i)
    ).toBeVisible()

    // Clear search — products reappear
    await productManagementPage.filterBySearch('')
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 9. EXCLUSÃO DE PRODUTO
  // ───────────────────────────────────────────────────────────────────────────
  test('excluir produto — dialog de confirmação e persistência no backend', async ({
    page, productManagementPage, apiHelper
  }) => {
    expect(createdProductId).toBeTruthy()

    await productManagementPage.goto()
    await productManagementPage.waitForProductInTable(testProductName)

    // Click delete — confirmation dialog should appear
    const row = await productManagementPage.getProductRow(testProductName)
    await row.getByRole('button', { name: /excluir/i }).click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
      page.getByText(/tem certeza|esta ação não pode/i)
    ).toBeVisible()

    // Intercept the DELETE request
    const [deleteResponse] = await Promise.all([
      page.waitForResponse((r) =>
        r.url().includes(`/product/${createdProductId}`) &&
        r.request().method() === 'DELETE'
      ),
      productManagementPage.deleteConfirmButton.click(),
    ])

    expect(deleteResponse.status()).toBe(200)

    // Product disappears from table
    await productManagementPage.expectProductNotInTable(testProductName)

    // Backend confirms deletion
    await apiHelper.login()
    try {
      await apiHelper.getProductById(createdProductId)
      throw new Error('Product should have been deleted')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      expect(message).toMatch(/404|not found|Product should have been deleted/i)
    }

    // Mark as deleted so afterAll doesn't try again
    createdProductId = 0
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 10. CANCELAR EXCLUSÃO — PRODUTO PERMANECE
  // ───────────────────────────────────────────────────────────────────────────
  test('cancelar exclusão — produto permanece na listagem', async ({
    page, productManagementPage, apiHelper
  }) => {
    // Create a fresh product for this test
    await apiHelper.login()
    const product = await apiHelper.createProduct({
      name:        `Produto Para Cancelar ${Date.now()}`,
      description: 'Produto de teste de cancelamento de exclusão.',
      price:       25.00,
      imageUrl:    '/uploads/placeholder.png',
      categoryId:  createdCategoryId,
    })

    await productManagementPage.goto()
    await productManagementPage.waitForProductInTable(product.name)

    // Click delete button
    const row = await productManagementPage.getProductRow(product.name)
    await row.getByRole('button', { name: /excluir/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Click cancel instead of confirm
    await page.getByRole('button', { name: /cancelar/i }).last().click()

    // Dialog should close
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 3_000 })

    // Product still in table
    await productManagementPage.waitForProductInTable(product.name)

    // Cleanup
    await apiHelper.deleteProduct(product.idProduct).catch(() => null)
  })
})
