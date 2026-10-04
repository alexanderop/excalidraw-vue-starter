import type { Rectangle } from '../domain/rectangle';
export interface IdentityPort {
  next(): Readonly<{ id: string; seed: number }>;
}
export type SvgPath = Readonly<{
  d: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}>;
export interface RectangleRenderer {
  render(rectangle: Rectangle): readonly SvgPath[];
}
