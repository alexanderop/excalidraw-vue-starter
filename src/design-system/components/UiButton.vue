<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
  }>(),
  { variant: 'secondary', disabled: false },
);
const variants = {
  primary:
    'border-transparent bg-accent text-accent-on enabled:hover:brightness-[0.94]',
  secondary:
    'bg-surface text-text border-border enabled:hover:bg-surface-hover',
  ghost:
    'border-transparent bg-transparent text-muted enabled:hover:bg-surface-hover',
} as const;
</script>
<template>
  <button
    type="button"
    :disabled="disabled"
    class="ui-button inline-flex min-h-9 items-center justify-center gap-2 rounded-control border px-[13px] py-2 text-label font-[550] whitespace-nowrap transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-40"
    :class="[`ui-button--${variant}`, variants[variant]]"
  >
    <slot />
  </button>
</template>
