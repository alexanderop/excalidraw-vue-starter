import { afterEach, expect, it } from 'vitest';
import { commands } from 'vitest/browser';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, nextTick, reactive } from 'vue';
import DrawingSurface from '../../src/features/drawing/ui/DrawingSurface.vue';
import { createDrawing } from '../../src/features/drawing/application/createDrawing';
import { roughRenderer } from '../../src/features/drawing/adapters/roughRenderer';
import { initialStyle } from '../../src/features/toolbox/domain/tools';
async function setup() {
  const drawing = createDrawing({ next: () => ({ id: 'test', seed: 7 }) });
  const props = reactive({
    active: true,
    blocked: false,
    zoom: 100,
    style: { ...initialStyle },
  });
  const renderer = roughRenderer();
  const screen = await render(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'position:relative;width:400px;height:300px' }, [
          h(DrawingSurface, { ...props, drawing, renderer }),
        ]),
    }),
  );
  return { drawing, props, screen };
}
afterEach(async () => {
  await commands.drawingPointer('up', 20, 20).catch(() => {});
});
it('captures a real pointer and commits outside the surface using final coordinates', async () => {
  const { drawing, screen } = await setup();
  await commands.drawingPointer('down', 100, 100);
  const surface = document.querySelector('svg')!;
  const gesture = drawing.state.gesture;
  expect(gesture.status).toBe('drawing');
  if (gesture.status !== 'drawing') throw new Error('Missing gesture');
  expect(surface.hasPointerCapture(gesture.pointerId)).toBe(true);
  await commands.drawingPointer('move', 250, 200);
  await expect
    .element(screen.getByRole('img', { name: 'Rectangle preview' }))
    .toBeVisible();
  await commands.drawingPointer('up', 450, 250);
  expect(drawing.state.elements[0]).toMatchObject({
    x: 100,
    y: 100,
    width: 350,
    height: 150,
  });
  expect(surface.hasPointerCapture(gesture.pointerId)).toBe(false);
  await expect
    .element(screen.getByRole('img', { name: 'Rectangle 1', exact: true }))
    .toBeVisible();
});
it.each(['active', 'blocked', 'zoom'] as const)(
  'cancels and releases capture when %s changes',
  async (property) => {
    const { drawing, props } = await setup();
    await commands.drawingPointer('down', 100, 100);
    await commands.drawingPointer('move', 200, 180);
    const gesture = drawing.state.gesture;
    if (gesture.status !== 'drawing') throw new Error('Missing gesture');
    if (property === 'active') props.active = false;
    if (property === 'blocked') props.blocked = true;
    if (property === 'zoom') props.zoom = 200;
    await nextTick();
    expect(drawing.state.gesture).toEqual({ status: 'idle' });
    expect(
      document.querySelector('svg')!.hasPointerCapture(gesture.pointerId),
    ).toBe(false);
    await commands.drawingPointer('up', 220, 190);
    expect(drawing.state.elements).toEqual([]);
  },
);
it('cancels when native capture is lost and on unmount', async () => {
  const { drawing, screen } = await setup();
  await commands.drawingPointer('down', 100, 100);
  let gesture = drawing.state.gesture;
  if (gesture.status !== 'drawing') throw new Error('Missing gesture');
  document.querySelector('svg')!.releasePointerCapture(gesture.pointerId);
  await commands.drawingPointer('move', 200, 180);
  expect(drawing.state.gesture).toEqual({ status: 'idle' });
  await commands.drawingPointer('up', 200, 180);
  await commands.drawingPointer('down', 100, 100);
  gesture = drawing.state.gesture;
  expect(gesture.status).toBe('drawing');
  await screen.unmount();
  expect(drawing.state.gesture).toEqual({ status: 'idle' });
  expect(drawing.state.elements).toEqual([]);
});
it('adjusts only drawing presentation in dark mode without changing stored ink', async () => {
  document.documentElement.dataset.theme = 'dark';
  try {
    const { drawing } = await setup();
    await commands.drawingPointer('down', 100, 100);
    await commands.drawingPointer('up', 200, 180);
    expect(getComputedStyle(document.documentElement).filter).toBe('none');
    expect(getComputedStyle(document.querySelector('svg')!).filter).toContain(
      'invert',
    );
    expect(drawing.state.elements[0]?.style.stroke).toBe('#1e1e1e');
  } finally {
    delete document.documentElement.dataset.theme;
  }
});
