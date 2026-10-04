import { describe, expect, it } from 'vitest';
import { localStoragePreferences } from '../../src/features/appearance/adapters/localStoragePreferences';
import { createAppearance } from '../../src/features/appearance/application/createAppearance';
import { clampZoom } from '../../src/features/viewport/domain/zoom';
import { toolForShortcut } from '../../src/features/toolbox/domain/tools';
describe('saved appearance boundary', () => {
  it('rejects unsupported versions and malformed settings', () => {
    for (const raw of [
      'not json',
      '{"version":2,"theme":"dark","accent":"rose"}',
      '{"version":1,"theme":"unexpected","accent":"rose"}',
    ]) {
      const port = localStoragePreferences({
        getItem: () => raw,
        setItem: () => {},
      });
      expect(port.load()).toEqual({
        ok: false,
        error: { type: 'invalid-preferences' },
      });
    }
  });
  it('keeps changes usable when storage cannot be written', () => {
    const appearance = createAppearance({
      load: () => ({ ok: true, value: null }),
      save: () => ({ ok: false, error: { type: 'storage-unavailable' } }),
    });
    appearance.setTheme('dark');
    expect(appearance.state.preferences.theme).toBe('dark');
    expect(appearance.state.error).toEqual({ type: 'storage-unavailable' });
  });
  it('returns storage failure when browser access is denied', () => {
    const port = localStoragePreferences({
      getItem: () => {
        throw new DOMException('Denied', 'SecurityError');
      },
      setItem: () => {},
    });
    expect(port.load()).toEqual({
      ok: false,
      error: { type: 'storage-unavailable' },
    });
  });
});
it('keeps zoom in its usable range', () => {
  expect(clampZoom(0)).toBe(25);
  expect(clampZoom(401)).toBe(400);
  expect(clampZoom(125.3)).toBe(125);
});
it('accepts upper and lower case shortcuts and ignores unrelated keys', () => {
  expect(toolForShortcut('R')).toBe('rectangle');
  expect(toolForShortcut('r')).toBe('rectangle');
  expect(toolForShortcut('Enter')).toBeUndefined();
});
