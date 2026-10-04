import { describe, expect, it } from 'vitest';
import { rectangleBounds } from '../../src/features/drawing/domain/rectangle';
import { createDrawing } from '../../src/features/drawing/application/createDrawing';
import { initialStyle } from '../../src/features/toolbox/domain/tools';
import {
  documentPoint,
  viewportTransform,
} from '../../src/features/viewport/domain/coordinates';
const normal = { square: false, centered: false };
function create() {
  let id = 0;
  return createDrawing({ next: () => ({ id: `rectangle-${++id}`, seed: id }) });
}
describe('rectangle geometry', () => {
  it.each([
    [30, 40, 10, 20],
    [-10, 40, -10, 20],
    [30, 0, 10, 0],
    [-10, 0, -10, 0],
  ])('normalizes drag to %s,%s', (x, y, left, top) => {
    expect(rectangleBounds({ x: 10, y: 20 }, { x, y }, normal)).toEqual({
      x: left,
      y: top,
      width: 20,
      height: 20,
    });
  });
  it('constrains a square while preserving the drag quadrant', () => {
    expect(
      rectangleBounds(
        { x: 100, y: 100 },
        { x: 60, y: 120 },
        { square: true, centered: false },
      ),
    ).toEqual({ x: 60, y: 100, width: 40, height: 40 });
  });
  it('centers rectangles and squares on the anchor', () => {
    expect(
      rectangleBounds(
        { x: 100, y: 100 },
        { x: 60, y: 120 },
        { square: false, centered: true },
      ),
    ).toEqual({ x: 60, y: 80, width: 80, height: 40 });
    expect(
      rectangleBounds(
        { x: 100, y: 100 },
        { x: 60, y: 120 },
        { square: true, centered: true },
      ),
    ).toEqual({ x: 60, y: 60, width: 80, height: 80 });
  });
  it('uses the same origin and scale for rendering and input', () => {
    expect(documentPoint({ x: 210, y: 120 }, { x: 10, y: 20 }, 200)).toEqual({
      x: 100,
      y: 50,
    });
    expect(viewportTransform(200)).toBe('scale(2)');
  });
});
describe('drawing commands', () => {
  it('snapshots styles and commits final pointer-up coordinates exactly once', () => {
    const drawing = create();
    const style = { ...initialStyle };
    drawing.begin(1, { x: 10, y: 20 }, style);
    style.stroke = '#ff0000';
    drawing.update(1, { x: 50, y: 60 }, normal);
    expect(drawing.state.elements).toHaveLength(0);
    expect(drawing.end(1, { x: 70, y: 90 }, normal)).toBe('committed');
    expect(drawing.state.elements).toEqual([
      {
        id: 'rectangle-1',
        seed: 1,
        kind: 'rectangle',
        x: 10,
        y: 20,
        width: 60,
        height: 70,
        style: initialStyle,
      },
    ]);
    expect(drawing.end(1, { x: 80, y: 90 }, normal)).toBe('ignored');
    expect(drawing.state.elements).toHaveLength(1);
  });
  it('ignores a second pointer and keeps the original seed through updates', () => {
    const drawing = create();
    drawing.begin(1, { x: 0, y: 0 }, initialStyle);
    drawing.begin(2, { x: 100, y: 100 }, initialStyle);
    drawing.update(2, { x: 300, y: 300 }, normal);
    expect(drawing.end(2, { x: 300, y: 300 }, normal)).toBe('ignored');
    drawing.update(1, { x: 20, y: 10 }, { square: true, centered: false });
    expect(drawing.state.gesture).toMatchObject({
      status: 'drawing',
      draft: { seed: 1, width: 20, height: 20 },
    });
    drawing.update(1, { x: 20, y: 10 }, normal);
    expect(drawing.state.gesture).toMatchObject({
      draft: { seed: 1, width: 20, height: 10 },
    });
  });
  it('cancels and discards clicks without committing', () => {
    const drawing = create();
    drawing.begin(1, { x: 0, y: 0 }, initialStyle);
    drawing.update(1, { x: 100, y: 50 }, normal);
    drawing.cancel();
    expect(drawing.end(1, { x: 100, y: 50 }, normal)).toBe('ignored');
    drawing.begin(2, { x: 20, y: 20 }, initialStyle);
    expect(drawing.end(2, { x: 21, y: 21 }, normal)).toBe('discarded');
    expect(drawing.state.elements).toEqual([]);
    expect(drawing.state.gesture).toEqual({ status: 'idle' });
  });
});
