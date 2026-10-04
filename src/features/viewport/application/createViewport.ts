import { reactive, readonly } from 'vue';
import { clampZoom } from '../domain/zoom';
export function createViewport() {
  const state = reactive({ zoom: 100, grid: false });
  return {
    state: readonly(state),
    zoomIn() {
      state.zoom = clampZoom(state.zoom + 25);
    },
    zoomOut() {
      state.zoom = clampZoom(state.zoom - 25);
    },
    resetZoom() {
      state.zoom = 100;
    },
    toggleGrid() {
      state.grid = !state.grid;
    },
  };
}
