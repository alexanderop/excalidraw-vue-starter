<script setup lang="ts">
import { ref } from 'vue';
const element = ref<HTMLButtonElement | null>(null);
defineExpose({ focus: () => element.value?.focus() });
withDefaults(
  defineProps<{ label: string; active?: boolean; disabled?: boolean }>(),
  { active: false, disabled: false },
);
</script>
<template>
  <button
    ref="element"
    type="button"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    :aria-pressed="active || undefined"
    class="icon-button inline-flex size-9 shrink-0 items-center justify-center rounded-control border-0 transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-35 [&_svg]:size-[18px] [&_svg]:stroke-[1.7]"
    :class="[
      active
        ? 'is-active bg-accent-soft text-accent'
        : 'bg-transparent text-muted enabled:hover:bg-surface-hover enabled:hover:text-text',
    ]"
  >
    <slot />
  </button>
</template>
