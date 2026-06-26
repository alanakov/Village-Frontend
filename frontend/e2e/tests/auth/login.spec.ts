import { test, expect } from '../../fixtures/test.fixture'
import { ADMIN_CREDENTIALS, INVALID_CREDENTIALS, ROUTES } from '../../data/test-data'

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

    const [loginResponse] = await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes('/auth/login') && res.request().method() === 'POST'
      ),
      loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password),
    ])

    expect(loginResponse.status()).toBe(201)
    const body = await loginResponse.json()
    expect(body).toHaveProperty('token')
    expect(body).toHaveProperty('message', 'Login realizado com sucesso')
    expect(body.user).toMatchObject({
      email:    ADMIN_CREDENTIALS.email,
      userType: 'ADMIN',
    })

    await page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: 8_000 })
    expect(page.url()).toContain(ROUTES.adminDashboard)

    const stored = await page.evaluate(() => localStorage.getItem('aldeia-auth'))
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.token).toBeTruthy()
    expect(parsed.state.user.email).toBe(ADMIN_CREDENTIALS.email)
    expect(parsed.state.user.userType).toBe('ADMIN')

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

    expect([401, 400]).toContain(loginResponse.status())

    await loginPage.expectServerError()
    const errorText = await page.locator('[role="alert"]').textContent()
    expect(errorText?.length).toBeGreaterThan(0)

    await loginPage.expectToBeOnLoginPage()

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

    const apiCalls: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/auth/login')) apiCalls.push(req.url())
    })

    await loginPage.passwordInput.fill(ADMIN_CREDENTIALS.password)
    await loginPage.submitButton.click()

    await expect(
      page.locator('[role="alert"]').filter({ hasText: /email/i })
    ).toBeVisible()

    expect(apiCalls).toHaveLength(0)

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

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')

    await loginPage.togglePasswordVisibility()
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text')

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

test.describe('Login — Estado autenticado', () => {

  test('usuário já autenticado é redirecionado para o dashboard', async ({
    page
  }) => {
    // The authenticated project already has storageState loaded
    await page.goto(ROUTES.adminLogin)
    await page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: 5_000 })
    expect(page.url()).toContain(ROUTES.adminDashboard)
  })

  test('logout limpa o estado de autenticação e redireciona para login', async ({
    page
  }) => {
    await page.goto(ROUTES.adminDashboard)
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /sair/i }).click()

    await page.waitForURL(`**${ROUTES.adminLogin}**`, { timeout: 5_000 })

    const stored = await page.evaluate(() => localStorage.getItem('aldeia-auth'))
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.state?.token ?? null).toBeNull()
    }

    await expect(page.locator('#email')).toBeVisible()
  })

  test('rota protegida sem autenticação redireciona para login', async ({
    page
  }) => {
    await page.goto(ROUTES.adminLogin)
    await page.evaluate(() => localStorage.removeItem('aldeia-auth'))

    // Try to access protected route directly
    await page.goto(ROUTES.adminProducts)
    await page.waitForURL(`**${ROUTES.adminLogin}**`, { timeout: 5_000 })
    expect(page.url()).toContain(ROUTES.adminLogin)
  })
})
