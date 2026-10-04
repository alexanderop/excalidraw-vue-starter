import { reactive, readonly } from 'vue';
import { initialStyle, type DraftStyle, type ToolId } from '../domain/tools';
export function createToolbox() {
  const state = reactive({
    activeTool: 'selection' as ToolId,
    locked: false,
    style: initialStyle,
  });
  return {
    state: readonly(state),
    selectTool(tool: ToolId) {
      state.activeTool = tool;
    },
    toggleLock() {
      state.locked = !state.locked;
    },
    updateStyle(patch: Partial<DraftStyle>) {
      state.style = {
        ...state.style,
        ...patch,
        opacity: Math.max(
          0,
          Math.min(100, patch.opacity ?? state.style.opacity),
        ),
      };
    },
  };
}
export type Toolbox = ReturnType<typeof createToolbox>;
