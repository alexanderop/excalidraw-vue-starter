import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/pwa',
  use: {
    baseURL: 'http://127.0.0.1:43720/excalidraw-vue-starter/',
    channel: 'chrome',
  },
  webServer: {
    command:
      'VITE_BASE_PATH=/excalidraw-vue-starter/ pnpm build && VITE_BASE_PATH=/excalidraw-vue-starter/ pnpm exec vite preview --host 127.0.0.1 --port 43720 --strictPort',
    url: 'http://127.0.0.1:43720/excalidraw-vue-starter/',
    reuseExistingServer: false,
  },
});
