import { expect, test } from '@playwright/test'

test('brand context can be created, edited, filtered and persisted', async ({ page }) => {
  await page.goto('/dashboard/brands')
  await page.getByRole('button', { name: 'New brand', exact: true }).click()
  let dialog = page.getByRole('dialog')
  await dialog.getByLabel('Brand name', { exact: true }).fill('Campus Brand')
  await dialog.getByLabel('Industry', { exact: true }).fill('Education')
  await dialog
    .getByLabel('About the brand', { exact: true })
    .fill('Useful products for thoughtful campus communities.')
  await dialog.getByLabel('Brand voice & tone', { exact: true }).fill('Helpful, warm, clear')
  await dialog.getByLabel('Target audience', { exact: true }).fill('University students')
  await dialog.getByLabel('Website (optional)', { exact: true }).fill('https://campus.example.com')
  await dialog.getByRole('button', { name: 'Create brand', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  const search = page.getByRole('searchbox', { name: 'Search brands or keywords' })
  await search.fill('Campus Brand')
  const card = page.locator('.entity-brand-card')
  await expect(card).toHaveCount(1)
  await expect(card).toContainText('Helpful, warm, clear')
  await card.getByRole('button', { name: 'Open brand', exact: true }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Brand name', { exact: true }).fill('Campus Brand Updated')
  await dialog.getByLabel('Brand voice & tone', { exact: true }).fill('Informative, warm, concise')
  await dialog.getByLabel('Status', { exact: true }).selectOption('Draft')
  await dialog.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(card).toContainText('Campus Brand Updated')
  await expect(card).toContainText('Informative, warm, concise')
  await expect(card).toContainText('Draft')
  await page.getByRole('button', { name: 'Filter', exact: true }).click()
  await page.getByLabel('Status', { exact: true }).selectOption('Active')
  await expect(page.getByRole('heading', { name: 'No brands found' })).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
  await expect(card).toHaveCount(1)
  await page.reload()
  await search.fill('Campus Brand Updated')
  await expect(card).toContainText('Informative, warm, concise')
})

test('brand import validates JSON and deleting a linked brand preserves product context', async ({
  page,
}) => {
  await page.goto('/dashboard/brands')
  await page.getByRole('button', { name: 'Import brand assets', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText(
    'Live Figma, website and CRM connections require backend integration',
  )
  await dialog.getByLabel('Or paste JSON', { exact: true }).fill('{ invalid')
  await dialog.getByRole('button', { name: 'Import records', exact: true }).click()
  await expect(
    dialog.getByText('This is not valid JSON. Check the example format below.'),
  ).toBeVisible()
  await dialog.getByLabel('Or paste JSON', { exact: true }).fill(
    JSON.stringify({
      name: 'Imported Brand',
      industry: 'Retail',
      description: 'Thoughtful everyday essentials for mindful consumers.',
      voice: 'Warm, clear',
      audience: 'Young professionals',
      website: '',
      color: '#447744',
      status: 'Active',
    }),
  )
  await dialog.getByRole('button', { name: 'Import records', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Imported Brand', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Actions for Aurora Coffee', exact: true }).click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Delete permanently', exact: true })
    .click()
  await expect(page.getByRole('alert')).toContainText('This brand has linked products')
  await expect(page.getByRole('heading', { name: 'Aurora Coffee', exact: true })).toBeVisible()
})

test('customer profiles support validated creation, editing, filters and confirmed deletion', async ({
  page,
}) => {
  await page.goto('/dashboard/audiences')
  await page.getByRole('button', { name: 'New profile', exact: true }).click()
  let dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Save profile', exact: true }).click()
  await expect(dialog.getByText('Enter a profile name of at least 2 characters.')).toBeVisible()
  await dialog.getByLabel('Profile name', { exact: false }).fill('Campus Creators')
  await dialog
    .getByLabel('About this audience', { exact: false })
    .fill('Students who create useful stories for their campus communities.')
  await dialog.getByLabel('Age range', { exact: false }).fill('18–24')
  await dialog.getByLabel('Location / market', { exact: false }).fill('Da Nang')
  await dialog
    .getByLabel('Interests & traits', { exact: false })
    .fill('Creative, Social-first, Value-conscious')
  await dialog
    .getByLabel('Preferred content tone', { exact: false })
    .fill('Friendly, energetic, helpful')
  await dialog.getByRole('button', { name: 'Save profile', exact: true }).click()
  const search = page.getByRole('searchbox', { name: 'Search customer profiles, tags, or traits' })
  await search.fill('Campus Creators')
  const card = page.locator('.entity-audience-card')
  await expect(card).toHaveCount(1)
  await expect(card).toContainText('Friendly, energetic, helpful')
  await card.getByRole('button', { name: 'Edit profile', exact: true }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Profile name', { exact: true }).fill('Campus Creators Updated')
  await dialog.getByLabel('Status', { exact: true }).selectOption('Draft')
  await dialog.getByRole('button', { name: 'Save profile', exact: true }).click()
  await page.getByRole('button', { name: 'Filters', exact: true }).click()
  await page.getByLabel('Status', { exact: true }).selectOption('Active')
  await expect(page.getByRole('heading', { name: 'No customer profiles found' })).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
  await page.reload()
  await search.fill('Campus Creators Updated')
  await expect(card).toContainText('Draft')
  await page
    .getByRole('button', { name: 'Actions for Campus Creators Updated', exact: true })
    .click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(card).toHaveCount(1)
  await page
    .getByRole('button', { name: 'Actions for Campus Creators Updated', exact: true })
    .click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Delete permanently', exact: true })
    .click()
  await expect(page.getByRole('heading', { name: 'No customer profiles found' })).toBeVisible()
  await page.reload()
  await search.fill('Campus Creators Updated')
  await expect(card).toHaveCount(0)
})

test('demo team invitations, roles, statuses and audit entries persist locally', async ({
  page,
}) => {
  await page.goto('/dashboard/admin')
  await page.getByRole('button', { name: 'Invite member', exact: true }).click()
  let dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('No invitation email is sent')
  await dialog.getByLabel('Full name', { exact: true }).fill('Campus Reviewer')
  await dialog.getByLabel('Email address', { exact: true }).fill('campus.reviewer@example.com')
  await dialog.getByRole('button', { name: 'Create demo invitation', exact: true }).click()
  const search = page.getByRole('searchbox', { name: 'Search members or roles' })
  await search.fill('Campus Reviewer')
  const member = page.locator('.entity-member-row')
  await expect(member).toHaveCount(1)
  await expect(member).toContainText('Invited')
  await member.locator('.entity-member-name').click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Workspace role', { exact: true }).selectOption('Reviewer')
  await dialog.getByLabel('Status', { exact: true }).selectOption('Suspended')
  await dialog.getByRole('button', { name: 'Save member', exact: true }).click()
  await expect(member).toContainText('Suspended')
  await expect(member.locator('.entity-role-pill')).toHaveText('Reviewer')
  await page.getByRole('button', { name: 'Filter team members', exact: true }).click()
  await page.getByLabel('Role', { exact: true }).selectOption('Editor')
  await expect(page.getByRole('heading', { name: 'No team members found' })).toBeVisible()
  await page.getByLabel('Role', { exact: true }).selectOption('Reviewer')
  await page.getByLabel('Status', { exact: true }).selectOption('Suspended')
  await expect(member).toHaveCount(1)
  await page.reload()
  await search.fill('Campus Reviewer')
  await expect(member).toContainText('Suspended')
  await search.fill('')
  await page.getByRole('tab', { name: 'Audit', exact: true }).click()
  await expect(
    page.locator('.entity-audit-panel li').filter({ hasText: 'Added Campus Reviewer (Editor)' }),
  ).toBeVisible()
  await expect(
    page
      .locator('.entity-audit-panel li')
      .filter({ hasText: 'Updated Campus Reviewer (Reviewer)' }),
  ).toBeVisible()
  await page.getByRole('tab', { name: 'Roles', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Reviewer', exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Usage', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Workspace usage', exact: true })).toBeVisible()
})

test('the last active administrator cannot be demoted, suspended or deleted', async ({ page }) => {
  await page.goto('/dashboard/admin')
  const admin = page
    .locator('.entity-member-row')
    .filter({ has: page.locator('.entity-role-pill').filter({ hasText: /^Admin$/ }) })
  await expect(admin).toHaveCount(1)
  await admin.locator('.entity-member-name').click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Workspace role', { exact: true }).selectOption('Reviewer')
  await dialog.getByRole('button', { name: 'Save member', exact: true }).click()
  await expect(
    dialog.getByText('Keep at least one active administrator in the workspace.'),
  ).toBeVisible()
  await dialog.getByLabel('Workspace role', { exact: false }).selectOption('Admin')
  await dialog.getByLabel('Status', { exact: true }).selectOption('Suspended')
  await dialog.getByRole('button', { name: 'Save member', exact: true }).click()
  await expect(
    dialog.getByText('Keep at least one active administrator in the workspace.'),
  ).toBeVisible()
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await admin.getByRole('button', { name: /^Actions for/ }).click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Delete permanently', exact: true })
    .click()
  await expect(page.getByRole('alert')).toContainText('Keep at least one active administrator')
  await expect(admin).toHaveCount(1)
  await expect(admin).toContainText('Active')
})

for (const width of [430, 768, 1024]) {
  test(`entity pages remain usable without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    for (const route of ['products', 'brands', 'audiences', 'admin']) {
      await page.goto(`/dashboard/${route}`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      )
    }
  })
}
