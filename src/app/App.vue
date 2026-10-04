<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import {
  FolderOpen,
  Users,
  ShieldCheck,
  BookOpen,
  CircleHelp,
  Grid2X2,
  Minus,
  Moon,
  Plus,
  SlidersHorizontal,
  Sun,
  X,
} from '@lucide/vue';
import {
  ToolPalette,
  PropertiesPanel,
  tools,
  toolForShortcut,
} from '@/features/toolbox/public';
import { localStoragePreferences } from '@/features/appearance/public';
import { LibraryPanel } from '@/features/library/public';
import { DesignSystemPage } from '@/features/design-preview/public';
import ChromeIcon from '@/design-system/components/reference/ChromeIcon.vue';
import IconButton from '@/design-system/components/IconButton.vue';
import UiButton from '@/design-system/components/UiButton.vue';
import UiDialog from '@/design-system/components/UiDialog.vue';
import { createEditor } from './createEditor';
const editor = createEditor(
  localStoragePreferences({
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
  }),
);
const { toolbox, viewport, appearance } = editor;
const screen = ref<'editor' | 'design'>('editor');
const overlay = ref<'help' | 'library' | 'menu' | null>(null);
const propertiesOpen = ref(false);
const stylesTrigger = ref<InstanceType<typeof IconButton> | null>(null);
const overlayContent = {
  menu: {
    title: 'Workspace',
    description:
      'Your canvas essentials. Document actions arrive with drawing.',
  },
  library: {
    title: 'Your library',
    description: 'A home for reusable shapes and ideas.',
  },
  help: {
    title: 'Make yourself at home',
    description:
      'Choose a tool with a single key. Drawing will arrive in the next iteration.',
  },
};
function closeStyles() {
  propertiesOpen.value = false;
  stylesTrigger.value?.focus();
}
const menuPopover = ref(false);
function closeMenu() {
  menuPopover.value = false;
  menuTrigger.value?.focus();
}
const menuTrigger = ref<InstanceType<typeof IconButton> | null>(null);
function openMenuHelp() {
  menuPopover.value = false;
  menuTrigger.value?.focus();
  overlay.value = 'help';
}
const title = ref('Untitled canvas');
watchEffect(() => {
  document.documentElement.dataset.theme = appearance.state.preferences.theme;
  document.documentElement.dataset.accent = appearance.state.preferences.accent;
});
function handleKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuPopover.value) {
    closeMenu();
    return;
  }
  if (event.key === 'Escape' && !overlay.value && propertiesOpen.value) {
    event.preventDefault();
    closeStyles();
    return;
  }
  if (
    screen.value !== 'editor' ||
    overlay.value ||
    menuPopover.value ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    (event.target instanceof HTMLElement &&
      (event.target.matches('input, textarea, select') ||
        event.target.isContentEditable))
  )
    return;
  const tool = toolForShortcut(event.key);
  if (tool) {
    event.preventDefault();
    toolbox.selectTool(tool);
  }
  if (event.key === '?') {
    event.preventDefault();
    overlay.value = 'help';
  }
}
onMounted(() => window.addEventListener('keydown', handleKey));
onUnmounted(() => window.removeEventListener('keydown', handleKey));
</script>
<template>
  <DesignSystemPage
    v-if="screen === 'design'"
    :theme="appearance.state.preferences.theme"
    :accent="appearance.state.preferences.accent"
    @back="screen = 'editor'"
    @set-theme="appearance.setTheme"
    @set-accent="appearance.setAccent"
  />
  <div
    v-else
    class="editor-shell relative h-dvh min-h-80 overflow-hidden bg-canvas text-text"
  >
    <header
      class="app-header pointer-events-none absolute inset-x-4 top-4 z-10 flex justify-between [&>*]:pointer-events-auto"
    >
      <div class="brand-group flex items-center">
        <IconButton
          ref="menuTrigger"
          label="Workspace menu"
          :aria-expanded="menuPopover"
          @click="menuPopover = !menuPopover"
          ><ChromeIcon name="menu"
        /></IconButton>
      </div>
      <div class="header-actions flex items-center gap-2">
        <UiButton class="upgrade-button" disabled>Upgrade</UiButton
        ><UiButton
          class="share-button"
          variant="primary"
          disabled
          aria-label="Share unavailable in this foundation"
          >Share</UiButton
        ><IconButton label="Library" @click="overlay = 'library'"
          ><ChromeIcon name="library"
        /></IconButton>
      </div>
    </header>
    <div v-if="menuPopover" class="menu-dismiss" @click="menuPopover = false" />
    <section
      v-if="menuPopover"
      class="editor-menu panel"
      aria-label="Workspace menu"
      @keydown.esc.stop.prevent="closeMenu()"
    >
      <label class="menu-name"
        >Canvas name<input
          v-model="title"
          aria-label="Canvas name"
          maxlength="80"
      /></label>
      <button disabled><FolderOpen :size="16" />Open <kbd>⌘ O</kbd></button
      ><button disabled>Save to…</button><button disabled>Export image…</button
      ><button disabled><Users :size="16" />Live collaboration…</button>
      <button aria-label="Help and shortcuts" @click="openMenuHelp()">
        <CircleHelp :size="16" />Help and shortcuts <kbd>?</kbd>
      </button>
      <hr />
      <button
        @click="
          menuPopover = false;
          screen = 'design';
        "
      >
        <BookOpen :size="16" />Design system
      </button>
      <button
        :aria-label="
          appearance.state.preferences.theme === 'light'
            ? 'Switch to dark theme'
            : 'Switch to light theme'
        "
        @click="
          appearance.setTheme(
            appearance.state.preferences.theme === 'light' ? 'dark' : 'light',
          )
        "
      >
        <Sun
          v-if="appearance.state.preferences.theme === 'dark'"
          :size="16"
        /><Moon v-else :size="16" />Theme
        <span>{{ appearance.state.preferences.theme }}</span>
      </button>
      <button
        :aria-pressed="viewport.state.grid"
        @click="viewport.toggleGrid()"
      >
        <Grid2X2 :size="16" />Canvas grid
      </button>
      <p class="menu-scope">UI foundation · Drawing comes next</p>
    </section>
    <main
      class="canvas-area absolute inset-0"
      :class="{ 'with-grid': viewport.state.grid }"
      :style="{
        backgroundSize: `${(20 * viewport.state.zoom) / 100}px ${(20 * viewport.state.zoom) / 100}px`,
      }"
      aria-label="Canvas workspace"
    >
      <div class="workspace-controls">
        <ToolPalette :toolbox="toolbox" />
        <div
          v-if="
            !['selection', 'hand', 'eraser', 'laser'].includes(
              toolbox.state.activeTool,
            )
          "
          class="mobile-properties"
        >
          <span
            class="mobile-stroke"
            :style="{ background: toolbox.state.style.stroke }"
          /><span
            class="mobile-fill transparent"
            :style="{ backgroundColor: toolbox.state.style.fill }"
          />
          <IconButton
            ref="stylesTrigger"
            label="Shape styles"
            :active="propertiesOpen"
            :aria-expanded="propertiesOpen"
            @click="propertiesOpen = !propertiesOpen"
            ><SlidersHorizontal :size="18"
          /></IconButton>
        </div>
        <div
          v-if="
            !['selection', 'hand', 'eraser', 'laser'].includes(
              toolbox.state.activeTool,
            ) || propertiesOpen
          "
          class="properties-wrap"
          :class="{ 'is-open': propertiesOpen }"
        >
          <button
            class="properties-close"
            aria-label="Close styles"
            @click="closeStyles"
          >
            <X :size="18" /></button
          ><PropertiesPanel :toolbox="toolbox" />
        </div>
      </div>
      <p class="interaction-hint scope-hint">
        UI foundation — drawing comes next
      </p>
    </main>
    <footer class="editor-footer">
      <div class="footer-left flex items-center">
        <div class="zoom-group panel flex items-center">
          <IconButton
            label="Zoom out"
            :disabled="viewport.state.zoom === 25"
            @click="viewport.zoomOut()"
            ><Minus :size="16" /></IconButton
          ><button
            class="zoom-value"
            aria-label="Reset zoom"
            @click="viewport.resetZoom()"
          >
            {{ viewport.state.zoom }}%</button
          ><IconButton
            label="Zoom in"
            :disabled="viewport.state.zoom === 400"
            @click="viewport.zoomIn()"
            ><Plus :size="16"
          /></IconButton>
        </div>
        <div
          class="history-group panel flex items-center"
          title="History becomes available when drawing is added"
        >
          <IconButton label="Undo unavailable until drawing is added" disabled
            ><ChromeIcon name="undo" /></IconButton
          ><IconButton label="Redo unavailable until drawing is added" disabled
            ><ChromeIcon name="redo"
          /></IconButton>
        </div>
      </div>
      <div class="footer-right flex items-center">
        <span
          class="foundation-indicator"
          title="Local UI foundation — drawing is not implemented"
          ><ShieldCheck :size="18" /></span
        ><IconButton label="Help and shortcuts" @click="overlay = 'help'"
          ><CircleHelp :size="16"
        /></IconButton>
      </div>
    </footer>
    <div v-if="appearance.state.error" class="preference-warning" role="status">
      {{
        appearance.state.error.type === 'invalid-preferences'
          ? 'Saved appearance could not be read. Default settings are in use.'
          : 'Appearance changes are available for this session, but could not be saved.'
      }}
    </div>
  </div>
  <UiDialog
    :open="overlay !== null"
    :side="overlay === 'library'"
    :title="overlayContent[overlay ?? 'menu'].title"
    :description="overlayContent[overlay ?? 'menu'].description"
    @update:open="!$event && (overlay = null)"
  >
    <div v-if="overlay === 'menu'" class="workspace-menu">
      <UiButton disabled>New canvas</UiButton
      ><UiButton disabled>Open document</UiButton
      ><UiButton disabled>Export image</UiButton>
      <hr />
      <UiButton
        @click="
          overlay = null;
          screen = 'design';
        "
        >Design system</UiButton
      ><UiButton @click="overlay = 'help'">Help and shortcuts</UiButton>
    </div>
    <LibraryPanel v-else-if="overlay === 'library'" />
    <template v-else-if="overlay === 'help'"
      ><div class="shortcut-grid">
        <div v-for="tool in tools" :key="tool.id">
          <span>{{ tool.label }}</span
          ><kbd>{{ tool.shortcut }}</kbd>
        </div>
        <div><span>Open this help</span><kbd>?</kbd></div>
      </div>
      <p class="help-note">
        Shortcuts pause while you type or use a dialog.
      </p></template
    >
  </UiDialog>
</template>
