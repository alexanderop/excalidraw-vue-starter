import { defineConfig } from 'vitest/config';
import { drawingPointer } from './tests/browser/drawingCommands.js';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.ts'],
        },
      },
      {
        extends: true,
        plugins: [vue()],
        optimizeDeps: { include: ['vue', 'reka-ui', '@lucide/vue'] },
        test: {
          name: 'browser',
          include: ['tests/browser/**/*.test.ts'],
          browser: {
            enabled: true,
            commands: { drawingPointer },
            provider: playwright({ launchOptions: { channel: 'chrome' } }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
