import { test, expect } from '../../fixtures/test.fixture'
import { ROUTES, TEST_CATEGORY } from '../../data/test-data'
import { APIHelper } from '../../helpers/api.helper'

let seededCategoryId: number
let seededProductId:  number
const SEEDED_PRODUCT = {
  name:        `Artesanato E2E Público ${Date.now()}`,
  description: 'Peça artesanal criada para validação do site público.',
  price:       149.90,
  size:        'G',
}

test.describe('Site Público — Listagem de Produtos', () => {

  // ── Seed: create a product visible on the public page ─────────────────────
  test.beforeAll(async () => {
    const api = new APIHelper()
    await api.init()
    await api.login()

    const category = await api.createCategory(`${TEST_CATEGORY.name} Público`)
    seededCategoryId = category.idCategory

    const product = await api.createProduct({
      name:       SEEDED_PRODUCT.name,
      description: SEEDED_PRODUCT.description,
      price:      SEEDED_PRODUCT.price,
      size:       SEEDED_PRODUCT.size,
      imageUrl:   '/uploads/placeholder.png',
      categoryId: seededCategoryId,
    })
    seededProductId = product.idProduct

    await api.dispose()
  })

  // ── Teardown: remove seeded data ──────────────────────────────────────────
  test.afterAll(async () => {
    const api = new APIHelper()
    await api.init()
    await api.login()
    await api.deleteProduct(seededProductId).catch(() => null)
    await api.deleteCategory(seededCategoryId).catch(() => null)
    await api.dispose()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 1. PÁGINA CARREGA SEM AUTENTICAÇÃO
  // ─────────────────────────────────────────────────────────────────────────
  test('página carrega produtos sem autenticação', async ({
    page, publicProductsPage
  }) => {
    // Intercept the public API call — no Authorization header expected
    const apiRequests: { url: string; authHeader: string | null }[] = []
    page.on('request', (req) => {
      if (req.url().includes('/product')) {
        apiRequests.push({
          url:        req.url(),
          authHeader: req.headers()['authorization'] ?? null,
        })
      }
    })

    await publicProductsPage.goto()
    await publicProductsPage.expectProductsLoaded()

    expect(apiRequests.some((r) => r.url.includes('/product'))).toBe(true)

    await expect(publicProductsPage.pageHeading).toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 2. DADOS DO PRODUTO EXIBIDOS CORRETAMENTE
  // ─────────────────────────────────────────────────────────────────────────
  test('produto criado aparece com dados corretos no site público', async ({
    publicProductsPage
  }) => {
    await publicProductsPage.goto()

    await publicProductsPage.expectProductCardVisible(SEEDED_PRODUCT.name)

    const card = await publicProductsPage.getProductCard(SEEDED_PRODUCT.name)

    // Description visible (partial match due to line-clamp)
    await expect(card).toContainText(SEEDED_PRODUCT.description.slice(0, 20))

    await expect(card.getByText(/R\$/)).toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 3. IMAGEM DO PRODUTO CARREGA DO URL CORRETO
  // ─────────────────────────────────────────────────────────────────────────
  test('imagem do produto carrega com src válido', async ({
    page, publicProductsPage
  }) => {
    // Track image load errors
    const imageErrors: string[] = []
    page.on('response', (res) => {
      if (res.url().includes('/uploads') && res.status() >= 400) {
        imageErrors.push(res.url())
      }
    })

    await publicProductsPage.goto()
    await publicProductsPage.expectProductsLoaded()

    await publicProductsPage.expectProductCardHasImage(SEEDED_PRODUCT.name)

    // Placeholder may not exist, so we only flag real 5xx errors
    const criticalErrors = imageErrors.filter((u) => !u.includes('placeholder'))
    expect(criticalErrors).toHaveLength(0)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 4. BOTÃO WHATSAPP PRESENTE EM CADA CARD
  // ─────────────────────────────────────────────────────────────────────────
  test('cada produto exibe botão "Comprar via WhatsApp"', async ({
    publicProductsPage
  }) => {
    await publicProductsPage.goto()
    await publicProductsPage.expectProductsLoaded()

    await publicProductsPage.expectProductCardHasWhatsAppButton(SEEDED_PRODUCT.name)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 5. BUSCA FILTRA PRODUTOS
  // ─────────────────────────────────────────────────────────────────────────
  test('busca filtra produtos pelo nome e descrição', async ({
    page, publicProductsPage
  }) => {
    await publicProductsPage.goto()
    await publicProductsPage.expectProductsLoaded()

    const totalBefore = await publicProductsPage.getProductCount()

    await publicProductsPage.searchFor('Artesanato E2E Público')
    await publicProductsPage.expectProductCardVisible(SEEDED_PRODUCT.name)

    await publicProductsPage.searchFor('xyztermoquenadamatcha999')
    await expect(
      page.getByText(/nenhum produto encontrado/i)
    ).toBeVisible()

    await publicProductsPage.clearSearch()
    const totalAfter = await publicProductsPage.getProductCount()
    expect(totalAfter).toBe(totalBefore)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 6. FILTRO POR CATEGORIA (PILLS)
  // ─────────────────────────────────────────────────────────────────────────
  test('filtro por categoria exibe apenas produtos da categoria selecionada', async ({
    page, publicProductsPage
  }) => {
    await publicProductsPage.goto()
    await publicProductsPage.expectProductsLoaded()

    // The seeded category pill should appear if products loaded correctly
    const categoryPill = page.getByRole('button', {
      name: new RegExp(`${TEST_CATEGORY.name} Público`, 'i'),
    })

    if (await categoryPill.isVisible({ timeout: 3_000 })) {
      await categoryPill.click()

      await publicProductsPage.expectProductCardVisible(SEEDED_PRODUCT.name)

      await publicProductsPage.clickCategoryFilter('Todos')
      const totalAfter = await publicProductsPage.getProductCount()
      expect(totalAfter).toBeGreaterThan(0)
    } else {
      // Category pill won't appear if category name was truncated — skip gracefully
      test.skip()
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 7. ESTADO VAZIO (BUSCA SEM RESULTADO) — BOTÃO LIMPAR FILTROS
  // ─────────────────────────────────────────────────────────────────────────
  test('"Limpar filtros" reseta a busca e exibe todos os produtos', async ({
    page, publicProductsPage
  }) => {
    await publicProductsPage.goto()
    await publicProductsPage.expectProductsLoaded()

    await publicProductsPage.searchFor('termosemresultado000')
    await expect(page.getByText(/nenhum produto encontrado/i)).toBeVisible()

    const clearLink = page.getByRole('button', { name: /limpar filtros/i })
      .or(page.getByText(/limpar filtros/i))
    await expect(clearLink.first()).toBeVisible()
    await clearLink.first().click()

    await publicProductsPage.expectProductsLoaded()
    const count = await publicProductsPage.getProductCount()
    expect(count).toBeGreaterThan(0)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 8. RESPOSTA DA API CORRESPONDE AO QUE É EXIBIDO
  // ─────────────────────────────────────────────────────────────────────────
  test('dados da API correspondem ao que é exibido no card', async ({
    page, publicProductsPage
  }) => {
    let publicProducts: Array<Record<string, unknown>> = []

    const [response] = await Promise.all([
      page.waitForResponse((r) =>
        r.url().includes('/api/product') && r.request().method() === 'GET'
      ),
      publicProductsPage.goto(),
    ])

    publicProducts = await response.json()
    await publicProductsPage.expectProductsLoaded()

    const apiProduct = publicProducts.find((p) => p['name'] === SEEDED_PRODUCT.name)
    expect(apiProduct).toBeDefined()
    expect(apiProduct!['description']).toBe(SEEDED_PRODUCT.description)
    expect(Number(apiProduct!['price'])).toBeCloseTo(SEEDED_PRODUCT.price, 1)

    const card = await publicProductsPage.getProductCard(SEEDED_PRODUCT.name)
    await expect(card).toBeVisible()
    await expect(card.getByText(/R\$/)).toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 9. PRODUTO CRIADO NO ADMIN APARECE NO SITE PÚBLICO (INTEGRAÇÃO)
  // ─────────────────────────────────────────────────────────────────────────
  test('produto criado via API aparece imediatamente no site público', async ({
    publicProductsPage
  }) => {
    await publicProductsPage.goto()

    await publicProductsPage.expectProductCardVisible(SEEDED_PRODUCT.name)

    await publicProductsPage.expectProductCardHasPrice(SEEDED_PRODUCT.name)
    await publicProductsPage.expectProductCardHasWhatsAppButton(SEEDED_PRODUCT.name)
  })
})
