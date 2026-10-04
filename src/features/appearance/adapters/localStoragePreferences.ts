import type { PreferencesPort } from '../application/preferencesPort';
import { parsePreferences } from './parsePreferences';
export function localStoragePreferences(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): PreferencesPort {
  return {
    load() {
      let raw: string | null;
      try {
        raw = storage.getItem('folio.preferences.v1');
      } catch {
        return { ok: false, error: { type: 'storage-unavailable' } };
      }
      if (raw === null) return { ok: true, value: null };
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        return { ok: false, error: { type: 'invalid-preferences' } };
      }
      return parsePreferences(data);
    },
    save(value) {
      try {
        storage.setItem('folio.preferences.v1', JSON.stringify(value));
        return { ok: true, value: undefined };
      } catch {
        return { ok: false, error: { type: 'storage-unavailable' } };
      }
    },
  };
}
