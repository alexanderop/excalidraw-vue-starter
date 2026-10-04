import type { Result } from '@/shared/result';
import type { Preferences, PreferenceError } from '../domain/preferences';
export interface PreferencesPort {
  load(): Result<Preferences | null, PreferenceError>;
  save(value: Preferences): Result<void, PreferenceError>;
}
