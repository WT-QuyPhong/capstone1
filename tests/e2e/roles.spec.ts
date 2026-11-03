import { expect, test, type Page } from '@playwright/test'

async function login(page: Page, role: 'user' | 'manager' | 'administrator') {
  await page.goto(`/login/${role}`)
  await page.getByLabel('EMAIL', { exact: true }).fill(`${role}@example.com`)
  await page.getByLabel('PASSWORD', { exact: true }).fill('demo-password-123')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/dashboard')
}

test('unauthenticated dashboard visits require sign-in', async ({ page }) => {
  await page.goto('/dashboard/admin')
  await expect(page).toHaveURL(/\/login\?next=/)
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Administration', exact: true })).toHaveCount(0)
})

for (const role of ['user', 'manager', 'administrator'] as const) {
  test(`${role} gets only its permitted navigation and direct routes`, async ({ page }) => {
    await login(page, role)
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      await page.screenshot({ path: `.verification/role-${role}-${width}.png`, fullPage: true })
    }
    const nav = page.getByRole('navigation', { name: 'Workspace navigation' })
    await expect(nav.getByRole('link', { name: 'AI Content Studio', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Admin', exact: true })).toHaveCount(
      role === 'administrator' ? 1 : 0,
    )
    await expect(nav.getByRole('link', { name: 'Products', exact: true })).toHaveCount(
      role === 'user' ? 0 : 1,
    )
    await expect(nav.getByRole('link', { name: 'Analytics', exact: true })).toHaveCount(
      role === 'user' ? 0 : 1,
    )
    if (role === 'user') {
      for (const path of ['products', 'brands', 'audiences', 'analytics', 'admin']) {
        await page.goto(`/dashboard/${path}`)
        await expect(page.getByRole('heading', { name: 'Access restricted' })).toBeVisible()
      }
    } else if (role === 'manager') {
      await page.goto('/dashboard/admin')
      await expect(page.getByRole('heading', { name: 'Access restricted' })).toBeVisible()
    } else {
      await nav.getByRole('link', { name: 'Admin', exact: true }).click()
      await expect(page.getByRole('heading', { name: 'Administration', exact: true })).toBeVisible()
    }
  })
}

test('a User submits a draft and a Manager reviews it in the same demo workspace', async ({
  page,
}) => {
  await login(page, 'user')
  await page.goto('/dashboard/content-studio')
  await expect(page.getByRole('button', { name: 'Approve version', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Edit draft', exact: true }).click()
  const body = 'Role workflow regression: a creator submits this campaign for review.'
  await page.getByLabel('Edit generated content').fill(body)
  await page.getByRole('button', { name: 'Submit for review', exact: true }).click()
  await page.goto('/dashboard/history?status=review')
  await page.getByRole('searchbox').fill('Role workflow regression')
  await expect(page.locator('.studio-history-row')).toContainText('In review')
  await page.locator('.studio-history-open').click()
  await expect(page.getByLabel('Approval status')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Open account menu' }).click()
  await page.getByRole('button', { name: 'Switch role', exact: true }).click()
  expect(await page.evaluate(() => localStorage.getItem('contentcraft-demo-session'))).toBeNull()
  await login(page, 'manager')
  await page.getByRole('button', { name: 'Review queue', exact: true }).click()
  await expect(page).toHaveURL('/dashboard/history?status=review')
  await page.getByRole('searchbox').fill('Role workflow regression')
  await page.locator('.studio-history-open').click()
  await page.getByLabel('Approval status').selectOption('Approved')
  await page.getByRole('button', { name: 'Save status', exact: true }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /^Approved \(/ }).click()
  await expect(page.locator('.studio-history-row')).toContainText('Approved')
  await login(page, 'user')
  await page.goto('/dashboard/history')
  await page.getByRole('searchbox').fill('Role workflow regression')
  await expect(page.locator('.studio-history-row')).toContainText('Approved')
  await expect(page.locator('.studio-history-row .studio-delete-button')).toHaveCount(0)
})

test('invalid stored role is rejected, legacy sessions become User', async ({ page }) => {
  await page.goto('/login')
  await page.evaluate(() =>
    localStorage.setItem(
      'contentcraft-demo-session',
      JSON.stringify({ name: 'Old', email: 'old@example.com', role: 'root' }),
    ),
  )
  await page.goto('/dashboard/admin')
  await expect(page).toHaveURL(/\/login\?next=/)
  await page.evaluate(() =>
    localStorage.setItem(
      'contentcraft-demo-session',
      JSON.stringify({ name: 'Old', email: 'old@example.com' }),
    ),
  )
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Creator dashboard' })).toBeVisible()
  await page.goto('/dashboard/admin')
  await expect(page.getByRole('heading', { name: 'Access restricted' })).toBeVisible()
})
