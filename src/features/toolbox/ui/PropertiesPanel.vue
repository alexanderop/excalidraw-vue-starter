<script setup lang="ts">
import {
  ArrowDownToLine,
  ArrowDown,
  ArrowUp,
  ArrowUpToLine,
} from '@lucide/vue';
import type { Toolbox } from '../application/createToolbox';
defineProps<{ toolbox: Toolbox }>();
const colors = [
  { name: 'Ink', value: '#1e1e1e' },
  { name: 'Coral', value: '#e03131' },
  { name: 'Green', value: '#2f9e44' },
  { name: 'Blue', value: '#1971c2' },
  { name: 'Gold', value: '#f08c00' },
];
const fills = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Blush', value: '#ffc9c9' },
  { name: 'Mint', value: '#b2f2bb' },
  { name: 'Sky', value: '#a5d8ff' },
  { name: 'Cream', value: '#ffec99' },
];
</script>
<template>
  <section class="properties panel" aria-label="New shape defaults">
    <fieldset>
      <legend>Stroke</legend>
      <div class="swatches">
        <button
          v-for="color in colors"
          :key="color.name"
          :aria-label="`${color.name} stroke`"
          :aria-pressed="toolbox.state.style.stroke === color.value"
          :style="{ background: color.value }"
          @click="toolbox.updateStyle({ stroke: color.value })"
        />
        <span
          class="custom-swatch"
          :style="{ background: toolbox.state.style.stroke }"
        />
      </div>
    </fieldset>
    <fieldset>
      <legend>Background</legend>
      <div class="swatches">
        <button
          v-for="color in fills"
          :key="color.name"
          :class="{ transparent: color.value === 'transparent' }"
          :aria-label="`${color.name} fill`"
          :aria-pressed="toolbox.state.style.fill === color.value"
          :style="{ backgroundColor: color.value }"
          @click="toolbox.updateStyle({ fill: color.value })"
        />
        <span
          class="custom-swatch transparent"
          :style="{ backgroundColor: toolbox.state.style.fill }"
        />
      </div>
    </fieldset>
    <fieldset>
      <legend>Stroke width</legend>
      <div class="segments">
        <button
          v-for="width in [1, 2, 4] as const"
          :key="width"
          :aria-label="`${width}px stroke`"
          :aria-pressed="toolbox.state.style.width === width"
          @click="toolbox.updateStyle({ width })"
        >
          <span class="width-line" :style="{ height: `${width}px` }" />
        </button>
      </div>
    </fieldset>
    <fieldset>
      <legend>Stroke style</legend>
      <div class="segments">
        <button
          v-for="line in ['solid', 'dashed', 'dotted'] as const"
          :key="line"
          :aria-label="`${line} line`"
          :aria-pressed="toolbox.state.style.line === line"
          @click="toolbox.updateStyle({ line })"
        >
          <span class="style-line" :style="{ borderTopStyle: line }" />
        </button>
      </div>
    </fieldset>
    <fieldset>
      <legend>Sloppiness</legend>
      <div class="segments">
        <button
          v-for="roughness in ['clean', 'natural', 'sketch'] as const"
          :key="roughness"
          :aria-label="`${roughness} edges`"
          :aria-pressed="toolbox.state.style.roughness === roughness"
          @click="toolbox.updateStyle({ roughness })"
        >
          <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true">
            <path
              :d="
                roughness === 'clean'
                  ? 'M3 14L9 4L15 14L21 4'
                  : roughness === 'natural'
                    ? 'M3 14L8 3L16 15L21 4'
                    : 'M3 14L8 3L7 8L16 15L14 10L21 4'
              "
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </div>
    </fieldset>
    <fieldset>
      <legend>Edges</legend>
      <div class="segments">
        <button
          v-for="corners in ['sharp', 'round'] as const"
          :key="corners"
          :aria-label="`${corners} corners`"
          :aria-pressed="toolbox.state.style.corners === corners"
          @click="toolbox.updateStyle({ corners })"
        >
          <span
            class="corner-mark"
            :style="{ borderTopLeftRadius: corners === 'round' ? '9px' : '0' }"
          />
        </button>
      </div>
    </fieldset>
    <div class="opacity-label">
      <label for="opacity">Opacity</label
      ><output for="opacity">{{ toolbox.state.style.opacity }}%</output>
    </div>
    <input
      id="opacity"
      type="range"
      min="0"
      max="100"
      :value="toolbox.state.style.opacity"
      @input="
        toolbox.updateStyle({
          opacity: Number(($event.target as HTMLInputElement).value),
        })
      "
    />
    <div class="opacity-ticks"><span>0</span><span>100</span></div>
    <fieldset>
      <legend>Layers</legend>
      <div class="segments">
        <button
          v-for="(icon, index) in [
            ArrowDownToLine,
            ArrowDown,
            ArrowUp,
            ArrowUpToLine,
          ]"
          :key="index"
          disabled
          :aria-label="
            [
              'Send to back',
              'Send backward',
              'Bring forward',
              'Bring to front',
            ][index] + ' unavailable until drawing is added'
          "
        >
          <component :is="icon" :size="16" />
        </button>
      </div>
    </fieldset>
    <footer>Style settings are ready.<br />Drawing is coming next.</footer>
  </section>
</template>
