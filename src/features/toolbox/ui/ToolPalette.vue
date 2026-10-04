<script setup lang="ts">
import { ref, watch } from 'vue';
import { PopoverRoot, PopoverTrigger, PopoverContent } from 'reka-ui';
import { EllipsisVertical, Image, Frame, Sparkles } from '@lucide/vue';
import IconButton from '@/design-system/components/IconButton.vue';
import EditorIcon from '@/design-system/components/reference/EditorIcon.vue';
import { tools } from '../domain/tools';
import type { Toolbox } from '../application/createToolbox';
defineProps<{ toolbox: Toolbox }>();
const moreOpen = ref(false);
const emit = defineEmits<{ popupChange: [open: boolean] }>();
watch(moreOpen, (open) => emit('popupChange', open));
const shapeGroupOpen = ref(false);
const primary = tools.filter(
  (tool) => !['image', 'frame', 'laser'].includes(tool.id),
);
const extraIcons = { image: Image, frame: Frame, laser: Sparkles };
</script>
<template>
  <div
    class="tool-palette panel"
    role="toolbar"
    aria-label="Drawing tools"
    @keydown.esc="moreOpen = false"
  >
    <IconButton
      class="lock-tool"
      label="Keep tool selected"
      :active="toolbox.state.locked"
      :aria-pressed="toolbox.state.locked"
      @click="toolbox.toggleLock()"
      ><EditorIcon name="lock"
    /></IconButton>
    <span class="tool-divider lock-divider" />
    <IconButton
      v-for="tool in primary"
      :key="tool.id"
      :class="`tool-${tool.id}`"
      :label="`${tool.label} (${tool.shortcut})`"
      :active="toolbox.state.activeTool === tool.id"
      :aria-pressed="toolbox.state.activeTool === tool.id"
      @click="
        toolbox.selectTool(tool.id);
        shapeGroupOpen = tool.id === 'rectangle';
      "
      ><EditorIcon :name="tool.id" /><span
        v-if="tool.id !== 'hand'"
        class="tool-key"
        >{{ tool.shortcut }}</span
      ></IconButton
    >
    <span class="tool-divider extra-divider" />
    <PopoverRoot v-model:open="moreOpen"
      ><PopoverTrigger as-child
        ><IconButton label="More tools" :aria-expanded="moreOpen"
          ><EllipsisVertical :size="16" /></IconButton
      ></PopoverTrigger>
      <PopoverContent
        class="more-tools panel"
        side="top"
        :side-offset="12"
        align="end"
        @keydown.stop
        @keydown.esc.prevent="moreOpen = false"
      >
        <div v-if="moreOpen" aria-label="Additional tools">
          <button
            v-for="tool in tools.filter(
              (t) => !['hand', 'selection'].includes(t.id),
            )"
            :key="tool.id"
            :class="{
              'mobile-extra': !['image', 'frame', 'laser'].includes(tool.id),
            }"
            :aria-pressed="toolbox.state.activeTool === tool.id"
            @click="
              toolbox.selectTool(tool.id);
              moreOpen = false;
            "
          >
            <component
              :is="extraIcons[tool.id as keyof typeof extraIcons]"
              v-if="tool.id in extraIcons"
              :size="18"
            /><EditorIcon v-else :name="tool.id" />{{ tool.label
            }}<kbd>{{ tool.shortcut }}</kbd>
          </button>
        </div></PopoverContent
      ></PopoverRoot
    >
    <div
      v-if="
        shapeGroupOpen &&
        ['rectangle', 'diamond', 'ellipse'].includes(toolbox.state.activeTool)
      "
      class="shape-group panel"
      role="group"
      aria-label="Shape tools"
    >
      <IconButton
        v-for="tool in tools.filter((t) =>
          ['rectangle', 'diamond', 'ellipse'].includes(t.id),
        )"
        :key="tool.id"
        :label="`${tool.label} shape`"
        :active="toolbox.state.activeTool === tool.id"
        @click="toolbox.selectTool(tool.id)"
        ><EditorIcon :name="tool.id"
      /></IconButton>
    </div>
  </div>
</template>
