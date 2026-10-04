import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const workspace = process.cwd();
const fixtures = mkdtempSync(path.join(tmpdir(), 'folio-boundaries-'));
afterAll(() => rmSync(fixtures, { recursive: true, force: true }));

function lint(name: string, file: string, contents: string) {
  const root = path.join(fixtures, name);
  const target = path.join(root, 'src', file);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, contents);
  const config = path.join(root, '.oxlintrc.json');
  writeFileSync(
    config,
    JSON.stringify({
      categories: { correctness: 'off' },
      jsPlugins: [
        {
          name: 'folio-architecture',
          specifier: path.join(workspace, 'tooling/architecture/plugin.mjs'),
        },
      ],
      rules: { 'folio-architecture/boundaries': 'error' },
    }),
  );
  const result = spawnSync(
    process.execPath,
    [
      path.join(workspace, 'node_modules/oxlint/bin/oxlint'),
      '-c',
      config,
      'src',
    ],
    { cwd: root, encoding: 'utf8' },
  );
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

describe('architecture enforcement through real Oxlint', () => {
  it.each([
    [
      'alias',
      'features/a/ui/View.vue',
      '<script setup lang="ts">import "@/features/b/domain/private";</script>',
    ],
    [
      'relative',
      'features/a/ui/View.vue',
      '<script setup lang="ts">import "../../b/domain/private";</script>',
    ],
    [
      'dynamic',
      'features/a/ui/View.vue',
      '<script setup lang="ts">void import("@/features/b/ui/Private.vue");</script>',
    ],
    [
      'template-import',
      'features/a/ui/View.vue',
      '<script setup lang="ts">void import(`@/features/b/domain/private`);</script>',
    ],
    [
      'type-import',
      'features/a/domain/model.ts',
      'export type Value = import("@/features/b/domain/private").Value;',
    ],
    [
      'named-export',
      'features/a/public.ts',
      'export { value } from "@/features/b/domain/private";',
    ],
    [
      'vue-export',
      'features/a/ui/View.vue',
      '<script lang="ts">export * from "@/features/b/domain/private";</script>',
    ],
    [
      'require',
      'features/a/application/controller.ts',
      'export const value = require("@/features/b/domain/private");',
    ],
    [
      'normalized-bypass',
      'features/a/ui/View.vue',
      '<script setup lang="ts">import "@/features/b/public/../domain/private";</script>',
    ],
    ['domain-own-public', 'features/a/domain/model.ts', 'import "../public";'],
    [
      'domain-other-public',
      'features/a/domain/model.ts',
      'import "@/features/b/public";',
    ],
    [
      'domain-design-system',
      'features/a/domain/model.ts',
      'import "@/design-system/components/Button.vue";',
    ],
    [
      'application-own-public',
      'features/a/application/controller.ts',
      'import "../public";',
    ],
    ['domain-vue', 'features/a/domain/model.ts', 'import "vue";'],
    ['domain-ui', 'features/a/domain/model.ts', 'import "../ui/View.vue";'],
    [
      'domain-app',
      'features/a/domain/model.ts',
      'import "../application/controller";',
    ],
    [
      'application-adapter',
      'features/a/application/controller.ts',
      'import "../adapters/storage";',
    ],
    ['shared-feature', 'shared/helper.ts', 'import "@/features/b/public";'],
    [
      'design-app',
      'design-system/ui/Button.vue',
      '<script setup lang="ts">import "@/app/createEditor";</script>',
    ],
  ])('rejects %s', (name, file, contents) => {
    const result = lint(name, file, contents);
    expect(result.output).toContain('folio-architecture(boundaries)');
    expect(result.status).toBe(1);
  });

  it.each([
    [
      'public-alias',
      'features/a/ui/View.vue',
      '<script setup lang="ts">import "@/features/b/public";</script>',
    ],
    [
      'public-relative',
      'features/a/ui/View.vue',
      '<script setup lang="ts">void import("../../b/public.ts");</script>',
    ],
    [
      'public-export',
      'app/composition.ts',
      'export * from "@/features/b/public";',
    ],
    [
      'same-feature',
      'features/a/ui/View.vue',
      '<script setup lang="ts">import "../application/controller";</script>',
    ],
    [
      'inward-adapter',
      'features/a/adapters/storage.ts',
      'import "../application/ports/storage";',
    ],
    [
      'domain-shared',
      'features/a/domain/model.ts',
      'import "@/shared/geometry";',
    ],
    [
      'normalized-public',
      'app/composition.ts',
      'import "@/features/b/domain/../public";',
    ],
  ])('allows %s', (name, file, contents) => {
    const result = lint(name, file, contents);
    expect(result.output).not.toContain('folio-architecture(boundaries)');
    expect(result.status, result.output).toBe(0);
  });
});
