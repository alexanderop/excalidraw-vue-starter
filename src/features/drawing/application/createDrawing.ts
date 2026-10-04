import { reactive, readonly } from 'vue';
import type { ShapeStyle } from '@/shared/shapeStyle';
import {
  beginGesture,
  finishGesture,
  idle,
  updateGesture,
  type Gesture,
} from '../domain/gesture';
import type { Modifiers, Point, Rectangle } from '../domain/rectangle';
import type { IdentityPort } from './drawingPorts';
export function createDrawing(identity: IdentityPort) {
  const state = reactive<{ elements: readonly Rectangle[]; gesture: Gesture }>({
    elements: [],
    gesture: idle,
  });
  return {
    state: readonly(state),
    begin(pointerId: number, point: Point, style: ShapeStyle) {
      if (state.gesture.status === 'drawing') return;
      state.gesture = beginGesture(pointerId, point, style, identity.next());
    },
    update(pointerId: number, point: Point, modifiers: Modifiers) {
      state.gesture = updateGesture(state.gesture, pointerId, point, modifiers);
    },
    end(
      pointerId: number,
      point: Point,
      modifiers: Modifiers,
    ): 'committed' | 'discarded' | 'ignored' {
      if (
        state.gesture.status === 'idle' ||
        state.gesture.pointerId !== pointerId
      )
        return 'ignored';
      const rectangle = finishGesture(
        state.gesture,
        pointerId,
        point,
        modifiers,
      );
      state.gesture = idle;
      if (!rectangle) return 'discarded';
      state.elements = [...state.elements, rectangle];
      return 'committed';
    },
    cancel() {
      state.gesture = idle;
    },
  };
}
export type Drawing = ReturnType<typeof createDrawing>;
