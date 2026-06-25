/**
 * Static test data used across E2E tests.
 *
 * Credentials must match a real admin user in the test database.
 * Override via environment variables for different environments.
 */

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const ADMIN_CREDENTIALS = {
  email:    process.env.TEST_ADMIN_EMAIL    ?? 'admin@aldeia.com',
  password: process.env.TEST_ADMIN_PASSWORD ?? 'Admin@123',
} as const

export const INVALID_CREDENTIALS = {
  email:    'naoexiste@aldeia.com',
  password: 'SenhaErrada@999',
} as const

// ─── Category ─────────────────────────────────────────────────────────────────

export const TEST_CATEGORY = {
  name: `E2E Categoria ${Date.now()}`,
} as const

// ─── Products ─────────────────────────────────────────────────────────────────

export const TEST_PRODUCT = {
  name:        `Cesto Artesanal E2E ${Date.now()}`,
  description: 'Produto criado automaticamente por teste E2E. Feito com fibras naturais.',
  price:       '89.90',
  size:        'M',
} as const

export const UPDATED_PRODUCT = {
  name:        `Cesto Artesanal E2E EDITADO ${Date.now()}`,
  description: 'Descrição atualizada pelo teste E2E.',
  price:       '109.90',
  size:        'G',
} as const

// ─── Image fixtures ───────────────────────────────────────────────────────────

/**
 * Minimal 1×1 PNG encoded as base64.
 * Used to create a real test image file on disk.
 */
export const MINIMAL_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

// ─── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = {
  // Public
  home:     '/',
  products: '/produtos',
  culture:  '/cultura',

  // Admin auth
  adminLogin:          '/admin',
  adminRegister:       '/admin/cadastro',
  adminForgotPassword: '/admin/recuperar-senha',

  // Admin protected
  adminDashboard:  '/admin/dashboard',
  adminProducts:   '/admin/products',
  adminCategories: '/admin/categories',
  adminAnalytics:  '/admin/analytics',
  adminContent:    '/admin/content',
} as const

// ─── Timeouts ─────────────────────────────────────────────────────────────────

export const TIMEOUTS = {
  /** Wait for a toast notification to appear */
  toast: 5_000,
  /** Wait for API response and UI update */
  api:   10_000,
  /** Wait for navigation to complete */
  navigation: 8_000,
} as const
