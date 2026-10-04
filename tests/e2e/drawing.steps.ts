import { createBdd } from 'playwright-bdd';
import { expect, type Page } from '@playwright/test';
import { WorkspacePage } from './WorkspacePage';
const { When, Then } = createBdd();
const workspaces = new WeakMap<Page, WorkspacePage>();
function workspace(page: Page) {
  let value = workspaces.get(page);
  if (!value) {
    value = new WorkspacePage(page);
    workspaces.set(page, value);
  }
  return value;
}
const widths = new WeakMap<Page, number>();
When('I drag a rectangle on the canvas', async ({ page }) => {
  await workspace(page).drag();
});
When('I keep the drawing tool selected', async ({ page }) => {
  await workspace(page).keepTool();
});
When('I drag a rectangle upward and left', async ({ page }) => {
  await workspace(page).drag(-80, -70);
});
Then('I see {int} finished rectangle(s)', async ({ page }, count: number) => {
  await workspace(page).expectCount(count);
});
Then('the selection tool is active', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Selection (V)', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});
When('I start a rectangle preview', async ({ page }) => {
  await workspace(page).down();
  await workspace(page).move();
});
Then('I see a rectangle preview', async ({ page }) => {
  await expect(
    page.getByRole('img', { name: 'Rectangle preview' }),
  ).toBeVisible();
});
When('I cancel drawing with Escape', async ({ page }) => {
  await page.keyboard.press('Escape');
  await workspace(page).up();
});
Then('there is no rectangle preview', async ({ page }) => {
  await expect(
    page.getByRole('img', { name: 'Rectangle preview' }),
  ).toHaveCount(0);
});
When('I switch to selection during the gesture', async ({ page }) => {
  await page.keyboard.press('v');
  await workspace(page).up();
});
When('I open help during the gesture', async ({ page }) => {
  await page.keyboard.press('?');
  await expect(page.getByRole('dialog')).toBeVisible();
  await workspace(page).up();
});
When('I start a wide rectangle preview', async ({ page }) => {
  await workspace(page).down();
  await workspace(page).move(80, 40);
});
When('I hold Shift and Alt without moving', async ({ page }) => {
  await page.keyboard.down('Shift');
  await page.keyboard.down('Alt');
});
Then('the preview is a centered square', async ({ page }) => {
  const box = await page
    .getByRole('img', { name: 'Rectangle preview' })
    .boundingBox();
  const start = await workspace(page).start();
  expect(box).not.toBeNull();
  expect(box!.width).toBeCloseTo(160, -1);
  expect(box!.height).toBeCloseTo(160, -1);
  expect(box!.x).toBeCloseTo(start.x - 80, -1);
  expect(box!.y).toBeCloseTo(start.y - 80, -1);
});
When('I release modifiers without moving', async ({ page }) => {
  await page.keyboard.up('Shift');
  await page.keyboard.up('Alt');
});
Then('the preview returns to its original bounds', async ({ page }) => {
  const box = await page
    .getByRole('img', { name: 'Rectangle preview' })
    .boundingBox();
  expect(box!.width).toBeCloseTo(80, -1);
  expect(box!.height).toBeCloseTo(40, -1);
});
When('I finish the rectangle', async ({ page }) => {
  await workspace(page).up();
});
When('I zoom to 200 percent', async ({ page }) => {
  widths.set(
    page,
    (await workspace(page).rectangles.first().boundingBox())!.width,
  );
  const mobile = !(await page
    .getByRole('button', { name: 'Zoom in', exact: true })
    .isVisible());
  if (mobile)
    await page
      .getByRole('button', { name: 'Workspace menu', exact: true })
      .click();
  for (let i = 0; i < 4; i++)
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  if (mobile) await page.keyboard.press('Escape');
});
Then('the first rectangle is twice as wide', async ({ page }) => {
  expect(
    (await workspace(page).rectangles.first().boundingBox())!.width,
  ).toBeCloseTo(widths.get(page)! * 2, 0);
});
When('I reset the zoom', async ({ page }) => {
  const mobile = !(await page
    .getByRole('button', { name: 'Reset zoom', exact: true })
    .isVisible());
  if (mobile)
    await page
      .getByRole('button', { name: 'Workspace menu', exact: true })
      .click();
  await page.getByRole('button', { name: 'Reset zoom' }).click();
  if (mobile) await page.keyboard.press('Escape');
});
Then('the second rectangle is half as wide as the first', async ({ page }) => {
  const rects = workspace(page).rectangles;
  expect((await rects.nth(1).boundingBox())!.width).toBeCloseTo(
    (await rects.first().boundingBox())!.width / 2,
    -1,
  );
});
When('I close shape styles if open', async ({ page }) => {
  const close = page.getByRole('button', { name: 'Close styles', exact: true });
  if (await close.isVisible()) await close.click();
});
Then('the first rectangle keeps its original ink', async ({ page }) => {
  await expect(
    workspace(page).rectangles.first().locator('path').last(),
  ).toHaveAttribute('stroke', '#1e1e1e');
});
Then('the second rectangle uses coral ink', async ({ page }) => {
  await expect(
    workspace(page).rectangles.nth(1).locator('path').last(),
  ).toHaveAttribute('stroke', '#e03131');
});

When('I choose clean edges', async ({ page }) => {
  const toggle = page.getByRole('button', {
    name: 'Shape styles',
    exact: true,
  });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole('button', { name: 'clean edges', exact: true }).click();
  const close = page.getByRole('button', { name: 'Close styles', exact: true });
  if (await close.isVisible()) await close.click();
});
