import { Page, expect } from '@playwright/test'
import { TIMEOUTS } from '../data/test-data'

export async function expectToast(
  page:    Page,
  text:    string,
  timeout: number = TIMEOUTS.toast
): Promise<void> {
  await expect(
    page.locator('[data-hot-toast]').getByText(text, { exact: false })
  ).toBeVisible({ timeout })
}

export async function waitForNavigation(
  page:        Page,
  pathSegment: string,
  timeout:     number = TIMEOUTS.navigation
): Promise<void> {
  await page.waitForURL(`**${pathSegment}**`, { timeout })
}

export async function waitForSkeletonToDisappear(
  page:    Page,
  timeout: number = TIMEOUTS.api
): Promise<void> {
  await page.waitForFunction(
    () => document.querySelectorAll('.animate-pulse').length === 0,
    { timeout }
  ).catch(() => null)
}

export async function interceptApiCall(
  page:     Page,
  urlGlob:  string,
  action:   () => Promise<void>
): Promise<{ status: number; body: Record<string, unknown> }> {
  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes(urlGlob)),
    action(),
  ])

  const body = await response.json().catch(() => ({}))
  return { status: response.status(), body }
}
