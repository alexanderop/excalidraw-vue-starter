import { createDrawing, type IdentityPort } from '@/features/drawing/public';
import { createToolbox } from '@/features/toolbox/public';
import { createViewport } from '@/features/viewport/public';
import {
  createAppearance,
  type PreferencesPort,
} from '@/features/appearance/public';
export function createEditor(
  preferences: PreferencesPort,
  identity: IdentityPort,
) {
  const toolbox = createToolbox();
  return {
    toolbox,
    drawing: createDrawing(identity),
    rectangleCommitted() {
      if (!toolbox.state.locked) toolbox.selectTool('selection');
    },
    viewport: createViewport(),
    appearance: createAppearance(preferences),
  };
}
export type Editor = ReturnType<typeof createEditor>;
