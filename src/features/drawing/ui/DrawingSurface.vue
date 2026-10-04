<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { documentPoint, viewportTransform } from '@/features/viewport/public';
import type { ShapeStyle } from '@/shared/shapeStyle';
import type { Drawing } from '../application/createDrawing';
import type { RectangleRenderer } from '../application/drawingPorts';
import type { Modifiers } from '../domain/rectangle';
import DrawingRectangle from './DrawingRectangle.vue';
const props = defineProps<{
  drawing: Drawing;
  renderer: RectangleRenderer;
  active: boolean;
  blocked: boolean;
  zoom: number;
  style: ShapeStyle;
}>();
const emit = defineEmits<{ committed: [] }>();
const surface = ref<SVGSVGElement | null>(null);
function modifiers(event: MouseEvent | KeyboardEvent): Modifiers {
  return { square: event.shiftKey, centered: event.altKey };
}
function point(event: PointerEvent) {
  const bounds = surface.value!.getBoundingClientRect();
  return documentPoint(
    { x: event.clientX, y: event.clientY },
    { x: bounds.left, y: bounds.top },
    props.zoom,
  );
}
function release(pointerId: number) {
  if (surface.value?.hasPointerCapture(pointerId))
    surface.value.releasePointerCapture(pointerId);
}
function cancel() {
  const gesture = props.drawing.state.gesture;
  props.drawing.cancel();
  if (gesture.status === 'drawing') release(gesture.pointerId);
}
function begin(event: PointerEvent) {
  if (
    !props.active ||
    props.blocked ||
    !event.isPrimary ||
    event.button !== 0 ||
    props.drawing.state.gesture.status !== 'idle'
  )
    return;
  event.preventDefault();
  surface.value?.focus({ preventScroll: true });
  props.drawing.begin(event.pointerId, point(event), props.style);
  try {
    surface.value?.setPointerCapture(event.pointerId);
  } catch {
    cancel();
  }
}
function update(event: PointerEvent) {
  if (props.drawing.state.gesture.status === 'idle') return;
  props.drawing.update(event.pointerId, point(event), modifiers(event));
}
function end(event: PointerEvent) {
  const result = props.drawing.end(
    event.pointerId,
    point(event),
    modifiers(event),
  );
  if (result === 'ignored') return;
  release(event.pointerId);
  if (result === 'committed') emit('committed');
}
function cancelPointer(event: PointerEvent) {
  const gesture = props.drawing.state.gesture;
  if (gesture.status === 'drawing' && gesture.pointerId === event.pointerId)
    cancel();
}
function key(event: KeyboardEvent) {
  const gesture = props.drawing.state.gesture;
  if (gesture.status === 'idle') return;
  if (event.key === 'Escape') {
    event.preventDefault();
    cancel();
  } else if (event.key === 'Shift' || event.key === 'Alt') {
    event.preventDefault();
    props.drawing.update(gesture.pointerId, gesture.current, modifiers(event));
  }
}
watch(() => [props.active, props.blocked, props.zoom], cancel, {
  flush: 'sync',
});
onMounted(() => {
  window.addEventListener('keydown', key);
  window.addEventListener('keyup', key);
  window.addEventListener('blur', cancel);
});
onBeforeUnmount(() => {
  cancel();
  window.removeEventListener('keydown', key);
  window.removeEventListener('keyup', key);
  window.removeEventListener('blur', cancel);
});
</script>
<template>
  <svg
    ref="surface"
    class="drawing-surface absolute inset-0 h-full w-full outline-none"
    :class="{ 'is-drawing-tool': active && !blocked }"
    role="region"
    aria-label="Drawing surface"
    tabindex="0"
    @pointerdown="begin"
    @pointermove="update"
    @pointerup="end"
    @pointercancel="cancelPointer"
    @lostpointercapture="cancelPointer"
  >
    <g :transform="viewportTransform(zoom)">
      <DrawingRectangle
        v-for="(rectangle, index) in drawing.state.elements"
        :key="rectangle.id"
        :rectangle="rectangle"
        :renderer="renderer"
        :label="`Rectangle ${index + 1}`"
      />
      <DrawingRectangle
        v-if="drawing.state.gesture.status === 'drawing'"
        :rectangle="drawing.state.gesture.draft"
        :renderer="renderer"
        label="Rectangle preview"
      />
    </g>
  </svg>
</template>
<style scoped>
:global([data-theme='dark'] .drawing-surface) {
  filter: invert(93%) hue-rotate(180deg);
}
.drawing-surface {
  touch-action: none;
}
.is-drawing-tool {
  cursor: crosshair;
}
.drawing-surface:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}
</style>
