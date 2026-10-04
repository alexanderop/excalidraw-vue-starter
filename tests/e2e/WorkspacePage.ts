import { expect, type CDPSession, type Page } from '@playwright/test';
export class WorkspacePage {
  constructor(readonly page: Page) {}
  get surface() {
    return this.page.getByRole('region', {
      name: 'Drawing surface',
      exact: true,
    });
  }
  get rectangles() {
    return this.page.getByRole('img', { name: /^Rectangle \d+$/ });
  }
  async chooseRectangle() {
    await this.page
      .getByRole('button', { name: 'Rectangle (R)', exact: true })
      .click();
  }
  async start() {
    const box = await this.surface.boundingBox();
    if (!box) throw new Error('Drawing surface has no layout');
    return { x: box.x + box.width * 0.6, y: box.y + box.height * 0.36 };
  }
  private touch: CDPSession | undefined;
  async down() {
    const start = await this.start();
    if (await this.page.evaluate(() => navigator.maxTouchPoints > 0)) {
      this.touch = await this.page.context().newCDPSession(this.page);
      await this.touch.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ ...start, id: 1 }],
      });
    } else {
      await this.page.mouse.move(start.x, start.y);
      await this.page.mouse.down();
    }
  }
  async move(dx = 80, dy = 70) {
    const start = await this.start();
    if (this.touch)
      await this.touch.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: start.x + dx, y: start.y + dy, id: 1 }],
      });
    else await this.page.mouse.move(start.x + dx, start.y + dy);
  }
  async up() {
    if (this.touch) {
      await this.touch.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });
      await this.touch.detach();
      this.touch = undefined;
    } else await this.page.mouse.up();
  }
  async drag(dx = 80, dy = 70) {
    await this.down();
    await this.move(dx, dy);
    await this.up();
  }
  async keepTool() {
    const button = this.page.getByRole('button', {
      name: 'Keep tool selected',
      exact: true,
    });
    if (await button.isVisible()) await button.click();
    else {
      await this.page
        .getByRole('button', { name: 'Workspace menu', exact: true })
        .click();
      await button.click();
    }
  }
  async expectCount(count: number) {
    await expect(this.rectangles).toHaveCount(count);
  }
}
