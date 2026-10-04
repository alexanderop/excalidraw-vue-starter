import { defineBrowserCommand } from '@vitest/browser-playwright';
export const drawingPointer = defineBrowserCommand(
  async (
    { page, iframe },
    action: 'down' | 'move' | 'up',
    x: number,
    y: number,
  ) => {
    if (
      action === 'up' &&
      (await iframe
        .getByRole('region', { name: 'Drawing surface' })
        .count()) === 0
    ) {
      await page.mouse.up();
      return;
    }
    const bounds = await iframe
      .getByRole('region', { name: 'Drawing surface' })
      .boundingBox();
    if (!bounds) throw new Error('Drawing surface has no layout');
    await page.mouse.move(bounds.x + x, bounds.y + y);
    if (action === 'down') await page.mouse.down();
    if (action === 'up') await page.mouse.up();
  },
);
declare module 'vitest/browser' {
  interface BrowserCommands {
    drawingPointer(
      action: 'down' | 'move' | 'up',
      x: number,
      y: number,
    ): Promise<void>;
  }
}
