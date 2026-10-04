import type { ShapeStyle } from '@/shared/shapeStyle';
export type Point = Readonly<{ x: number; y: number }>;
export type Modifiers = Readonly<{ square: boolean; centered: boolean }>;
export type Rectangle = Readonly<{
  id: string;
  seed: number;
  kind: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  style: ShapeStyle;
}>;
export function rectangleBounds(
  anchor: Point,
  current: Point,
  modifiers: Modifiers,
) {
  let dx = current.x - anchor.x;
  let dy = current.y - anchor.y;
  if (modifiers.square) {
    const side = Math.max(Math.abs(dx), Math.abs(dy));
    dx = (dx < 0 ? -1 : 1) * side;
    dy = (dy < 0 ? -1 : 1) * side;
  }
  return {
    x: modifiers.centered
      ? anchor.x - Math.abs(dx)
      : Math.min(anchor.x, anchor.x + dx),
    y: modifiers.centered
      ? anchor.y - Math.abs(dy)
      : Math.min(anchor.y, anchor.y + dy),
    width: Math.abs(dx) * (modifiers.centered ? 2 : 1),
    height: Math.abs(dy) * (modifiers.centered ? 2 : 1),
  };
}
