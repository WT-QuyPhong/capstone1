import { expect, test } from '@playwright/test'

for (const width of [430, 768, 1024]) {
  test(`all workspace screens remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const route of [
      '',
      '/products',
      '/brands',
      '/audiences',
      '/content-studio',
      '/image-studio',
      '/history',
      '/analytics',
      '/admin',
    ]) {
      await page.goto(`/dashboard${route}`)
      await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      for (const image of await page.getByRole('main').locator('img').all()) {
        await expect
          .poll(() =>
            image.evaluate(
              (element) =>
                (element as HTMLImageElement).complete &&
                (element as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true)
      }
      expect(errors, `Unexpected runtime error at /dashboard${route}`).toEqual([])
    }
  })
}
