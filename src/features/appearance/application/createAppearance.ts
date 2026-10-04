import { reactive, readonly } from 'vue';
import {
  defaultPreferences,
  type Accent,
  type Theme,
  type PreferenceError,
} from '../domain/preferences';
import type { PreferencesPort } from './preferencesPort';
export function createAppearance(port: PreferencesPort) {
  const loaded = port.load();
  const state = reactive({
    preferences: loaded.ok
      ? (loaded.value ?? defaultPreferences)
      : defaultPreferences,
    error: loaded.ok ? null : (loaded.error as PreferenceError | null),
  });
  function save() {
    const result = port.save(state.preferences);
    state.error = result.ok ? null : result.error;
  }
  return {
    state: readonly(state),
    setTheme(theme: Theme) {
      state.preferences = { ...state.preferences, theme };
      save();
    },
    setAccent(accent: Accent) {
      state.preferences = { ...state.preferences, accent };
      save();
    },
  };
}
