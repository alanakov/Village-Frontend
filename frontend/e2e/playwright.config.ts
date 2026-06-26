import { defineConfig, devices } from '@playwright/test'
import path from 'path'

/**
 * Playwright E2E Configuration — Village (Aldeia Cultura Viva)
 *
 * Targets:
 *   - Frontend (Vite/React)  → http://localhost:5173
 *   - Backend  (NestJS)      → http://localhost:8080
 *
 * Authenticated state is stored after the auth setup project runs,
 * so product/admin tests never need to re-login.
 */

export const BASE_URL      = process.env.BASE_URL      ?? 'http://localhost:3000'
export const API_URL       = process.env.API_URL        ?? 'http://localhost:8080/api/'
export const UPLOADS_URL   = process.env.UPLOADS_URL    ?? 'http://localhost:8080/uploads'

/** Path where the authenticated browser storage state is saved. */
export const AUTH_STATE_PATH = path.join(__dirname, '.auth', 'admin.json')

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,          // keep sequential — tests share API state
  forbidOnly: !!process.env.CI,
  retries:    process.env.CI ? 2 : 0,
  workers:    process.env.CI ? 1 : 1, // single worker to avoid DB conflicts
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL:         BASE_URL,
    trace:           'on-first-retry',
    screenshot:      'only-on-failure',
    video:           'on-first-retry',
    actionTimeout:   10_000,
    navigationTimeout: 15_000,
    locale:          'pt-BR',
    timezoneId:      'America/Sao_Paulo',
  },

  projects: [
    // ── 1. Auth setup — runs first, saves browser storage state ──────────
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // ── 2. Authenticated tests (admin) ────────────────────────────────────
    {
      name: 'authenticated',
      testMatch: /\/(auth|products)\/.*\.spec\.ts/,
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STATE_PATH,
      },
    },

    // ── 3. Public (unauthenticated) tests ─────────────────────────────────
    {
      name: 'public',
      testMatch: /\/public\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
