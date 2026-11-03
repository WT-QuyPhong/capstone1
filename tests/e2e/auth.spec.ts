import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const authScreens = {
  '/login': 'Welcome back',
  '/login/user': 'Welcome back',
  '/login/manager': 'Welcome back',
  '/login/administrator': 'Welcome back',
  '/register': 'Create your account',
}

for (const width of [375, 430, 768, 1024, 1440]) {
  for (const [route, heading] of Object.entries(authScreens)) {
    test(`${route} is readable and has no overflow at ${width}px`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(route)
      await expect(
        page.getByRole('heading', {
          name: heading,
        }),
      ).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      if (width === 375 || width === 1440) {
        await mkdir('.verification', { recursive: true })
        await page.screenshot({
          path: path.resolve(`.verification/auth-${route.slice(1).replace('/', '-')}-${width}.png`),
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
  await page.getByRole('radio', { name: 'User', exact: true }).check()
  await expect(page).toHaveURL('/login')
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
  expect(JSON.parse(local['contentcraft-demo-session'])).toMatchObject({
    email: 'creator@example.com',
    role: 'user',
  })
  expect(requests).toEqual([])
  await page.reload()
  await expect(page.getByRole('button', { name: 'Open account menu' })).toContainText('creator')
})

test('registration checks password confirmation and agreement before opening demo', async ({
  page,
}) => {
  await page.goto('/register?role=administrator&next=%2Fdashboard%2Fadmin')
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
  const session = await page.evaluate(() => localStorage.getItem('contentcraft-demo-session'))
  expect(JSON.parse(session!)).toMatchObject({ role: 'user' })
})

test('Google and password recovery clearly disclose demo behavior', async ({ page }) => {
  await page.goto('/login/manager')
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
  const session = await page.evaluate(() => sessionStorage.getItem('contentcraft-demo-session'))
  expect(JSON.parse(session!)).toMatchObject({ name: 'Demo Manager', role: 'manager' })
})

test('administrator login follows an allowed destination and logout clears remembered role', async ({
  page,
}) => {
  await page.goto('/login?next=%2Fdashboard%2Fadmin')
  await page.getByRole('radio', { name: 'Administrator', exact: true }).check()
  await page.getByLabel('EMAIL', { exact: true }).fill('admin@example.com')
  await page.getByLabel('PASSWORD', { exact: true }).fill('admin-demo-1234')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/dashboard/admin')
  await page.reload()
  await expect(page).toHaveURL('/dashboard/admin')
  const session = await page.evaluate(() => localStorage.getItem('contentcraft-demo-session'))
  expect(JSON.parse(session!)).toMatchObject({ role: 'administrator' })
  await page.getByRole('button', { name: 'Open account menu' }).click()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL('/login')
  expect(
    await page.evaluate(() => [
      localStorage.getItem('contentcraft-demo-session'),
      sessionStorage.getItem('contentcraft-demo-session'),
    ]),
  ).toEqual([null, null])
})

test('change role preserves destination while User login ignores an unauthorized destination', async ({
  page,
}) => {
  await page.goto('/login/administrator?next=%2Fdashboard%2Fadmin')
  await page.getByLabel('EMAIL', { exact: true }).fill('user@example.com')
  await page.getByLabel('PASSWORD', { exact: true }).fill('user-demo-1234')
  await page.getByRole('radio', { name: 'User', exact: true }).check()
  await expect(page.getByLabel('EMAIL', { exact: true })).toHaveValue('user@example.com')
  await expect(page.getByLabel('PASSWORD', { exact: true })).toHaveValue('user-demo-1234')
  await expect(page.locator('input[name="login-role"]:checked')).toHaveCount(1)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/dashboard')
})

test('sign-in rejects an external destination and keeps an unchecked session tab-local', async ({
  page,
  context,
}) => {
  await page.goto('/login/user?next=%2F%2Fexample.com')
  await page.getByLabel('EMAIL', { exact: true }).fill('tab@example.com')
  await page.getByLabel('PASSWORD', { exact: true }).fill('tab-demo-1234')
  await page.getByLabel('Keep me signed in on this device').uncheck()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/dashboard')
  await page.reload()
  await expect(page).toHaveURL('/dashboard')
  expect(await page.evaluate(() => localStorage.getItem('contentcraft-demo-session'))).toBeNull()
  const otherTab = await context.newPage()
  await otherTab.goto('/dashboard')
  await expect(otherTab).toHaveURL(/\/login(?:\?|$)/)
})

test('mobile workspace drawer navigates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/login/manager')
  await page.getByLabel('EMAIL', { exact: true }).fill('manager@example.com')
  await page.getByLabel('PASSWORD', { exact: true }).fill('manager-demo-1234')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/dashboard')
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Workspace navigation' })
    .getByRole('link', { name: 'Products', exact: true })
    .click()
  await expect(page).toHaveURL('/dashboard/products')
  await expect(page.locator('.dashboard-sidebar')).not.toHaveClass(/is-open/)
})

test('invalid deep links provide a working return path', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to ContentCraft' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Everything you need')
})
