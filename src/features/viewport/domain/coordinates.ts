export type ViewportPoint = Readonly<{ x: number; y: number }>;
export function documentPoint(
  point: ViewportPoint,
  origin: ViewportPoint,
  zoom: number,
): ViewportPoint {
  return {
    x: (point.x - origin.x) / (zoom / 100),
    y: (point.y - origin.y) / (zoom / 100),
  };
}
export function viewportTransform(zoom: number): string {
  return `scale(${zoom / 100})`;
}
