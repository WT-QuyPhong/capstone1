import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const pages = [
  {
    route: '/features',
    heading: 'Everything you need to craft high-converting content with AI',
    slug: 'features',
  },
  {
    route: '/integrations',
    heading: 'Connect ContentCraft to your favorite marketing & productivity tools',
    slug: 'integrations',
  },
  {
    route: '/built-for',
    heading: 'Engineered for teams that craft content with intent',
    slug: 'built-for',
  },
  {
    route: '/resources',
    heading: 'Master modern content craft with curated resources',
    slug: 'resources',
  },
  { route: '/get-started', heading: 'Create smarter.Grow faster.', slug: 'get-started' },
]

for (const width of [375, 430, 768, 1024, 1440]) {
  for (const screen of pages) {
    test(`${screen.slug} renders without overflow or broken images at ${width}px`, async ({
      page,
    }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(screen.route)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen.heading)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('main')).toBeVisible()
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true)
      const images = page.locator('main img')
      for (let i = 0; i < (await images.count()); i++) {
        await expect
          .poll(() =>
            images
              .nth(i)
              .evaluate(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
          )
          .toBe(true)
      }
      expect(errors).toEqual([])
      if (width === 1440 || width === 375) {
        await mkdir('.verification', { recursive: true })
        await page.screenshot({
          path: path.resolve(`.verification/marketing-${screen.slug}-${width}.png`),
          fullPage: true,
        })
      }
    })
  }
}

test('integrations support categories, search, empty states, and honest connection previews', async ({
  page,
}) => {
  await page.goto('/integrations')
  await expect(page.locator('.mkt-integration-card')).toHaveCount(8)
  await page.getByRole('button', { name: 'Team Chat', exact: true }).click()
  await expect(page.locator('.mkt-integration-card')).toHaveCount(2)
  await page.getByRole('textbox', { name: 'Search integrations' }).fill('Slack')
  await expect(page.locator('.mkt-integration-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Connect', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('No authorization window will open')
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.getByRole('textbox', { name: 'Search integrations' }).fill('no-matching-app')
  await expect(page.getByRole('heading', { name: 'No integrations found' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await expect(page.locator('.mkt-integration-card')).toHaveCount(8)
  await page.getByRole('button', { name: 'Request an integration', exact: true }).click()
  await page.getByRole('textbox', { name: 'App name' }).fill('Mailchimp')
  await page.getByRole('button', { name: 'Save demo request' }).click()
  await expect(page.getByRole('status')).toContainText('No request was sent')
})

test('resources filter, open useful details, browse an archive, and show demo subscription confirmation', async ({
  page,
}) => {
  await page.goto('/resources')
  await expect(page.locator('.mkt-resource-card')).toHaveCount(3)
  await page.getByRole('button', { name: 'Prompt Library', exact: true }).click()
  await expect(page.locator('.mkt-resource-card')).toHaveCount(2)
  await page.getByRole('textbox', { name: 'Search resources' }).fill('Launch')
  await expect(page.locator('.mkt-resource-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Explore kit', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Campaign brief: audience, product benefit')
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.getByRole('textbox', { name: 'Search resources' }).fill('')
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await page.getByRole('button', { name: 'Browse archive', exact: true }).click()
  await expect(page.locator('.mkt-resource-card')).toHaveCount(6)
  await page.getByRole('textbox', { name: 'Your work email' }).fill('reader@example.com')
  await page.getByRole('button', { name: 'Subscribe', exact: true }).click()
  await expect(page.locator('.mkt-newsletter-success')).toContainText('No email will be sent')
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('contentcraft-demo-newsletter')))
    .toBe('reader@example.com')
})

test('email acquisition forwards the email to registration', async ({ page }) => {
  await page.goto('/get-started')
  await page.getByRole('textbox', { name: 'Your email address' }).fill('creator@example.com')
  await page.getByRole('button', { name: 'Get started free', exact: true }).click()
  await expect(page).toHaveURL(/\/register\?email=creator%40example\.com/)
  await expect(page.getByRole('textbox', { name: /email/i })).toHaveValue('creator@example.com')
})

test('features expose a real draft variation and working interactive demo dialog', async ({
  page,
}) => {
  await page.goto('/')
  const draft = page.locator('.mkt-generated-preview > p')
  const original = await draft.innerText()
  await page.getByRole('button', { name: 'Generate another example draft' }).click()
  await expect(draft).not.toHaveText(original)
  await page.getByRole('button', { name: 'Book interactive demo', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText(
    'Live AI generation and external publishing are not connected',
  )
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('public navigation, Pricing demo dialog, and tailored use case details work', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/features')
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await nav.getByRole('link', { name: 'Built For', exact: true }).click()
  await expect(page).toHaveURL('/built-for')
  await page.getByRole('button', { name: 'Explore writer workflows', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText(
    'Turn research and briefs into a structured first draft',
  )
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await nav.getByRole('button', { name: 'Pricing', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('There is no paid subscription')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('mobile navigation opens and closes after changing pages', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/features')
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(nav).toBeHidden()
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await expect(nav).toBeVisible()
  await nav.getByRole('link', { name: 'Resources', exact: true }).click()
  await expect(page).toHaveURL('/resources')
  await expect(nav).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})
