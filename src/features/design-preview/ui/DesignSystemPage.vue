<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowLeft,
  ArrowUpRight,
  MousePointer2,
  Square,
  Circle,
  Sun,
  Moon,
  Plus,
  Check,
  Layers,
} from '@lucide/vue';
import UiButton from '../../../design-system/components/UiButton.vue';
import IconButton from '../../../design-system/components/IconButton.vue';
import UiDialog from '../../../design-system/components/UiDialog.vue';
defineProps<{ theme: 'light' | 'dark'; accent: 'indigo' | 'teal' | 'rose' }>();
defineEmits<{
  back: [];
  setTheme: [theme: 'light' | 'dark'];
  setAccent: [accent: 'indigo' | 'teal' | 'rose'];
}>();
const dialogOpen = ref(false);
const demoTool = ref('select');
const accents = ['indigo', 'teal', 'rose'] as const;
const colors = [
  { name: 'Canvas', token: '--canvas', purpose: 'The space to think' },
  { name: 'Surface', token: '--surface', purpose: 'Panels and controls' },
  { name: 'Text', token: '--text', purpose: 'Primary content' },
  { name: 'Muted', token: '--muted', purpose: 'Supporting content' },
  { name: 'Accent', token: '--accent', purpose: 'Actions and selection' },
  {
    name: 'Accent soft',
    token: '--accent-soft',
    purpose: 'Selected backgrounds',
  },
  { name: 'Border', token: '--border', purpose: 'Quiet separation' },
  { name: 'Focus', token: '--focus', purpose: 'Keyboard navigation' },
];
</script>
<template>
  <div class="min-h-dvh bg-canvas text-text">
    <header
      class="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface px-5 py-4 sm:px-10"
    >
      <UiButton variant="ghost" @click="$emit('back')"
        ><ArrowLeft :size="16" /> Back to canvas</UiButton
      >
      <div class="flex items-center gap-2">
        <span class="hidden text-xs text-muted sm:block">Appearance</span
        ><IconButton
          :label="
            theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
          "
          @click="$emit('setTheme', theme === 'light' ? 'dark' : 'light')"
          ><Moon v-if="theme === 'light'" /><Sun v-else
        /></IconButton>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10 sm:pt-16">
      <div class="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div class="max-w-xl">
          <p class="eyebrow mb-4">Editor / Design foundations</p>
          <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
            A little structure.<br /><span class="text-muted"
              >Room for everything.</span
            >
          </h1>
          <p class="mt-5 max-w-md text-sm leading-7 text-muted">
            The colors, details, and components that make Editor feel like one
            thoughtful workspace. Change them here. See them on your canvas.
          </p>
        </div>
        <div class="folio-panel p-4">
          <p class="eyebrow mb-3">Make it yours</p>
          <div class="flex gap-2" role="group" aria-label="Accent color">
            <button
              v-for="choice in accents"
              :key="choice"
              type="button"
              :aria-label="`${choice} accent`"
              :aria-pressed="accent === choice"
              class="accent-choice"
              :class="{ selected: accent === choice }"
              @click="$emit('setAccent', choice)"
            >
              <span
                class="accent-dot"
                :style="{ background: `var(--palette-${choice})` }"
                ><Check v-if="accent === choice" :size="12" /></span
              >{{ choice }}
            </button>
          </div>
        </div>
      </div>
      <section aria-labelledby="colors-title" class="mb-12">
        <div class="section-heading">
          <div>
            <p class="eyebrow">01 / Color</p>
            <h2 id="colors-title">A palette with a purpose</h2>
          </div>
          <span class="text-xs text-muted"
            >{{ theme === 'light' ? 'Light' : 'Dark' }} theme · live
            tokens</span
          >
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="color in colors"
            :key="color.token"
            class="overflow-hidden rounded-panel border border-border bg-surface"
          >
            <div
              class="h-20 border-b border-border"
              :style="{ background: `var(${color.token})` }"
            />
            <div class="p-4">
              <h3 class="text-sm font-medium">{{ color.name }}</h3>
              <p class="mt-1 text-xs text-muted">{{ color.purpose }}</p>
              <code class="mt-3 block text-[10px] text-muted">{{
                color.token
              }}</code>
            </div>
          </div>
        </div>
      </section>
      <div class="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="type-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">02 / Typography</p>
              <h2 id="type-title">Clear at every size</h2>
            </div>
          </div>
          <div class="folio-panel space-y-6 p-6">
            <div>
              <p class="eyebrow mb-2">Display · --type-display / Semibold</p>
              <p class="text-display font-semibold tracking-tight">
                Ideas start here.
              </p>
            </div>
            <div>
              <p class="eyebrow mb-2">Heading · --type-heading / Semibold</p>
              <p class="text-heading font-semibold tracking-tight">
                Give your thoughts some space.
              </p>
            </div>
            <div>
              <p class="eyebrow mb-2">Body · --type-body / Regular</p>
              <p class="text-body leading-6 text-muted">
                A calm workspace makes the important things easier to see. Every
                detail should help you find your way.
              </p>
            </div>
            <div class="border-t border-border pt-4">
              <p class="eyebrow">Caption · --type-caption / Tracked</p>
            </div>
          </div>
        </section>
        <section aria-labelledby="spacing-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">03 / Space & shape</p>
              <h2 id="spacing-title">A consistent rhythm</h2>
            </div>
          </div>
          <div class="folio-panel p-6">
            <div class="flex h-24 items-end gap-4">
              <div
                v-for="space in [1, 2, 3, 4, 6, 8, 12]"
                :key="space"
                class="flex flex-col items-center gap-3"
              >
                <div
                  class="w-5 rounded-sm bg-accent-soft"
                  :style="{
                    height: `var(--space-${space})`,
                    borderTop: '2px solid var(--accent)',
                  }"
                />
                <span class="text-[10px] text-muted">{{ space }}×</span>
              </div>
            </div>
            <div
              class="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6"
            >
              <div
                v-for="shape in [
                  { label: 'Control', radius: 'control', value: 8 },
                  { label: 'Panel', radius: 'panel', value: 14 },
                  { label: 'Dialog', radius: 'dialog', value: 20 },
                ]"
                :key="shape.radius"
              >
                <div
                  class="mb-3 h-16 border border-border-strong bg-canvas"
                  :style="{ borderRadius: `var(--radius-${shape.radius})` }"
                />
                <p class="text-xs font-medium">{{ shape.label }}</p>
                <p class="mt-1 text-[10px] text-muted">
                  --radius-{{ shape.radius }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section aria-labelledby="components-title" class="mt-12">
        <div class="section-heading">
          <div>
            <p class="eyebrow">04 / Components</p>
            <h2 id="components-title">The actual building blocks</h2>
          </div>
          <span class="hidden text-xs text-muted sm:block"
            >Try them. Tab through them.</span
          >
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="folio-panel p-6">
            <p class="mb-5 text-sm font-medium">Buttons & states</p>
            <div class="flex flex-wrap gap-3">
              <UiButton variant="primary" @click="dialogOpen = true"
                ><Plus :size="15" /> Open preview</UiButton
              ><UiButton @click="dialogOpen = true"
                >Secondary <ArrowUpRight :size="14" /></UiButton
              ><UiButton variant="ghost" @click="dialogOpen = true"
                >Quiet action</UiButton
              ><UiButton disabled>Unavailable</UiButton>
            </div>
            <p class="mt-5 text-xs leading-5 text-muted">
              Hover for feedback. Use Tab to inspect focus. Disabled actions
              remain visibly unavailable.
            </p>
          </div>
          <div class="folio-panel p-6">
            <p class="mb-5 text-sm font-medium">Tool selection</p>
            <div
              class="inline-flex gap-1 rounded-panel border border-border p-1.5"
              role="group"
              aria-label="Preview tools"
            >
              <IconButton
                label="Preview selection"
                :active="demoTool === 'select'"
                @click="demoTool = 'select'"
                ><MousePointer2 /></IconButton
              ><IconButton
                label="Preview rectangle"
                :active="demoTool === 'rectangle'"
                @click="demoTool = 'rectangle'"
                ><Square /></IconButton
              ><IconButton
                label="Preview ellipse"
                :active="demoTool === 'ellipse'"
                @click="demoTool = 'ellipse'"
                ><Circle /></IconButton
              ><span class="mx-1 border-l border-border" /><IconButton
                label="Preview layers unavailable"
                disabled
                ><Layers
              /></IconButton>
            </div>
            <p class="mt-4 text-xs text-muted">
              Shared controls, selected states, and icon proportions.
            </p>
          </div>
        </div>
      </section>
      <footer
        class="mt-12 flex items-center justify-between border-t border-border pt-6 text-xs text-muted"
      >
        <span>Editor design system</span><span>Built into the workspace.</span>
      </footer>
    </main>
    <UiDialog
      :open="dialogOpen"
      title="Details make the difference."
      description="This is the same dialog used throughout Editor. Keyboard focus stays inside until you close it."
      @update:open="dialogOpen = $event"
      ><div class="flex justify-end">
        <UiButton variant="primary" @click="dialogOpen = false"
          >Looks good</UiButton
        >
      </div></UiDialog
    >
  </div>
</template>
<style scoped>
.section-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}
.section-heading h2 {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
}
.accent-choice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--muted);
  padding: 7px 9px;
  font-size: 11px;
  text-transform: capitalize;
}
.accent-choice.selected {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}
.accent-dot {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: white;
}
</style>
