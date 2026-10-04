import { expect, it } from 'vitest';
import { render } from 'vitest-browser-vue';
import ToolPalette from '../../src/features/toolbox/ui/ToolPalette.vue';
import PropertiesPanel from '../../src/features/toolbox/ui/PropertiesPanel.vue';
import { createToolbox } from '../../src/features/toolbox/application/createToolbox';
import { localStoragePreferences } from '../../src/features/appearance/adapters/localStoragePreferences';
it('selects a tool through the real toolbar', async () => {
  const toolbox = createToolbox();
  const screen = await render(ToolPalette, { props: { toolbox } });
  await screen
    .getByRole('button', { name: 'Rectangle (R)', exact: true })
    .click();
  await expect
    .element(screen.getByRole('button', { name: 'Rectangle (R)', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Selection (V)', exact: true }))
    .toHaveAttribute('aria-pressed', 'false');
});
it('updates new-shape style through visible controls', async () => {
  const toolbox = createToolbox();
  const screen = await render(PropertiesPanel, { props: { toolbox } });
  await screen
    .getByRole('button', { name: 'Coral stroke', exact: true })
    .click();
  expect(toolbox.state.style.stroke).toBe('#e03131');
  await expect
    .element(screen.getByRole('button', { name: 'Coral stroke', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');
});
it('round-trips preferences using actual browser storage', () => {
  const key = 'folio.test.preferences';
  const storage = {
    getItem: () => localStorage.getItem(key),
    setItem: (_key: string, value: string) => localStorage.setItem(key, value),
  };
  try {
    const repository = localStoragePreferences(storage);
    expect(
      repository.save({ version: 1, theme: 'dark', accent: 'teal' }),
    ).toEqual({ ok: true, value: undefined });
    expect(repository.load()).toEqual({
      ok: true,
      value: { version: 1, theme: 'dark', accent: 'teal' },
    });
  } finally {
    localStorage.removeItem(key);
  }
});
