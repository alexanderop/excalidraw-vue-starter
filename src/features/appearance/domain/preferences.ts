export type Preferences = {
  readonly version: 1;
  readonly theme: 'light' | 'dark';
  readonly accent: 'indigo' | 'teal' | 'rose';
};
export type Theme = Preferences['theme'];
export type Accent = Preferences['accent'];
export type PreferenceError =
  | { readonly type: 'invalid-preferences' }
  | { readonly type: 'storage-unavailable' };
export const defaultPreferences: Preferences = {
  version: 1,
  theme: 'light',
  accent: 'indigo',
};
