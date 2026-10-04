import type { ShapeStyle } from '@/shared/shapeStyle';
import {
  rectangleBounds,
  type Modifiers,
  type Point,
  type Rectangle,
} from './rectangle';
export type Gesture =
  | Readonly<{ status: 'idle' }>
  | Readonly<{
      status: 'drawing';
      pointerId: number;
      anchor: Point;
      current: Point;
      draft: Rectangle;
    }>;
export const idle: Gesture = { status: 'idle' };
export function beginGesture(
  pointerId: number,
  anchor: Point,
  style: ShapeStyle,
  identity: { id: string; seed: number },
): Gesture {
  return {
    status: 'drawing',
    pointerId,
    anchor,
    current: anchor,
    draft: {
      ...identity,
      kind: 'rectangle',
      x: anchor.x,
      y: anchor.y,
      width: 0,
      height: 0,
      style: { ...style },
    },
  };
}
export function updateGesture(
  gesture: Gesture,
  pointerId: number,
  current: Point,
  modifiers: Modifiers,
): Gesture {
  if (gesture.status === 'idle' || gesture.pointerId !== pointerId)
    return gesture;
  return {
    ...gesture,
    current,
    draft: {
      ...gesture.draft,
      ...rectangleBounds(gesture.anchor, current, modifiers),
    },
  };
}
export function finishGesture(
  gesture: Gesture,
  pointerId: number,
  point: Point,
  modifiers: Modifiers,
): Rectangle | undefined {
  const final = updateGesture(gesture, pointerId, point, modifiers);
  if (
    final.status === 'idle' ||
    final.pointerId !== pointerId ||
    final.draft.width < 2 ||
    final.draft.height < 2
  )
    return undefined;
  return final.draft;
}
