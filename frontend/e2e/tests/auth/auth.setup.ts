/**
 * auth.setup.ts — Global authentication setup.
 *
 * Runs before any authenticated test project.
 * Performs a real browser login and saves the resulting localStorage
 * (Zustand `aldeia-auth` key) to `.auth/admin.json`.
 *
 * All tests in the `authenticated` project will reuse this state,
 * avoiding the overhead of re-logging in for every test file.
 */

import { test as setup, expect } from '@playwright/test'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { ADMIN_CREDENTIALS, ROUTES, TIMEOUTS } from '../../data/test-data'
import { AUTH_STATE_PATH } from '../../playwright.config'

const AUTH_DIR = join(__dirname, '../..', '.auth')

setup('authenticate as admin', async ({ page }) => {
  // Ensure .auth/ directory exists
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true })
  }

  await page.goto(ROUTES.adminLogin)
  await page.waitForLoadState('networkidle')

  // Fill credentials
  await page.locator('#email').fill(ADMIN_CREDENTIALS.email)
  await page.locator('#password').fill(ADMIN_CREDENTIALS.password)

  // Intercept the login API call to confirm it succeeded
  const [loginResponse] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/auth/login') && res.status() === 201),
    page.getByRole('button', { name: /entrar/i }).click(),
  ])

  const loginBody = await loginResponse.json()
  expect(loginBody).toHaveProperty('token')
  expect(loginBody).toHaveProperty('user')
  expect(loginBody.user.userType).toBe('ADMIN')

  // Wait for redirect to dashboard
  await page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: TIMEOUTS.navigation })

  // Verify authenticated state is set in localStorage
  const storedAuth = await page.evaluate(() =>
    localStorage.getItem('aldeia-auth')
  )
  expect(storedAuth).not.toBeNull()

  const parsed = JSON.parse(storedAuth!)
  expect(parsed.state.token).toBeTruthy()
  expect(parsed.state.user.userType).toBe('ADMIN')

  // Save authenticated browser state
  await page.context().storageState({ path: AUTH_STATE_PATH })

  console.log(`✅ Auth setup complete — state saved to ${AUTH_STATE_PATH}`)
})
