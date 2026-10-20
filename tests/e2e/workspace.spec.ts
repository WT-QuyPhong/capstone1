import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const dashboardRoutes = [
  '/dashboard',
  '/dashboard/products',
  '/dashboard/brands',
  '/dashboard/audiences',
  '/dashboard/content-studio',
  '/dashboard/image-studio',
  '/dashboard/history',
  '/dashboard/analytics',
  '/dashboard/admin',
]

async function expectNoOverflow(page: Page) {
  const size = await page.evaluate(() => ({
    viewport: innerWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(
    size.content,
    `${page.url()} content width at ${size.viewport}px viewport`,
  ).toBeLessThanOrEqual(size.viewport + 1)
}

test('generate and edit a draft, approve it, then find the persisted content in history', async ({
  page,
}) => {
  await page.goto('/dashboard/content-studio')
  await page.getByLabel('Language', { exact: true }).selectOption('Vietnamese')
  await page.getByText('Campaign brief & tone', { exact: true }).click()
  await page
    .getByLabel('Campaign brief (optional)')
    .fill('A launch for our campus coffee community')
  await page.getByRole('button', { name: 'Generate draft', exact: true }).click()
  await expect(page.getByText('Demo draft is ready. Review and save your version.')).toBeVisible()
  await expect(page.locator('.studio-copy-body')).toContainText('campus coffee community')
  await page.getByRole('button', { name: 'Edit draft', exact: true }).click()
  const uniqueCopy =
    'A carefully edited campaign for our campus coffee community. Reviewed by a human.'
  await page.getByLabel('Edit generated content').fill(uniqueCopy)
  await page.getByRole('button', { name: 'Save draft', exact: true }).click()
  await expect(page.getByText('Draft saved to history.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Approve version', exact: true }).click()
  await expect(
    page.getByText('Version approved and saved to history.', { exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'History', exact: true }).click()
  const search = page.getByRole('searchbox', { name: 'Search saved items, versions, or tags' })
  await search.fill('carefully edited campaign')
  await expect(page.locator('.studio-history-row')).toHaveCount(1)
  await expect(page.locator('.studio-history-row')).toContainText('Approved')
  await page.reload()
  await search.fill('carefully edited campaign')
  await page.locator('.studio-history-open').click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText(uniqueCopy)
  await dialog.getByLabel('Approval status').selectOption('In review')
  await dialog.getByRole('button', { name: 'Save status', exact: true }).click()
  await dialog.getByRole('button', { name: 'Close', exact: true }).click()
  await expect(page.locator('.studio-history-row')).toContainText('In review')
  await page.getByRole('button', { name: /^Approved \(/ }).click()
  await expect(page.getByRole('heading', { name: 'No matching content' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await expect(page.locator('.studio-history-row')).toHaveCount(6)
})

test('editing an approved version creates an unsaved draft and preserves the approved record', async ({
  page,
}) => {
  await page.goto('/dashboard/content-studio')
  await page.getByRole('button', { name: 'Edit draft', exact: true }).click()
  const original = 'Reviewed original campaign copy with an approved offer.'
  const revision = 'Unapproved revision campaign copy with a different offer.'
  await page.getByLabel('Edit generated content').fill(original)
  await page.getByRole('button', { name: 'Approve version', exact: true }).click()
  await expect(page.locator('.studio-output-status')).toContainText('Approved')
  await page.getByRole('button', { name: 'Edit draft', exact: true }).click()
  await page.getByLabel('Edit generated content').fill(revision)
  await expect(page.locator('.studio-output-status')).toContainText('Draft · unsaved')
  await page.getByRole('button', { name: 'Save draft', exact: true }).click()
  await expect(page.locator('.studio-output-status')).toContainText('Saved draft')
  await page.getByRole('link', { name: 'History', exact: true }).click()
  await page.reload()
  const search = page.getByRole('searchbox', { name: 'Search saved items, versions, or tags' })
  await search.fill('Reviewed original campaign')
  await expect(page.locator('.studio-history-row')).toHaveCount(1)
  await expect(page.locator('.studio-history-row')).toContainText('Approved')
  await page.locator('.studio-history-open').click()
  await expect(page.getByRole('dialog')).toContainText(original)
  await expect(page.getByRole('dialog')).not.toContainText(revision)
  await page.keyboard.press('Escape')
  await search.fill('Unapproved revision campaign')
  await expect(page.locator('.studio-history-row')).toHaveCount(1)
  await expect(page.locator('.studio-history-row')).toContainText('Draft')
})

test('studios cannot generate using another brand’s products when a brand has no products', async ({
  page,
}) => {
  await page.goto('/dashboard/brands')
  await page.getByRole('button', { name: 'New brand', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Brand name', { exact: true }).fill('Empty Brand Regression')
  await dialog.getByLabel('Industry', { exact: true }).fill('Retail')
  await dialog
    .getByLabel('About the brand', { exact: true })
    .fill('A brand with no configured products yet.')
  await dialog.getByLabel('Brand voice & tone', { exact: true }).fill('Warm and helpful')
  await dialog.getByLabel('Target audience', { exact: true }).fill('University students')
  await dialog.getByRole('button', { name: 'Create brand', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await page.getByRole('link', { name: 'AI Content Studio', exact: true }).click()
  await page.getByLabel('Brand', { exact: true }).selectOption({ label: 'Empty Brand Regression' })
  const product = page.getByLabel('Product', { exact: true })
  await expect(product).toBeDisabled()
  await expect(product.getByRole('option')).toHaveCount(1)
  await expect(product.getByRole('option')).toHaveText('No products for this brand')
  await expect(
    page.getByText('Add a product for this brand in Products before generating.', { exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Generate draft', exact: true })).toBeDisabled()
  await page.getByRole('link', { name: 'Image Studio', exact: true }).click()
  await page.getByLabel('Brand', { exact: true }).selectOption({ label: 'Empty Brand Regression' })
  await expect(page.getByLabel('Product', { exact: true })).toBeDisabled()
  await expect(page.getByLabel('Product', { exact: true }).getByRole('option')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Generate image', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Regenerate', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Save as version', exact: true })).toBeDisabled()
})

test('image studio explains demo mode, changes aspect ratio, saves and exports the visual', async ({
  page,
}) => {
  await page.goto('/dashboard/image-studio')
  await page.getByLabel('Aspect ratio', { exact: true }).selectOption('16:9')
  await page
    .getByRole('textbox', { name: 'Visual brief', exact: true })
    .fill('Warm afternoon light for a coffee campaign')
  await page.getByRole('button', { name: 'Generate image', exact: true }).click()
  await expect(
    page.getByText('Demo visual is ready. This is a local illustration, not an AI render.', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.locator('.studio-image-preview')).toHaveClass(/studio-ratio-16-9/)
  await page.getByRole('button', { name: 'Save as version', exact: true }).click()
  await expect(
    page.getByText('Visual saved as a draft in content history.', { exact: true }),
  ).toBeVisible()
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download demo visual', exact: true }).click()
  expect((await downloadEvent).suggestedFilename()).toBe('contentcraft-demo-visual.svg')
  await page.getByRole('button', { name: 'Expand image preview', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('not an AI-generated image')
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'History', exact: true }).click()
  await page
    .getByRole('searchbox', { name: 'Search saved items, versions, or tags' })
    .fill('Warm afternoon light')
  await expect(page.locator('.studio-history-row')).toHaveCount(1)
})

test('analytics date range changes the dataset and exports a report', async ({ page }) => {
  await page.goto('/dashboard/analytics')
  const reach = page
    .locator('.studio-metric-card')
    .filter({ hasText: 'Tracked reach' })
    .locator('.studio-metric-value')
  await expect(reach).toHaveText('28.4K')
  await page.getByLabel('Analytics date range').selectOption('7')
  await expect(reach).toHaveText('9.1K')
  await page.getByRole('button', { name: 'Full breakdown', exact: false }).click()
  await expect(page.getByRole('dialog')).toContainText('Last 7 days')
  await expect(page.getByRole('dialog').getByRole('row')).toHaveCount(8)
  await page.keyboard.press('Escape')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export report', exact: true }).click()
  expect((await downloadEvent).suggestedFilename()).toBe('contentcraft-demo-analytics.csv')
})

test('product creation, editing, search and confirmed deletion persist correctly', async ({
  page,
}) => {
  await page.goto('/dashboard/products')
  await page.getByRole('button', { name: 'Add product', exact: true }).click()
  let dialog = page.getByRole('dialog')
  await dialog.getByLabel('Product name', { exact: true }).fill('Campus Coffee Test')
  await dialog
    .getByLabel('Description', { exact: true })
    .fill('A smooth coffee made for campus study breaks.')
  await dialog
    .getByLabel('Key product facts', { exact: true })
    .fill('Cold brewed, small batch, no added sugar')
  await dialog.getByLabel('Price (USD)', { exact: true }).fill('4.5')
  await dialog.getByRole('button', { name: 'Add product', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  const search = page.getByRole('searchbox', { name: 'Search products, SKUs, or brands' })
  await search.fill('Campus Coffee Test')
  await expect(page.locator('.entity-product-row')).toHaveCount(1)
  await page.getByRole('button', { name: 'Actions for Campus Coffee Test', exact: true }).click()
  await page.getByRole('button', { name: 'Edit details', exact: true }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Product name', { exact: true }).fill('Campus Coffee Updated')
  await dialog.getByRole('combobox', { name: 'Status', exact: true }).selectOption('Active')
  await dialog.getByRole('button', { name: 'Save changes', exact: true }).click()
  await search.fill('Campus Coffee Updated')
  await page.reload()
  await search.fill('Campus Coffee Updated')
  await expect(page.locator('.entity-product-row')).toContainText('Active')
  await page.getByRole('button', { name: 'Actions for Campus Coffee Updated', exact: true }).click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Delete permanently', exact: true })
    .click()
  await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible()
  await page.reload()
  await search.fill('Campus Coffee Updated')
  await expect(page.locator('.entity-product-row')).toHaveCount(0)
})

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1050 },
  { name: 'mobile', width: 375, height: 812 },
]) {
  test(`all dashboard routes render without runtime errors or overflow on ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const route of dashboardRoutes) {
      await page.goto(route)
      await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expectNoOverflow(page)
      expect(errors, `Runtime errors at ${route}`).toEqual([])
      if (
        [
          '/dashboard',
          '/dashboard/content-studio',
          '/dashboard/image-studio',
          '/dashboard/analytics',
        ].includes(route)
      ) {
        const name = route.split('/').filter(Boolean).pop()
        await page.screenshot({
          path: `.verification/${name}-${viewport.name}.png`,
          fullPage: true,
        })
      }
    }
    if (viewport.name === 'mobile') {
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
      await page.getByRole('link', { name: 'AI Content Studio', exact: true }).click()
      await expect(
        page.getByRole('heading', { name: 'AI Content Studio', exact: true }),
      ).toBeVisible()
      await expect(page.locator('.dashboard-sidebar')).not.toHaveClass(/is-open/)
    }
  })
}
