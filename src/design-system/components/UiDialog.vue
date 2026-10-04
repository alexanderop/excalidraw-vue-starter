<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui';
import { watch } from 'vue';
import { X } from '@lucide/vue';
const props = defineProps<{
  open: boolean;
  side?: boolean;
  title: string;
  description: string;
}>();
let opener: HTMLElement | null = null;
watch(
  () => props.open,
  (open) => {
    if (open)
      opener =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
  },
  { flush: 'sync' },
);
function restoreFocus(event: Event) {
  event.preventDefault();
  opener?.focus();
}
defineEmits<{ 'update:open': [open: boolean] }>();
</script>
<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" :class="{ 'side-overlay': side }" />
      <DialogContent
        class="dialog-content"
        :class="{ 'side-dialog': side }"
        @close-auto-focus="restoreFocus"
      >
        <div class="pr-8" :class="{ 'sr-only': side }">
          <DialogTitle class="text-xl font-semibold tracking-tight">{{
            title
          }}</DialogTitle
          ><DialogDescription class="mt-2 text-sm leading-relaxed text-muted">{{
            description
          }}</DialogDescription>
        </div>
        <DialogClose class="dialog-close" aria-label="Close dialog"
          ><X :size="18"
        /></DialogClose>
        <div :class="side ? 'side-content' : 'mt-6'"><slot /></div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: var(--overlay);
  backdrop-filter: blur(3px);
}
.dialog-content {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(480px, calc(100vw - 32px));
  max-height: calc(100dvh - 48px);
  overflow: auto;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-dialog);
  padding: 28px;
  box-shadow: var(--shadow-dialog);
}
.dialog-close {
  position: absolute;
  top: 20px;
  right: 20px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  color: var(--muted);
  background: transparent;
  border: 0;
  border-radius: var(--radius-control);
}
.dialog-close:hover {
  background: var(--surface-hover);
  color: var(--text);
}
.side-overlay {
  background: transparent;
  backdrop-filter: none;
}
.side-dialog {
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  transform: none;
  width: 294px;
  max-height: none;
  padding: 16px;
  border-radius: 0;
}
.side-content {
  height: 100%;
}
.side-dialog .dialog-close {
  top: 16px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: var(--surface-hover);
  z-index: 1;
}
@media (max-width: 740px) {
  .side-dialog {
    top: 52px;
    right: 12px;
    bottom: 64px;
    width: calc(100vw - 24px);
  }
}
</style>
