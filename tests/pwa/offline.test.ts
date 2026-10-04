import { test, expect } from '@playwright/test';
test('repository subpath installs its offline shell and reopens without network', async ({
  page,
  context,
}) => {
  await page.goto('./');
  await expect(page.getByRole('toolbar')).toBeVisible();
  const manifestUrl = await page
    .locator('link[rel="manifest"]')
    .getAttribute('href');
  expect(manifestUrl).toBeTruthy();
  const manifest = await (await page.request.get(manifestUrl!)).json();
  expect(manifest.start_url).toBe('/excalidraw-vue-starter/');
  expect(manifest.scope).toBe('/excalidraw-vue-starter/');
  expect(manifest.display).toBe('standalone');
  for (const icon of manifest.icons) {
    const response = await page.request.get(new URL(icon.src, page.url()).href);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
  }
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('toolbar')).toBeVisible();
  await page
    .getByRole('button', { name: 'Rectangle (R)', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Rectangle (R)', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  const second = await context.newPage();
  await second.goto(page.url());
  await expect(second.getByRole('toolbar')).toBeVisible();
  await second.evaluate(async () => {
    await document.fonts.ready;
  });
  expect(
    await second.evaluate(() => document.fonts.check('14px Assistant')),
  ).toBe(true);
});
