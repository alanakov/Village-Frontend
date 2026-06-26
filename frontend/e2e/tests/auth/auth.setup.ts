import { test as setup, expect } from '@playwright/test'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { ADMIN_CREDENTIALS, ROUTES, TIMEOUTS } from '../../data/test-data'
import { AUTH_STATE_PATH } from '../../playwright.config'

const AUTH_DIR = join(__dirname, '../..', '.auth')

setup('authenticate as admin', async ({ page }) => {
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true })
  }

  await page.goto(ROUTES.adminLogin)
  await page.waitForLoadState('networkidle')

  await page.locator('#email').fill(ADMIN_CREDENTIALS.email)
  await page.locator('#password').fill(ADMIN_CREDENTIALS.password)

  const [loginResponse] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/auth/login') && res.status() === 201),
    page.getByRole('button', { name: /entrar/i }).click(),
  ])

  const loginBody = await loginResponse.json()
  expect(loginBody).toHaveProperty('token')
  expect(loginBody).toHaveProperty('user')
  expect(loginBody.user.userType).toBe('ADMIN')

  await page.waitForURL(`**${ROUTES.adminDashboard}**`, { timeout: TIMEOUTS.navigation })

  const storedAuth = await page.evaluate(() =>
    localStorage.getItem('aldeia-auth')
  )
  expect(storedAuth).not.toBeNull()

  const parsed = JSON.parse(storedAuth!)
  expect(parsed.state.token).toBeTruthy()
  expect(parsed.state.user.userType).toBe('ADMIN')

  await page.context().storageState({ path: AUTH_STATE_PATH })
})
