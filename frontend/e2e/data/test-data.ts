export const ADMIN_CREDENTIALS = {
  email:    process.env.TEST_ADMIN_EMAIL    ?? 'admin@aldeia.com',
  password: process.env.TEST_ADMIN_PASSWORD ?? 'Admin@123',
} as const

export const INVALID_CREDENTIALS = {
  email:    'naoexiste@aldeia.com',
  password: 'SenhaErrada@999',
} as const

export const TEST_CATEGORY = {
  name: `E2E Categoria ${Date.now()}`,
} as const

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

export const MINIMAL_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

export const ROUTES = {
  home:     '/',
  products: '/produtos',
  culture:  '/cultura',

  adminLogin:          '/admin',
  adminRegister:       '/admin/cadastro',
  adminForgotPassword: '/admin/recuperar-senha',

  adminDashboard:  '/admin/dashboard',
  adminProducts:   '/admin/products',
  adminCategories: '/admin/categories',
  adminAnalytics:  '/admin/analytics',
  adminContent:    '/admin/content',
} as const

export const TIMEOUTS = {
  toast: 5_000,
  api:   10_000,
  navigation: 8_000,
} as const
