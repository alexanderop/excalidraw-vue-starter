import { createToolbox } from '@/features/toolbox/public';
import { createViewport } from '@/features/viewport/public';
import {
  createAppearance,
  type PreferencesPort,
} from '@/features/appearance/public';
export function createEditor(preferences: PreferencesPort) {
  return {
    toolbox: createToolbox(),
    viewport: createViewport(),
    appearance: createAppearance(preferences),
  };
}
export type Editor = ReturnType<typeof createEditor>;
