/**
 * Login E2E Tests — AdminLogin component + auth flow.
 *
 * Scenarios:
 *  1. Successful login — API call, token storage, redirect, authenticated state
 *  2. Invalid credentials — error message, stays on login page, no auth stored
 *  3. Empty email field — frontend validation
 *  4. Empty password field — frontend validation
 *  5. Both fields empty — multiple validation errors shown
 *  6. Password visibility toggle
 *  7. Already authenticated — redirect to dashboard
 *  8. Logout — clears state, redirects to login
 */

import { test, expect } from '../../fixtures/test.fixture'
import { ADMIN_CREDENTIALS, INVALID_CREDENTIALS, ROUTES } from '../../data/test-data'

// ── Helper: reset auth state before each test that needs a clean state ──────
async function clearAuth(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => localStorage.removeItem('aldeia-auth'))
  await page.reload()
}

test.describe('Login — Fluxo de autenticação', () => {
  // Override project storageState — these tests need a fresh, unauthenticated browser
  test.use({ storageState: { cookies: [], origins: [] } })

  // ─────────────────────────────────────────────────────────────────────────
  // 1. LOGIN COM SUCESSO
  // ─────────────────────────────────────────────────────────────────────────
  test('login bem-sucedido — chamada de API, token e redirecionamento', async ({
    page, loginPage
  }) => {
    await loginPage.goto()

    // Intercept the API call
    const [loginResponse] = await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes('/auth/login') && res.request().method() === 'POST'
      ),
      loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password),
    ])

    // ── API contract validation ──────────────────────────────────────────
    expect(loginResponse.status()).toBe(201)
    const body = await loginResponse.json()
    expect(body).toHaveProperty('token')
    expect(body).toHaveProperty('message', 'Login realizado com sucesso')
    expect(body.user).toMatchObject({
      email:    ADMIN_CREDENTIALS.email,
      userType: 'ADMIN',
    })

    // ── Redirect validation ───────────────────────────────────────────────
    await page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: 8_000 })
    expect(page.url()).toContain(ROUTES.adminDashboard)

    // ── localStorage persistence ─────────────────────────────────────────
    const stored = await page.evaluate(() => localStorage.getItem('aldeia-auth'))
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.token).toBeTruthy()
    expect(parsed.state.user.email).toBe(ADMIN_CREDENTIALS.email)
    expect(parsed.state.user.userType).toBe('ADMIN')

    // ── Dashboard is rendered (authenticated UI) ──────────────────────────
    await expect(page.getByRole('navigation', { name: /menu administrativo/i })).toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 2. CREDENCIAIS INVÁLIDAS
  // ─────────────────────────────────────────────────────────────────────────
  test('credenciais inválidas — mensagem de erro, permanece no login', async ({
    page, loginPage
  }) => {
    await loginPage.goto()

    const [loginResponse] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/auth/login')),
      loginPage.login(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password),
    ])

    // ── API returns 401 ───────────────────────────────────────────────────
    expect([401, 400]).toContain(loginResponse.status())

    // ── Error message displayed ────────────────────────────────────────────
    await loginPage.expectServerError()
    const errorText = await page.locator('[role="alert"]').textContent()
    expect(errorText?.length).toBeGreaterThan(0)

    // ── Stays on login page ────────────────────────────────────────────────
    await loginPage.expectToBeOnLoginPage()

    // ── No token in storage ────────────────────────────────────────────────
    const stored = await page.evaluate(() => localStorage.getItem('aldeia-auth'))
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.state?.token ?? null).toBeNull()
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 3. E-MAIL VAZIO — VALIDAÇÃO FRONTEND
  // ─────────────────────────────────────────────────────────────────────────
  test('email vazio — exibe erro de validação sem chamar a API', async ({
    page, loginPage
  }) => {
    await loginPage.goto()

    // Track API calls — none should be made for a frontend-validated form
    const apiCalls: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/auth/login')) apiCalls.push(req.url())
    })

    // Submit with empty email
    await loginPage.passwordInput.fill(ADMIN_CREDENTIALS.password)
    await loginPage.submitButton.click()

    // Validation error appears
    await expect(
      page.locator('[role="alert"]').filter({ hasText: /email/i })
    ).toBeVisible()

    // No API call was made
    expect(apiCalls).toHaveLength(0)

    // Still on login page
    await loginPage.expectToBeOnLoginPage()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SENHA VAZIA — VALIDAÇÃO FRONTEND
  // ─────────────────────────────────────────────────────────────────────────
  test('senha vazia — exibe erro de validação sem chamar a API', async ({
    page, loginPage
  }) => {
    await loginPage.goto()

    const apiCalls: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/auth/login')) apiCalls.push(req.url())
    })

    await loginPage.emailInput.fill(ADMIN_CREDENTIALS.email)
    await loginPage.submitButton.click()

    await expect(
      page.locator('[role="alert"]').filter({ hasText: /senha/i })
    ).toBeVisible()

    expect(apiCalls).toHaveLength(0)
    await loginPage.expectToBeOnLoginPage()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 5. AMBOS OS CAMPOS VAZIOS
  // ─────────────────────────────────────────────────────────────────────────
  test('ambos os campos vazios — exibe múltiplos erros de validação', async ({
    page, loginPage
  }) => {
    await loginPage.goto()
    await loginPage.submitButton.click()

    const alerts = page.locator('[role="alert"]')
    await expect(alerts.first()).toBeVisible()

    const count = await alerts.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 6. TOGGLE DE VISIBILIDADE DA SENHA
  // ─────────────────────────────────────────────────────────────────────────
  test('toggle de visibilidade da senha funciona corretamente', async ({
    loginPage
  }) => {
    await loginPage.goto()

    // Initially password is hidden
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')

    // Click to show
    await loginPage.togglePasswordVisibility()
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text')

    // Click to hide again
    await loginPage.togglePasswordVisibility()
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 7. LINK "ESQUECEU A SENHA?"
  // ─────────────────────────────────────────────────────────────────────────
  test('link "esqueceu a senha?" navega para recuperação de senha', async ({
    page, loginPage
  }) => {
    await loginPage.goto()
    await loginPage.forgotPasswordLink.click()
    await page.waitForURL(`**${ROUTES.adminForgotPassword}**`)
    expect(page.url()).toContain(ROUTES.adminForgotPassword)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // 8. LINK "CRIAR CONTA"
  // ─────────────────────────────────────────────────────────────────────────
  test('link "criar conta" navega para página de registro', async ({
    page, loginPage
  }) => {
    await loginPage.goto()
    await loginPage.registerLink.click()
    await page.waitForURL(`**${ROUTES.adminRegister}**`)
    expect(page.url()).toContain(ROUTES.adminRegister)
  })
})

// ── Tests that require authenticated state ────────────────────────────────────
test.describe('Login — Estado autenticado', () => {

  test('usuário já autenticado é redirecionado para o dashboard', async ({
    page
  }) => {
    // The authenticated project already has storageState loaded
    await page.goto(ROUTES.adminLogin)
    // AdminLogin component checks isAuthenticated and redirects
    await page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: 5_000 })
    expect(page.url()).toContain(ROUTES.adminDashboard)
  })

  test('logout limpa o estado de autenticação e redireciona para login', async ({
    page
  }) => {
    await page.goto(ROUTES.adminDashboard)
    await page.waitForLoadState('networkidle')

    // Click the logout button in sidebar
    await page.getByRole('button', { name: /sair/i }).click()

    // Should redirect to login
    await page.waitForURL(`**${ROUTES.adminLogin}**`, { timeout: 5_000 })

    // Token should be cleared from storage
    const stored = await page.evaluate(() => localStorage.getItem('aldeia-auth'))
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.state?.token ?? null).toBeNull()
    }

    // Login form should be visible again
    await expect(page.locator('#email')).toBeVisible()
  })

  test('rota protegida sem autenticação redireciona para login', async ({
    page
  }) => {
    // Clear auth state programmatically
    await page.goto(ROUTES.adminLogin)
    await page.evaluate(() => localStorage.removeItem('aldeia-auth'))

    // Try to access protected route directly
    await page.goto(ROUTES.adminProducts)
    await page.waitForURL(`**${ROUTES.adminLogin}**`, { timeout: 5_000 })
    expect(page.url()).toContain(ROUTES.adminLogin)
  })
})
