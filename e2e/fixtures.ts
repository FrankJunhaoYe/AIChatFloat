import { test as base, chromium, type BrowserContext } from '@playwright/test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXT_PATH = resolve(fileURLToPath(new URL('.', import.meta.url)), '../.output/chrome-mv3');

export const test = base.extend<{ context: BrowserContext }>({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false, // MV3 extensions require a headed (or new-headless) Chromium
      args: [
        `--disable-extensions-except=${EXT_PATH}`,
        `--load-extension=${EXT_PATH}`,
        '--no-first-run',
      ],
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? (await context.newPage());
    await use(page);
  },
});

export const expect = test.expect;
