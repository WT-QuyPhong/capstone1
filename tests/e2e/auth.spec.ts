import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

for (const width of [375, 430, 768, 1024, 1440]) {
  for (const route of ['/login', '/register']) {
    test(`${route} is readable and has no overflow at ${width}px`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(route)
      await expect(
        page.getByRole('heading', {
          name: route === '/login' ? 'Welcome back' : 'Create your account',
        }),
      ).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      if (width === 375 || width === 1440) {
        await mkdir('.verification', { recursive: true })
        await page.screenshot({
          path: path.resolve(`.verification/auth-${route.slice(1)}-${width}.png`),
          fullPage: true,
        })
      }
      expect(errors).toEqual([])
    })
  }
}

test('demo login validates, toggles password and remembers no password', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('/api/')) requests.push(request.url())
  })
  await page.goto('/login')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('alert').first()).toBeVisible()
  await page.getByLabel('EMAIL', { exact: true }).fill('creator@example.com')
  await page.getByLabel('PASSWORD', { exact: true }).fill('private-demo-9283')
  await page.getByRole('button', { name: 'Show password', exact: true }).click()
  await expect(page.getByLabel('PASSWORD', { exact: true })).toHaveAttribute('type', 'text')
  await page.getByRole('button', { name: 'Hide password', exact: true }).click()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/dashboard')
  const local = await page.evaluate(() => ({ ...localStorage }))
  expect(JSON.stringify(local)).not.toContain('private-demo-9283')
  expect(JSON.parse(local['contentcraft-demo-session']).email).toBe('creator@example.com')
  expect(requests).toEqual([])
  await page.reload()
  await expect(page.getByRole('button', { name: 'Open account menu' })).toContainText('creator')
})

test('registration checks password confirmation and agreement before opening demo', async ({
  page,
}) => {
  await page.goto('/register')
  await page.getByLabel('FULL NAME', { exact: true }).fill('Demo Creator')
  await page.getByLabel('EMAIL', { exact: true }).fill('new@example.com')
  await page.getByLabel('PASSWORD', { exact: true }).fill('create-demo-8273')
  await page.getByLabel('CONFIRM PASSWORD', { exact: true }).fill('mismatch')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page.getByText('Passwords do not match.', { exact: true })).toBeVisible()
  await expect(
    page.getByText('Please agree to the terms to continue.', { exact: true }),
  ).toBeVisible()
  await page.getByLabel('CONFIRM PASSWORD', { exact: true }).fill('create-demo-8273')
  await page.locator('#terms').check()
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page).toHaveURL('/dashboard')
  expect(
    await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage })),
  ).not.toContain('create-demo-8273')
})

test('Google and password recovery clearly disclose demo behavior', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await expect(page.getByRole('dialog')).toContainText(
    'Password recovery emails require a connected authentication backend',
  )
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Continue with Google' }).click()
  await expect(page.getByRole('dialog')).toContainText('Google OAuth is not connected')
  await page.getByRole('button', { name: 'Explore demo workspace' }).click()
  await expect(page).toHaveURL('/dashboard')
  expect(await page.evaluate(() => localStorage.getItem('contentcraft-demo-session'))).toBeNull()
  expect(await page.evaluate(() => sessionStorage.getItem('contentcraft-demo-session'))).toContain(
    'Demo Creator',
  )
})

test('mobile workspace drawer navigates and account menu exits demo', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Workspace navigation' })
    .getByRole('link', { name: 'Products', exact: true })
    .click()
  await expect(page).toHaveURL('/dashboard/products')
  await expect(page.locator('.dashboard-sidebar')).not.toHaveClass(/is-open/)
  await page.getByRole('button', { name: 'Open account menu' }).click()
  await page.getByRole('button', { name: 'Leave workspace' }).click()
  await expect(page).toHaveURL('/')
})

test('invalid deep links provide a working return path', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to ContentCraft' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Everything you need')
})
