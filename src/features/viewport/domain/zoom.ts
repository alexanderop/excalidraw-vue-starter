export function clampZoom(value: number): number {
  return Math.max(25, Math.min(400, Math.round(value)));
}
