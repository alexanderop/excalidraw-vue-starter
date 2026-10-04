import { expect, it } from 'vitest';
import { roughRenderer } from '../../src/features/drawing/adapters/roughRenderer';
import { initialStyle } from '../../src/features/toolbox/domain/tools';
import type { Rectangle } from '../../src/features/drawing/domain/rectangle';
const rectangle: Rectangle = {
  id: 'one',
  seed: 42,
  kind: 'rectangle',
  x: 10,
  y: 20,
  width: 160,
  height: 80,
  style: initialStyle,
};
it('renders reproducible real Rough.js paths with stable seed', () => {
  const renderer = roughRenderer();
  const paths = renderer.render(rectangle);
  expect(paths.length).toBeGreaterThan(0);
  expect(paths[0]?.d).toContain('M');
  expect(renderer.render(rectangle)).toEqual(paths);
  expect(renderer.render({ ...rectangle, seed: 43 })).not.toEqual(paths);
});
it('renders sharp and rounded corners and each roughness distinctly', () => {
  const renderer = roughRenderer();
  const variants = ['clean', 'natural', 'sketch'].map((roughness) =>
    renderer.render({
      ...rectangle,
      style: {
        ...initialStyle,
        roughness: roughness as 'clean' | 'natural' | 'sketch',
      },
    }),
  );
  expect(variants[0]).not.toEqual(variants[1]);
  expect(variants[1]).not.toEqual(variants[2]);
  expect(
    renderer.render({
      ...rectangle,
      style: { ...initialStyle, corners: 'sharp' },
    }),
  ).not.toEqual(renderer.render(rectangle));
});
it('applies fills and stroke options without dashing the fill', () => {
  const renderer = roughRenderer();
  const filled = renderer.render({
    ...rectangle,
    style: {
      ...initialStyle,
      fill: '#ff0000',
      stroke: '#0000ff',
      width: 4,
      line: 'dashed',
    },
  });
  expect(filled).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        fill: '#ff0000',
        stroke: 'none',
        strokeDasharray: undefined,
      }),
      expect.objectContaining({
        stroke: '#0000ff',
        strokeWidth: 4,
        strokeDasharray: '16 12',
      }),
    ]),
  );
  expect(
    renderer.render({
      ...rectangle,
      style: { ...initialStyle, line: 'dotted' },
    })[0]?.strokeDasharray,
  ).toBe('2 6');
  expect(renderer.render(rectangle)[0]?.strokeDasharray).toBeUndefined();
});
