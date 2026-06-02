import { defineConfig } from '@playwright/test';

const PORT = 5599;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: 'node e2e/serve.mjs',
    url: `http://localhost:${PORT}/mock-chatgpt.html`,
    reuseExistingServer: true,
    env: { E2E_PORT: String(PORT) },
  },
});
