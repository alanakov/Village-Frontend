import { Page, expect } from '@playwright/test'
import { TIMEOUTS } from '../data/test-data'

/**
 * Waits for a react-hot-toast notification to appear and asserts its content.
 * The toast container is rendered at document root — not inside the page's main content.
 */
export async function expectToast(
  page:    Page,
  text:    string,
  timeout: number = TIMEOUTS.toast
): Promise<void> {
  // react-hot-toast wraps messages in <div> inside a portal at body level
  await expect(
    page.locator('[data-hot-toast]').getByText(text, { exact: false })
  ).toBeVisible({ timeout })
}

/**
 * Waits for the page to fully finish navigating by checking that the URL
 * includes the expected path segment.
 */
export async function waitForNavigation(
  page:        Page,
  pathSegment: string,
  timeout:     number = TIMEOUTS.navigation
): Promise<void> {
  await page.waitForURL(`**${pathSegment}**`, { timeout })
}

/**
 * Waits for a skeleton loader to disappear, indicating that
 * the data-fetching phase has completed.
 */
export async function waitForSkeletonToDisappear(
  page:    Page,
  timeout: number = TIMEOUTS.api
): Promise<void> {
  // Wait until no skeleton elements remain — avoids race between count() and waitFor()
  await page.waitForFunction(
    () => document.querySelectorAll('.animate-pulse').length === 0,
    { timeout }
  ).catch(() => null) // if no skeleton ever appears, continue silently
}

/**
 * Waits for a network request to the API and returns the response.
 * Useful for asserting that the correct endpoint was called.
 */
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
