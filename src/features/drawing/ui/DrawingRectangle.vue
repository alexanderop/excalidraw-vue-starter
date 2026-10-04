<script setup lang="ts">
import { computed } from 'vue';
import type { Rectangle } from '../domain/rectangle';
import type { RectangleRenderer } from '../application/drawingPorts';
const props = defineProps<{
  rectangle: Rectangle;
  renderer: RectangleRenderer;
  label: string;
}>();
const paths = computed(() => props.renderer.render(props.rectangle));
</script>
<template>
  <g
    role="img"
    :aria-label="label"
    :opacity="rectangle.style.opacity / 100"
    pointer-events="none"
  >
    <path
      v-for="(path, index) in paths"
      :key="index"
      :d="path.d"
      :fill="path.fill"
      :stroke="path.stroke"
      :stroke-width="path.strokeWidth"
      :stroke-dasharray="path.strokeDasharray"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</template>
