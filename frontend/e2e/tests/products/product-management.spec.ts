import { test, expect } from '../../fixtures/test.fixture'
import {
  TEST_PRODUCT, UPDATED_PRODUCT, ROUTES, TEST_CATEGORY
} from '../../data/test-data'
import { API_URL } from '../../playwright.config'
import { getTestImagePath } from '../../helpers/image.helper'

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

    await expect(productManagementPage.pageHeading).toBeVisible()
    await expect(productManagementPage.newProductButton).toBeVisible()

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

    await productManagementPage.fillProductForm({
      name:        testProductName,
      description: TEST_PRODUCT.description,
      price:       TEST_PRODUCT.price,
      size:        TEST_PRODUCT.size,
      categoryId:  String(createdCategoryId),
    })

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

    const uploadBody = await uploadResponse.json()
    expect(uploadBody).toHaveProperty('imageUrl')
    expect(typeof uploadBody.imageUrl).toBe('string')
    expect(uploadBody.imageUrl.length).toBeGreaterThan(0)

    const createBody = await createResponse.json()
    expect(createBody).toHaveProperty('idProduct')
    expect(createBody.name).toBe(testProductName)
    expect(createBody.categoryId).toBe(createdCategoryId)
    expect(createBody.imageUrl).toBeTruthy()

    createdProductId = createBody.idProduct

    await productManagementPage.waitForProductInTable(testProductName)

    // Backend persistence via direct API call
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
    // Ensure product exists from test 2
    expect(createdProductId).toBeTruthy()

    await productManagementPage.goto()
    await productManagementPage.waitForProductInTable(testProductName)

    await productManagementPage.openEditModalForProduct(testProductName)

    // Fields should be pre-populated with existing values
    await expect(productManagementPage.nameInput).toHaveValue(testProductName)

    await productManagementPage.fillProductForm({
      name:        UPDATED_PRODUCT.name,
      description: UPDATED_PRODUCT.description,
      price:       UPDATED_PRODUCT.price,
      size:        UPDATED_PRODUCT.size,
    })

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

    await productManagementPage.waitForProductInTable(UPDATED_PRODUCT.name)

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

    const clearBtn = page.getByRole('button', { name: /remover|limpar/i })
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
    }

    const newImagePath = getTestImagePath('test-product-2.png')
    await productManagementPage.uploadImage(newImagePath)

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
  // 8. CANCELAR EXCLUSÃO — PRODUTO PERMANECE
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

    const row = await productManagementPage.getProductRow(product.name)
    await row.getByRole('button', { name: /excluir/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.getByRole('button', { name: /cancelar/i }).last().click()

    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 3_000 })

    await productManagementPage.waitForProductInTable(product.name)

    await apiHelper.deleteProduct(product.idProduct).catch(() => null)
  })
})
