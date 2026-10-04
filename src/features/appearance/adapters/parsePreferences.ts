import * as v from 'valibot';
import type { Result } from '@/shared/result';
import type { Preferences, PreferenceError } from '../domain/preferences';
const preferencesSchema = v.object({
  version: v.literal(1),
  theme: v.picklist(['light', 'dark']),
  accent: v.picklist(['indigo', 'teal', 'rose']),
});
export function parsePreferences(
  input: unknown,
): Result<Preferences, PreferenceError> {
  const result = v.safeParse(preferencesSchema, input);
  return result.success
    ? { ok: true, value: result.output }
    : { ok: false, error: { type: 'invalid-preferences' } };
}
